import { IdentificadorId } from "../../compartilhado/dominio/IdentificadorId";
import { TimestampMs } from "../../compartilhado/dominio/TimestampMs";
import {
  TituloTarefa,
  EstadoTarefa,
  PrioridadeTarefa,
  TipoEstadoTarefa,
  TipoPrioridadeTarefa,
} from "./ValoresTarefa";

export interface TarefaDto {
  readonly id: string;
  readonly titulo: string;
  readonly estado: TipoEstadoTarefa;
  readonly prioridade: TipoPrioridadeTarefa;
  readonly criadoEm: number;
  readonly atualizadoEm: number;
}

export class StatusTarefa {
  public readonly estado: EstadoTarefa;
  public readonly prioridade: PrioridadeTarefa;

  public constructor(estado: EstadoTarefa, prioridade: PrioridadeTarefa) {
    this.estado = estado;
    this.prioridade = prioridade;
  }
}

export class MarcasTemporaisTarefa {
  public readonly criadoEm: TimestampMs;
  public readonly atualizadoEm: TimestampMs;

  public constructor(criadoEm: TimestampMs, atualizadoEm: TimestampMs) {
    this.criadoEm = criadoEm;
    this.atualizadoEm = atualizadoEm;
  }
}

export class IdentidadeTarefa {
  public readonly id: IdentificadorId;
  public readonly titulo: TituloTarefa;

  public constructor(id: IdentificadorId, titulo: TituloTarefa) {
    this.id = id;
    this.titulo = titulo;
  }
}

export class RegistroTarefa {
  public readonly status: StatusTarefa;
  public readonly marcas: MarcasTemporaisTarefa;

  public constructor(status: StatusTarefa, marcas: MarcasTemporaisTarefa) {
    this.status = status;
    this.marcas = marcas;
  }
}

export class Tarefa {
  private readonly identidade: IdentidadeTarefa;
  private readonly registro: RegistroTarefa;

  public constructor(identidade: IdentidadeTarefa, registro: RegistroTarefa) {
    this.identidade = identidade;
    this.registro = registro;
  }

  public static criar(parametros: {
    id: IdentificadorId;
    titulo: TituloTarefa;
    estado: EstadoTarefa;
    prioridade: PrioridadeTarefa;
    criadoEm: TimestampMs;
    atualizadoEm: TimestampMs;
  }): Tarefa {
    const identidade = new IdentidadeTarefa(parametros.id, parametros.titulo);
    const status = new StatusTarefa(parametros.estado, parametros.prioridade);
    const marcas = new MarcasTemporaisTarefa(parametros.criadoEm, parametros.atualizadoEm);
    const registro = new RegistroTarefa(status, marcas);
    return new Tarefa(identidade, registro);
  }

  public obterId(): IdentificadorId {
    return this.identidade.id;
  }

  public obterEstado(): EstadoTarefa {
    return this.registro.status.estado;
  }

  public obterPrioridade(): PrioridadeTarefa {
    return this.registro.status.prioridade;
  }

  public atualizar(parametros: {
    titulo: TituloTarefa;
    estado: EstadoTarefa;
    prioridade: PrioridadeTarefa;
    atualizadoEm: TimestampMs;
  }): Tarefa {
    const novaIdentidade = new IdentidadeTarefa(this.identidade.id, parametros.titulo);
    const novoStatus = new StatusTarefa(parametros.estado, parametros.prioridade);
    const novasMarcas = new MarcasTemporaisTarefa(
      this.registro.marcas.criadoEm,
      parametros.atualizadoEm
    );
    const novoRegistro = new RegistroTarefa(novoStatus, novasMarcas);
    return new Tarefa(novaIdentidade, novoRegistro);
  }

  public paraDto(): TarefaDto {
    return {
      id: this.identidade.id.obterValor(),
      titulo: this.identidade.titulo.obterValor(),
      estado: this.registro.status.estado.obterValor(),
      prioridade: this.registro.status.prioridade.obterValor(),
      criadoEm: this.registro.marcas.criadoEm.obterMilissegundos(),
      atualizadoEm: this.registro.marcas.atualizadoEm.obterMilissegundos(),
    };
  }
}
