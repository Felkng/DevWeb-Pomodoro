import { describe, it, expect, vi } from "vitest";
import { createActor } from "xstate";
import { maquinaSessaoFoco } from "./maquinaSessaoFoco";
import { PresetDto } from "../../presets/dominio/Preset";

describe("maquinaSessaoFoco (XState v5)", () => {
  const presetTeste: PresetDto = {
    id: "preset-teste",
    nome: "Teste Foco",
    tempoFocoMin: 25,
    tempoPausaCurtaMin: 5,
    ciclosAntesPausaLonga: 2,
    tempoPausaLongaMin: 15,
    criadoEm: 1000,
    atualizadoEm: 1000,
  };

  it("deve iniciar no estado ocioso", () => {
    const ator = createActor(maquinaSessaoFoco);
    ator.start();

    expect(ator.getSnapshot().value).toBe("ocioso");
    expect(ator.getSnapshot().context.sessao).toBeNull();
  });

  it("deve transicionar para emExecucao ao receber evento INICIAR", () => {
    const ator = createActor(maquinaSessaoFoco);
    ator.start();

    ator.send({ type: "INICIAR", preset: presetTeste, agora: 1000 });

    const snapshot = ator.getSnapshot();
    expect(snapshot.value).toBe("emExecucao");
    expect(snapshot.context.sessao?.paraDto().faseAtual).toBe("foco");
    expect(snapshot.context.sessao?.paraDto().cicloAtual).toBe(1);
  });

  it("deve pausar e retomar a sessao", () => {
    const ator = createActor(maquinaSessaoFoco);
    ator.start();

    ator.send({ type: "INICIAR", preset: presetTeste, agora: 1000 });
    ator.send({ type: "PAUSAR", agora: 2000 });
    expect(ator.getSnapshot().value).toBe("pausado");

    ator.send({ type: "RETOMAR", agora: 5000 });
    expect(ator.getSnapshot().value).toBe("emExecucao");
  });

  it("deve pular fase sem incrementar ciclo (RN-03)", () => {
    const ator = createActor(maquinaSessaoFoco);
    ator.start();

    ator.send({ type: "INICIAR", preset: presetTeste, agora: 1000 });
    ator.send({ type: "PULAR_FASE", agora: 2000 });

    const snapshot = ator.getSnapshot();
    expect(snapshot.context.sessao?.paraDto().faseAtual).toBe("pausaCurta");
    expect(snapshot.context.sessao?.paraDto().cicloAtual).toBe(1);
  });

  it("deve reiniciar ciclos retornando ao ciclo 1 em foco (RN-04)", () => {
    const ator = createActor(maquinaSessaoFoco);
    ator.start();

    ator.send({ type: "INICIAR", preset: presetTeste, agora: 1000 });
    ator.send({ type: "PULAR_FASE", agora: 2000 });
    ator.send({ type: "REINICIAR_CICLOS", agora: 3000 });

    const snapshot = ator.getSnapshot();
    expect(snapshot.context.sessao?.paraDto().faseAtual).toBe("foco");
    expect(snapshot.context.sessao?.paraDto().cicloAtual).toBe(1);
  });

  it("deve encerrar sessao voltando ao estado ocioso", () => {
    const ator = createActor(maquinaSessaoFoco);
    ator.start();

    ator.send({ type: "INICIAR", preset: presetTeste, agora: 1000 });
    ator.send({ type: "ENCERRAR" });

    expect(ator.getSnapshot().value).toBe("ocioso");
    expect(ator.getSnapshot().context.sessao).toBeNull();
  });

  it("ao receber VERIFICAR_TICK com timestamp vencido, deve transicionar fase e chamar alerta sonoro (RN-13)", () => {
    const alertaMock = vi.fn();
    const ator = createActor(
      maquinaSessaoFoco.provide({
        actions: {
          tocarAlertaSonoro: alertaMock,
        },
      })
    );
    ator.start();

    ator.send({ type: "INICIAR", preset: presetTeste, agora: 0 });
    const fimFoco = 25 * 60 * 1000;

    ator.send({ type: "VERIFICAR_TICK", agora: fimFoco + 10 });

    const snapshot = ator.getSnapshot();
    expect(snapshot.context.sessao?.paraDto().faseAtual).toBe("pausaCurta");
    expect(alertaMock).toHaveBeenCalled();
  });

  it("deve transicionar para concluido ao concluir a ultima fase (pausaLonga) sem loops", () => {
    const alertaMock = vi.fn();
    const ator = createActor(
      maquinaSessaoFoco.provide({
        actions: {
          tocarAlertaSonoro: alertaMock,
        },
      })
    );
    ator.start();

    // Preset com 1 ciclo
    const presetUmCiclo: PresetDto = {
      ...presetTeste,
      ciclosAntesPausaLonga: 1,
    };

    ator.send({ type: "INICIAR", preset: presetUmCiclo, agora: 0 });
    // Foco (25m) vence
    ator.send({ type: "VERIFICAR_TICK", agora: 25 * 60 * 1000 + 1 });
    expect(ator.getSnapshot().context.sessao?.paraDto().faseAtual).toBe("pausaLonga");
    expect(alertaMock).toHaveBeenCalledTimes(1);

    // Pausa longa (15m -> total 40m) vence
    ator.send({ type: "VERIFICAR_TICK", agora: 40 * 60 * 1000 + 1 });
    const snapshotConcluido = ator.getSnapshot();
    expect(snapshotConcluido.value).toBe("concluido");
    expect(snapshotConcluido.context.sessao?.paraDto().status).toBe("concluida");
    expect(alertaMock).toHaveBeenCalledTimes(2);

    // Ticks subsequentes não devem tocar áudio repetidamente
    ator.send({ type: "VERIFICAR_TICK", agora: 41 * 60 * 1000 });
    expect(alertaMock).toHaveBeenCalledTimes(2);
  });

  it("deve transicionar para concluido ao pular a ultima fase (pausaLonga)", () => {
    const ator = createActor(maquinaSessaoFoco);
    ator.start();

    const presetUmCiclo: PresetDto = {
      ...presetTeste,
      ciclosAntesPausaLonga: 1,
    };

    ator.send({ type: "INICIAR", preset: presetUmCiclo, agora: 0 });
    // Pular foco -> vai para pausaLonga
    ator.send({ type: "PULAR_FASE", agora: 1000 });
    expect(ator.getSnapshot().context.sessao?.paraDto().faseAtual).toBe("pausaLonga");

    // Pular pausaLonga -> conclui sessão (UC06 1a)
    ator.send({ type: "PULAR_FASE", agora: 2000 });
    const snapshot = ator.getSnapshot();
    expect(snapshot.value).toBe("concluido");
    expect(snapshot.context.sessao?.paraDto().status).toBe("concluida");
  });
});
