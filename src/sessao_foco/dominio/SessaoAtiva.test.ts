import { describe, it, expect } from "vitest";
import { SessaoAtiva, SnapshotPreset } from "./SessaoAtiva";
import { TimestampMs } from "../../compartilhado/dominio/TimestampMs";
import { IdentificadorId } from "../../compartilhado/dominio/IdentificadorId";
import { CalculadorFases } from "./CalculadorFases";

describe("SessaoAtiva e CalculadorFases (RN-03, RN-04, RN-05, RN-06, RN-07, RN-08)", () => {
  const snapshotPadrao = new SnapshotPreset({
    tempoFocoMin: 25,
    tempoPausaCurtaMin: 5,
    ciclosAntesPausaLonga: 4,
    tempoPausaLongaMin: 15,
  });

  const criarSessaoInicial = (agoraMs = 1000) => {
    return SessaoAtiva.iniciar({
      id: IdentificadorId.deString("sessao-1").obterValor(),
      presetId: "preset-padrao",
      snapshot: snapshotPadrao,
      momentoInicio: TimestampMs.deNumero(agoraMs),
    });
  };

  it("deve iniciar sessao no ciclo 1 e fase de foco com fim previsto calculado (RN-05, RF-05)", () => {
    const sessao = criarSessaoInicial(1000);
    const dto = sessao.paraDto();

    expect(dto.faseAtual).toBe("foco");
    expect(dto.cicloAtual).toBe(1);
    expect(dto.status).toBe("emAndamento");
    expect(dto.inicioFaseEm).toBe(1000);
    expect(dto.fimFasePrevistoEm).toBe(1000 + 25 * 60 * 1000);
  });

  it("deve pausar preservando tempo restante e congelar contagem (RN-06, RF-06)", () => {
    const sessao = criarSessaoInicial(1000);
    // Pausar 5 minutos depois (restam 20 minutos de foco)
    const momentoPausa = TimestampMs.deNumero(1000 + 5 * 60 * 1000);
    const pausada = sessao.pausar(momentoPausa);
    const dto = pausada.paraDto();

    expect(dto.status).toBe("pausada");
    expect(dto.pausadaEm).toBe(momentoPausa.obterMilissegundos());
    expect(dto.tempoRestanteAoPausarMs).toBe(20 * 60 * 1000);
  });

  it("deve retomar recalculando o fim previsto com base no tempo restante (RF-07)", () => {
    const sessao = criarSessaoInicial(1000);
    const momentoPausa = TimestampMs.deNumero(1000 + 5 * 60 * 1000);
    const pausada = sessao.pausar(momentoPausa);

    // Retomar 1 hora depois
    const momentoRetomada = TimestampMs.deNumero(1000 + 65 * 60 * 1000);
    const retomada = pausada.retomar(momentoRetomada);
    const dto = retomada.paraDto();

    expect(dto.status).toBe("emAndamento");
    expect(dto.pausadaEm).toBeNull();
    expect(dto.tempoRestanteAoPausarMs).toBeNull();
    // Fim previsto = momento da retomada + 20 minutos restantes
    expect(dto.fimFasePrevistoEm).toBe(momentoRetomada.obterMilissegundos() + 20 * 60 * 1000);
  });

  it("pular fase de foco ou de pausa NAO incrementa ciclo (RN-03, RF-08)", () => {
    const sessao = criarSessaoInicial(1000);
    const momentoPulo = TimestampMs.deNumero(2000);

    const proximaAposFoco = CalculadorFases.pularFase(sessao, momentoPulo);
    expect(proximaAposFoco.paraDto().faseAtual).toBe("pausaCurta");
    expect(proximaAposFoco.paraDto().cicloAtual).toBe(1);

    const proximaAposPausa = CalculadorFases.pularFase(proximaAposFoco, momentoPulo);
    expect(proximaAposPausa.paraDto().faseAtual).toBe("foco");
    expect(proximaAposPausa.paraDto().cicloAtual).toBe(1); // RN-03: Não incrementa contagem de ciclos!
  });

  it("concluir fase normalmente incrementa o ciclo ao sair da pausa (RN-03)", () => {
    const sessao = criarSessaoInicial(1000);
    const fimFoco = TimestampMs.deNumero(sessao.paraDto().fimFasePrevistoEm);

    // Vence foco -> vai para pausa curta
    const emPausaCurta = CalculadorFases.concluirFaseAtual(sessao, fimFoco);
    expect(emPausaCurta.paraDto().faseAtual).toBe("pausaCurta");
    expect(emPausaCurta.paraDto().cicloAtual).toBe(1);

    // Vence pausa curta -> vai para foco ciclo 2
    const fimPausa = TimestampMs.deNumero(emPausaCurta.paraDto().fimFasePrevistoEm);
    const focoCiclo2 = CalculadorFases.concluirFaseAtual(emPausaCurta, fimPausa);
    expect(focoCiclo2.paraDto().faseAtual).toBe("foco");
    expect(focoCiclo2.paraDto().cicloAtual).toBe(2);
  });

  it("reiniciar ciclos retorna ao ciclo 1 e fase foco mantendo snapshot (RN-04, RF-09)", () => {
    const sessao = criarSessaoInicial(1000);
    const momentoReinicio = TimestampMs.deNumero(5000);
    const reiniciada = CalculadorFases.reiniciarCiclos(sessao, momentoReinicio);
    const dto = reiniciada.paraDto();

    expect(dto.cicloAtual).toBe(1);
    expect(dto.faseAtual).toBe("foco");
    expect(dto.fimFasePrevistoEm).toBe(5000 + 25 * 60 * 1000);
  });

  describe("Recalculo por Timestamps ao reabrir navegador (RN-07, RN-08, UC10)", () => {
    it("deve manter pausada se a sessao estava pausada ao reabrir (RN-06)", () => {
      const sessao = criarSessaoInicial(1000);
      const momentoPausa = TimestampMs.deNumero(2000);
      const pausada = sessao.pausar(momentoPausa);

      const momentoReabertura = TimestampMs.deNumero(1000000);
      const recalculada = CalculadorFases.recalcularAposReabertura(pausada, momentoReabertura);
      expect(recalculada.paraDto().status).toBe("pausada");
    });

    it("deve avancar sequencialmente as fases vencidas enquanto navegador esteve fechado (RN-07)", () => {
      const sessao = criarSessaoInicial(0); // Foco termina em 25 min (1500000 ms)
      // Reaberto no minuto 27 (1620000 ms): Foco já venceu, está no minuto 2 da Pausa Curta (5 min)
      const momentoReabertura = TimestampMs.deNumero(27 * 60 * 1000);
      const recalculada = CalculadorFases.recalcularAposReabertura(sessao, momentoReabertura);

      expect(recalculada.paraDto().faseAtual).toBe("pausaCurta");
      expect(recalculada.paraDto().cicloAtual).toBe(1);
      expect(recalculada.paraDto().status).toBe("emAndamento");
    });

    it("deve concluir a sessao se todas as fases previstas venceram durante fechamento (RN-08)", () => {
      const sessao = criarSessaoInicial(0);
      // Reaberto 24 horas depois
      const reaberturaMuitasHorasDepois = TimestampMs.deNumero(24 * 60 * 60 * 1000);
      const recalculada = CalculadorFases.recalcularAposReabertura(sessao, reaberturaMuitasHorasDepois);

      expect(recalculada.paraDto().status).toBe("concluida");
    });
  });
});
