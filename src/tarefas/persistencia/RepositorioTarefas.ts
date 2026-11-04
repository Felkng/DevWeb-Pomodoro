import { ArmazenamentoLocal } from "../../compartilhado/infraestrutura/persistencia/ArmazenamentoLocal";
import { Resultado } from "../../compartilhado/dominio/Resultado";
import { IdentificadorId } from "../../compartilhado/dominio/IdentificadorId";
import { TimestampMs } from "../../compartilhado/dominio/TimestampMs";
import { Tarefa, TarefaDto } from "../dominio/Tarefa";
import { ListaTarefas } from "../dominio/ListaTarefas";
import {
  TituloTarefa,
  EstadoTarefa,
  PrioridadeTarefa,
} from "../dominio/ValoresTarefa";

export class RepositorioTarefas {
  private static readonly CHAVE_STORAGE = "pomodoro.tarefas";
  private readonly armazenamento: ArmazenamentoLocal;

  public constructor(armazenamento: ArmazenamentoLocal) {
    this.armazenamento = armazenamento;
  }

  public carregar(): ListaTarefas {
    const dados = this.armazenamento.lerItem<readonly TarefaDto[]>(
      RepositorioTarefas.CHAVE_STORAGE
    );
    if (!dados || dados.length === 0) {
      return ListaTarefas.criarVazia();
    }
    const tarefasValidas = dados
      .map((dto) => this.converterDtoParaTarefa(dto))
      .filter((t): t is Tarefa => t !== null);

    return ListaTarefas.deArray(tarefasValidas);
  }

  public salvar(lista: ListaTarefas): Resultado<void, string> {
    const dtos = lista.paraArray().map((t) => t.paraDto());
    return this.armazenamento.gravarItem(RepositorioTarefas.CHAVE_STORAGE, dtos);
  }

  private converterDtoParaTarefa(dto: TarefaDto): Tarefa | null {
    try {
      return Tarefa.criar({
        id: IdentificadorId.deString(dto.id).obterValor(),
        titulo: TituloTarefa.criar(dto.titulo).obterValor(),
        estado: EstadoTarefa.criar(dto.estado).obterValor(),
        prioridade: PrioridadeTarefa.criar(dto.prioridade).obterValor(),
        criadoEm: TimestampMs.deNumero(dto.criadoEm),
        atualizadoEm: TimestampMs.deNumero(dto.atualizadoEm),
      });
    } catch {
      return null;
    }
  }
}
