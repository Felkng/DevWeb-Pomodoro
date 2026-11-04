import { describe, it, expect, beforeEach } from "vitest";
import { RepositorioTarefas } from "./RepositorioTarefas";
import { ArmazenamentoLocal } from "../../compartilhado/infraestrutura/persistencia/ArmazenamentoLocal";
import { Tarefa } from "../dominio/Tarefa";
import {
  TituloTarefa,
  EstadoTarefa,
  PrioridadeTarefa,
} from "../dominio/ValoresTarefa";
import { IdentificadorId } from "../../compartilhado/dominio/IdentificadorId";
import { TimestampMs } from "../../compartilhado/dominio/TimestampMs";

describe("RepositorioTarefas", () => {
  let armazenamento: ArmazenamentoLocal;
  let repositorio: RepositorioTarefas;

  beforeEach(() => {
    localStorage.clear();
    armazenamento = new ArmazenamentoLocal();
    repositorio = new RepositorioTarefas(armazenamento);
  });

  it("deve carregar lista vazia quando armazenamento estiver vazio", () => {
    const lista = repositorio.carregar();
    expect(lista.quantidade()).toBe(0);
  });

  it("deve salvar e carregar tarefas persistidas", () => {
    const tarefa = Tarefa.criar({
      id: IdentificadorId.deString("t-1").obterValor(),
      titulo: TituloTarefa.criar("Revisar matemática").obterValor(),
      estado: EstadoTarefa.criar("aFazer").obterValor(),
      prioridade: PrioridadeTarefa.criar("alta").obterValor(),
      criadoEm: TimestampMs.deNumero(1000),
      atualizadoEm: TimestampMs.deNumero(1000),
    });

    const lista = repositorio.carregar().adicionar(tarefa);
    const resultado = repositorio.salvar(lista);
    expect(resultado.temSucesso()).toBe(true);

    const recarregada = repositorio.carregar();
    expect(recarregada.quantidade()).toBe(1);
    expect(recarregada.obterPorId(tarefa.obterId())?.paraDto().titulo).toBe("Revisar matemática");
  });
});
