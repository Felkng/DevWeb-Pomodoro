import { describe, it, expect } from "vitest";
import { Preset } from "./Preset";
import {
  NomePreset,
  MinutosFoco,
  MinutosPausaCurta,
  CiclosAntesPausaLonga,
  MinutosPausaLonga,
} from "./ValoresPreset";
import { IdentificadorId } from "../../compartilhado/dominio/IdentificadorId";
import { TimestampMs } from "../../compartilhado/dominio/TimestampMs";
import { ListaPresets } from "./ListaPresets";

describe("Preset e ListaPresets", () => {
  const criarPresetPadrao = (idStr = "preset-1", nomeStr = "Padrão") => {
    return Preset.criar({
      id: IdentificadorId.deString(idStr).obterValor(),
      nome: NomePreset.criar(nomeStr).obterValor(),
      tempoFocoMin: MinutosFoco.criar(25).obterValor(),
      tempoPausaCurtaMin: MinutosPausaCurta.criar(5).obterValor(),
      ciclosAntesPausaLonga: CiclosAntesPausaLonga.criar(4).obterValor(),
      tempoPausaLongaMin: MinutosPausaLonga.criar(15).obterValor(),
      criadoEm: TimestampMs.deNumero(1000),
      atualizadoEm: TimestampMs.deNumero(1000),
    });
  };

  it("deve criar um preset e fornecer propriedades via DTO", () => {
    const preset = criarPresetPadrao();
    const dto = preset.paraDto();

    expect(dto.id).toBe("preset-1");
    expect(dto.nome).toBe("Padrão");
    expect(dto.tempoFocoMin).toBe(25);
    expect(dto.tempoPausaCurtaMin).toBe(5);
    expect(dto.ciclosAntesPausaLonga).toBe(4);
    expect(dto.tempoPausaLongaMin).toBe(15);
  });

  it("deve atualizar nome e tempos gerando nova instância com atualizadoEm novo", () => {
    const preset = criarPresetPadrao();
    const atualizado = preset.atualizar({
      nome: NomePreset.criar("Novo Nome").obterValor(),
      tempoFocoMin: MinutosFoco.criar(30).obterValor(),
      tempoPausaCurtaMin: MinutosPausaCurta.criar(10).obterValor(),
      ciclosAntesPausaLonga: CiclosAntesPausaLonga.criar(3).obterValor(),
      tempoPausaLongaMin: MinutosPausaLonga.criar(20).obterValor(),
      atualizadoEm: TimestampMs.deNumero(2000),
    });

    const dto = atualizado.paraDto();
    expect(dto.nome).toBe("Novo Nome");
    expect(dto.tempoFocoMin).toBe(30);
    expect(dto.atualizadoEm).toBe(2000);
    expect(dto.criadoEm).toBe(1000);
  });

  describe("ListaPresets (First Class Collection)", () => {
    it("deve inicializar com presets e permitir adicionar, buscar e remover", () => {
      const p1 = criarPresetPadrao("id-1", "Preset 1");
      const p2 = criarPresetPadrao("id-2", "Preset 2");
      const lista = ListaPresets.criarVazia().adicionar(p1).adicionar(p2);

      expect(lista.quantidade()).toBe(2);
      expect(lista.obterPorId(p1.obterId())?.paraDto().nome).toBe("Preset 1");

      const semP1 = lista.remover(p1.obterId());
      expect(semP1.quantidade()).toBe(1);
      expect(semP1.obterPorId(p1.obterId())).toBeUndefined();
    });

    it("deve atualizar preset na lista substituindo pelo ID", () => {
      const p1 = criarPresetPadrao("id-1", "Original");
      const lista = ListaPresets.criarVazia().adicionar(p1);

      const p1Atualizado = p1.atualizar({
        nome: NomePreset.criar("Modificado").obterValor(),
        tempoFocoMin: MinutosFoco.criar(25).obterValor(),
        tempoPausaCurtaMin: MinutosPausaCurta.criar(5).obterValor(),
        ciclosAntesPausaLonga: CiclosAntesPausaLonga.criar(4).obterValor(),
        tempoPausaLongaMin: MinutosPausaLonga.criar(15).obterValor(),
        atualizadoEm: TimestampMs.deNumero(2000),
      });

      const listaAtualizada = lista.atualizar(p1Atualizado);
      expect(listaAtualizada.obterPorId(p1.obterId())?.paraDto().nome).toBe("Modificado");
    });
  });
});
