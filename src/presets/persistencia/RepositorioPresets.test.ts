import { describe, it, expect, beforeEach } from "vitest";
import { RepositorioPresets } from "./RepositorioPresets";
import { ArmazenamentoLocal } from "../../compartilhado/infraestrutura/persistencia/ArmazenamentoLocal";
import { Preset } from "../dominio/Preset";
import {
  NomePreset,
  MinutosFoco,
  MinutosPausaCurta,
  CiclosAntesPausaLonga,
  MinutosPausaLonga,
} from "../dominio/ValoresPreset";
import { IdentificadorId } from "../../compartilhado/dominio/IdentificadorId";
import { TimestampMs } from "../../compartilhado/dominio/TimestampMs";

describe("RepositorioPresets", () => {
  let armazenamento: ArmazenamentoLocal;
  let repositorio: RepositorioPresets;

  beforeEach(() => {
    localStorage.clear();
    armazenamento = new ArmazenamentoLocal();
    repositorio = new RepositorioPresets(armazenamento);
  });

  it("deve carregar preset padrao Pomodoro quando armazenamento estiver vazio", () => {
    const lista = repositorio.carregar();
    expect(lista.quantidade()).toBe(1);

    const padrao = lista.paraArray()[0].paraDto();
    expect(padrao.nome).toBe("Pomodoro Padrão");
    expect(padrao.tempoFocoMin).toBe(25);
    expect(padrao.tempoPausaCurtaMin).toBe(5);
    expect(padrao.ciclosAntesPausaLonga).toBe(4);
    expect(padrao.tempoPausaLongaMin).toBe(15);
  });

  it("deve salvar e carregar presets customizados", () => {
    const novoPreset = Preset.criar({
      id: IdentificadorId.deString("custom-1").obterValor(),
      nome: NomePreset.criar("Ultra Foco").obterValor(),
      tempoFocoMin: MinutosFoco.criar(50).obterValor(),
      tempoPausaCurtaMin: MinutosPausaCurta.criar(10).obterValor(),
      ciclosAntesPausaLonga: CiclosAntesPausaLonga.criar(2).obterValor(),
      tempoPausaLongaMin: MinutosPausaLonga.criar(30).obterValor(),
      criadoEm: TimestampMs.deNumero(1000),
      atualizadoEm: TimestampMs.deNumero(1000),
    });

    const listaInicial = repositorio.carregar();
    const listaAtualizada = listaInicial.adicionar(novoPreset);
    const resultado = repositorio.salvar(listaAtualizada);
    expect(resultado.temSucesso()).toBe(true);

    const listaRecarregada = repositorio.carregar();
    expect(listaRecarregada.quantidade()).toBe(2);
    expect(listaRecarregada.obterPorId(novoPreset.obterId())?.paraDto().nome).toBe("Ultra Foco");
  });
});
