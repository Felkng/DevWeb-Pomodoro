import { describe, it, expect } from "vitest";
import { Tarefa } from "./Tarefa";
import {
  TituloTarefa,
  EstadoTarefa,
  PrioridadeTarefa,
} from "./ValoresTarefa";
import { IdentificadorId } from "../../compartilhado/dominio/IdentificadorId";
import { TimestampMs } from "../../compartilhado/dominio/TimestampMs";
import { ListaTarefas } from "./ListaTarefas";

describe("Tarefa e ListaTarefas (RN-10)", () => {
  const criarTarefa = (
    idStr: string,
    tituloStr: string,
    prioridadeStr: "alta" | "media" | "baixa",
    estadoStr: "backlog" | "aFazer" | "emExecucao" | "concluida" | "cancelada"
  ) => {
    return Tarefa.criar({
      id: IdentificadorId.deString(idStr).obterValor(),
      titulo: TituloTarefa.criar(tituloStr).obterValor(),
      prioridade: PrioridadeTarefa.criar(prioridadeStr).obterValor(),
      estado: EstadoTarefa.criar(estadoStr).obterValor(),
      criadoEm: TimestampMs.deNumero(1000),
      atualizadoEm: TimestampMs.deNumero(1000),
    });
  };

  it("deve criar tarefa e gerar DTO", () => {
    const tarefa = criarTarefa("t-1", "Estudar React", "alta", "aFazer");
    const dto = tarefa.paraDto();
    expect(dto.id).toBe("t-1");
    expect(dto.titulo).toBe("Estudar React");
    expect(dto.prioridade).toBe("alta");
    expect(dto.estado).toBe("aFazer");
    expect(dto.criadoEm).toBe(1000);
    expect(dto.atualizadoEm).toBe(1000);
  });

  it("deve atualizar tarefa preservando criadoEm e atualizando atualizadoEm", () => {
    const tarefa = criarTarefa("t-1", "Original", "baixa", "backlog");
    const atualizada = tarefa.atualizar({
      titulo: TituloTarefa.criar("Modificado").obterValor(),
      estado: EstadoTarefa.criar("emExecucao").obterValor(),
      prioridade: PrioridadeTarefa.criar("alta").obterValor(),
      atualizadoEm: TimestampMs.deNumero(5000),
    });

    const dto = atualizada.paraDto();
    expect(dto.titulo).toBe("Modificado");
    expect(dto.estado).toBe("emExecucao");
    expect(dto.prioridade).toBe("alta");
    expect(dto.criadoEm).toBe(1000);
    expect(dto.atualizadoEm).toBe(5000);
  });

  describe("ListaTarefas com ordenacao fixa (RN-10)", () => {
    it("deve ordenar primeiro por prioridade decrescente (alta > media > baixa)", () => {
      const tBaixa = criarTarefa("1", "Baixa", "baixa", "aFazer");
      const tAlta = criarTarefa("2", "Alta", "alta", "aFazer");
      const tMedia = criarTarefa("3", "Media", "media", "aFazer");

      const lista = ListaTarefas.criarVazia()
        .adicionar(tBaixa)
        .adicionar(tAlta)
        .adicionar(tMedia);

      const ordenados = lista.paraArrayOrdenado().map((t) => t.paraDto().titulo);
      expect(ordenados).toEqual(["Alta", "Media", "Baixa"]);
    });

    it("deve desempatar por estado: aFazer > emExecucao > concluida > cancelada > backlog", () => {
      const tBacklog = criarTarefa("1", "Backlog", "alta", "backlog");
      const tConcluida = criarTarefa("2", "Concluida", "alta", "concluida");
      const tAFazer = criarTarefa("3", "A Fazer", "alta", "aFazer");
      const tEmExecucao = criarTarefa("4", "Em Execucao", "alta", "emExecucao");
      const tCancelada = criarTarefa("5", "Cancelada", "alta", "cancelada");

      const lista = ListaTarefas.criarVazia()
        .adicionar(tBacklog)
        .adicionar(tConcluida)
        .adicionar(tAFazer)
        .adicionar(tEmExecucao)
        .adicionar(tCancelada);

      const ordenados = lista.paraArrayOrdenado().map((t) => t.paraDto().titulo);
      expect(ordenados).toEqual([
        "A Fazer",
        "Em Execucao",
        "Concluida",
        "Cancelada",
        "Backlog",
      ]);
    });
  });
});
