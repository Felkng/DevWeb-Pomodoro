import { IdentificadorId } from "../../compartilhado/dominio/IdentificadorId";
import { TimestampMs } from "../../compartilhado/dominio/TimestampMs";

export type TipoFaseSessao = "foco" | "pausaCurta" | "pausaLonga";
export type TipoStatusSessao = "emAndamento" | "pausada" | "concluida";

export interface SnapshotPresetProps {
  readonly tempoFocoMin: number;
  readonly tempoPausaCurtaMin: number;
  readonly ciclosAntesPausaLonga: number;
  readonly tempoPausaLongaMin: number;
}

export class SnapshotPreset {
  public readonly tempoFocoMin: number;
  public readonly tempoPausaCurtaMin: number;
  public readonly ciclosAntesPausaLonga: number;
  public readonly tempoPausaLongaMin: number;

  public constructor(props: SnapshotPresetProps) {
    this.tempoFocoMin = props.tempoFocoMin;
    this.tempoPausaCurtaMin = props.tempoPausaCurtaMin;
    this.ciclosAntesPausaLonga = props.ciclosAntesPausaLonga;
    this.tempoPausaLongaMin = props.tempoPausaLongaMin;
  }
}

export interface SessaoAtivaDto {
  readonly id: string;
  readonly presetId: string;
  readonly snapshotPreset: SnapshotPresetProps;
  readonly faseAtual: TipoFaseSessao;
  readonly cicloAtual: number;
  readonly status: TipoStatusSessao;
  readonly inicioFaseEm: number;
  readonly fimFasePrevistoEm: number;
  readonly pausadaEm: number | null;
  readonly tempoRestanteAoPausarMs: number | null;
}

export class EstadoExecucaoSessao {
  public readonly status: TipoStatusSessao;
  public readonly faseAtual: TipoFaseSessao;
  public readonly cicloAtual: number;

  public constructor(
    status: TipoStatusSessao,
    faseAtual: TipoFaseSessao,
    cicloAtual: number
  ) {
    this.status = status;
    this.faseAtual = faseAtual;
    this.cicloAtual = cicloAtual;
  }
}

export class TimestampsSessao {
  public readonly inicioFaseEm: TimestampMs;
  public readonly fimFasePrevistoEm: TimestampMs;
  public readonly pausadaEm: TimestampMs | null;
  public readonly tempoRestanteAoPausarMs: number | null;

  public constructor(
    inicioFaseEm: TimestampMs,
    fimFasePrevistoEm: TimestampMs,
    pausadaEm: TimestampMs | null,
    tempoRestanteAoPausarMs: number | null
  ) {
    this.inicioFaseEm = inicioFaseEm;
    this.fimFasePrevistoEm = fimFasePrevistoEm;
    this.pausadaEm = pausadaEm;
    this.tempoRestanteAoPausarMs = tempoRestanteAoPausarMs;
  }
}

export class IdentidadeSessao {
  public readonly id: IdentificadorId;
  public readonly presetId: string;
  public readonly snapshot: SnapshotPreset;

  public constructor(
    id: IdentificadorId,
    presetId: string,
    snapshot: SnapshotPreset
  ) {
    this.id = id;
    this.presetId = presetId;
    this.snapshot = snapshot;
  }
}

export class DadosVariaveisSessao {
  public readonly estado: EstadoExecucaoSessao;
  public readonly timestamps: TimestampsSessao;

  public constructor(
    estado: EstadoExecucaoSessao,
    timestamps: TimestampsSessao
  ) {
    this.estado = estado;
    this.timestamps = timestamps;
  }
}

export class SessaoAtiva {
  private readonly identidade: IdentidadeSessao;
  private readonly dados: DadosVariaveisSessao;

  public constructor(
    identidade: IdentidadeSessao,
    dados: DadosVariaveisSessao
  ) {
    this.identidade = identidade;
    this.dados = dados;
  }

  public static iniciar(parametros: {
    id: IdentificadorId;
    presetId: string;
    snapshot: SnapshotPreset;
    momentoInicio: TimestampMs;
  }): SessaoAtiva {
    const identidade = new IdentidadeSessao(
      parametros.id,
      parametros.presetId,
      parametros.snapshot
    );
    const estado = new EstadoExecucaoSessao("emAndamento", "foco", 1);
    const fimPrevisto = parametros.momentoInicio.somarMinutos(
      parametros.snapshot.tempoFocoMin
    );
    const timestamps = new TimestampsSessao(
      parametros.momentoInicio,
      fimPrevisto,
      null,
      null
    );
    return new SessaoAtiva(identidade, new DadosVariaveisSessao(estado, timestamps));
  }

  public pausar(momentoPausa: TimestampMs): SessaoAtiva {
    const fimPrevisto = this.dados.timestamps.fimFasePrevistoEm;
    const tempoRestante = Math.max(0, fimPrevisto.diferencaPara(momentoPausa));

    const novoEstado = new EstadoExecucaoSessao(
      "pausada",
      this.dados.estado.faseAtual,
      this.dados.estado.cicloAtual
    );
    const novosTimestamps = new TimestampsSessao(
      this.dados.timestamps.inicioFaseEm,
      this.dados.timestamps.fimFasePrevistoEm,
      momentoPausa,
      tempoRestante
    );
    return new SessaoAtiva(
      this.identidade,
      new DadosVariaveisSessao(novoEstado, novosTimestamps)
    );
  }

  public retomar(momentoRetomada: TimestampMs): SessaoAtiva {
    let tempoRestante = 0;
    if (this.dados.timestamps.tempoRestanteAoPausarMs) {
      tempoRestante = this.dados.timestamps.tempoRestanteAoPausarMs;
    }
    const novoFim = momentoRetomada.somarMilissegundos(tempoRestante);

    const novoEstado = new EstadoExecucaoSessao(
      "emAndamento",
      this.dados.estado.faseAtual,
      this.dados.estado.cicloAtual
    );
    const novosTimestamps = new TimestampsSessao(
      momentoRetomada,
      novoFim,
      null,
      null
    );
    return new SessaoAtiva(
      this.identidade,
      new DadosVariaveisSessao(novoEstado, novosTimestamps)
    );
  }

  public obterIdentidade(): IdentidadeSessao {
    return this.identidade;
  }

  public obterDados(): DadosVariaveisSessao {
    return this.dados;
  }

  public paraDto(): SessaoAtivaDto {
    let pausadaEmMs: number | null = null;
    if (this.dados.timestamps.pausadaEm) {
      pausadaEmMs = this.dados.timestamps.pausadaEm.obterMilissegundos();
    }

    return {
      id: this.identidade.id.obterValor(),
      presetId: this.identidade.presetId,
      snapshotPreset: this.identidade.snapshot,
      faseAtual: this.dados.estado.faseAtual,
      cicloAtual: this.dados.estado.cicloAtual,
      status: this.dados.estado.status,
      inicioFaseEm: this.dados.timestamps.inicioFaseEm.obterMilissegundos(),
      fimFasePrevistoEm: this.dados.timestamps.fimFasePrevistoEm.obterMilissegundos(),
      pausadaEm: pausadaEmMs,
      tempoRestanteAoPausarMs: this.dados.timestamps.tempoRestanteAoPausarMs,
    };
  }
}
