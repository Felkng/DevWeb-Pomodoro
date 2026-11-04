import { IdentificadorId } from "../../compartilhado/dominio/IdentificadorId";
import { Tarefa } from "./Tarefa";
import { TipoEstadoTarefa, TipoPrioridadeTarefa } from "./ValoresTarefa";

export class ListaTarefas {
  private readonly itens: readonly Tarefa[];

  private constructor(itens: readonly Tarefa[]) {
    this.itens = itens;
  }

  public static criarVazia(): ListaTarefas {
    return new ListaTarefas([]);
  }

  public static deArray(tarefas: readonly Tarefa[]): ListaTarefas {
    return new ListaTarefas([...tarefas]);
  }

  public adicionar(tarefa: Tarefa): ListaTarefas {
    return new ListaTarefas([...this.itens, tarefa]);
  }

  public atualizar(tarefaAtualizada: Tarefa): ListaTarefas {
    const novosItens = this.itens.map((item) => {
      if (item.obterId().ehIgual(tarefaAtualizada.obterId())) {
        return tarefaAtualizada;
      }
      return item;
    });
    return new ListaTarefas(novosItens);
  }

  public remover(id: IdentificadorId): ListaTarefas {
    const filtrados = this.itens.filter((item) => !item.obterId().ehIgual(id));
    return new ListaTarefas(filtrados);
  }

  public obterPorId(id: IdentificadorId): Tarefa | undefined {
    return this.itens.find((item) => item.obterId().ehIgual(id));
  }

  public quantidade(): number {
    return this.itens.length;
  }

  public paraArray(): readonly Tarefa[] {
    return this.itens;
  }

  public paraArrayOrdenado(): readonly Tarefa[] {
    const copia = [...this.itens];
    return copia.sort((a, b) => this.compararTarefas(a, b));
  }

  private compararTarefas(a: Tarefa, b: Tarefa): number {
    const pesoPrioridadeA = this.obterPesoPrioridade(a.obterPrioridade().obterValor());
    const pesoPrioridadeB = this.obterPesoPrioridade(b.obterPrioridade().obterValor());
    if (pesoPrioridadeA !== pesoPrioridadeB) {
      return pesoPrioridadeB - pesoPrioridadeA;
    }
    const pesoEstadoA = this.obterPesoEstado(a.obterEstado().obterValor());
    const pesoEstadoB = this.obterPesoEstado(b.obterEstado().obterValor());
    return pesoEstadoB - pesoEstadoA;
  }

  private obterPesoPrioridade(prioridade: TipoPrioridadeTarefa): number {
    const pesos: Record<TipoPrioridadeTarefa, number> = {
      alta: 3,
      media: 2,
      baixa: 1,
    };
    return pesos[prioridade];
  }

  private obterPesoEstado(estado: TipoEstadoTarefa): number {
    const pesos: Record<TipoEstadoTarefa, number> = {
      aFazer: 5,
      emExecucao: 4,
      concluida: 3,
      cancelada: 2,
      backlog: 1,
    };
    return pesos[estado];
  }
}
