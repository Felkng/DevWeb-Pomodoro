import { IdentificadorId } from "../../compartilhado/dominio/IdentificadorId";
import { TimestampMs } from "../../compartilhado/dominio/TimestampMs";
import {
  NomePreset,
  MinutosFoco,
  MinutosPausaCurta,
  CiclosAntesPausaLonga,
  MinutosPausaLonga,
} from "./ValoresPreset";

export interface PresetDto {
  readonly id: string;
  readonly nome: string;
  readonly tempoFocoMin: number;
  readonly tempoPausaCurtaMin: number;
  readonly ciclosAntesPausaLonga: number;
  readonly tempoPausaLongaMin: number;
  readonly criadoEm: number;
  readonly atualizadoEm: number;
}

export class TemposPreset {
  private readonly minutosFoco: MinutosFoco;
  private readonly minutosPausaCurta: MinutosPausaCurta;
  public readonly ciclosAntesPausaLonga: CiclosAntesPausaLonga;
  public readonly minutosPausaLonga: MinutosPausaLonga;

  public constructor(
    minutosFoco: MinutosFoco,
    minutosPausaCurta: MinutosPausaCurta,
    ciclosAntesPausaLonga: CiclosAntesPausaLonga,
    minutosPausaLonga: MinutosPausaLonga
  ) {
    this.minutosFoco = minutosFoco;
    this.minutosPausaCurta = minutosPausaCurta;
    this.ciclosAntesPausaLonga = ciclosAntesPausaLonga;
    this.minutosPausaLonga = minutosPausaLonga;
  }

  public obterFoco(): MinutosFoco {
    return this.minutosFoco;
  }

  public obterPausaCurta(): MinutosPausaCurta {
    return this.minutosPausaCurta;
  }
}

export class MarcasTemporais {
  private readonly criadoEm: TimestampMs;
  private readonly atualizadoEm: TimestampMs;

  public constructor(criadoEm: TimestampMs, atualizadoEm: TimestampMs) {
    this.criadoEm = criadoEm;
    this.atualizadoEm = atualizadoEm;
  }

  public obterCriadoEm(): TimestampMs {
    return this.criadoEm;
  }

  public obterAtualizadoEm(): TimestampMs {
    return this.atualizadoEm;
  }
}

export class IdentidadePreset {
  private readonly id: IdentificadorId;
  private readonly nome: NomePreset;

  public constructor(id: IdentificadorId, nome: NomePreset) {
    this.id = id;
    this.nome = nome;
  }

  public obterId(): IdentificadorId {
    return this.id;
  }

  public obterNome(): NomePreset {
    return this.nome;
  }
}

export class ConfiguracaoPreset {
  private readonly tempos: TemposPreset;
  private readonly marcas: MarcasTemporais;

  public constructor(tempos: TemposPreset, marcas: MarcasTemporais) {
    this.tempos = tempos;
    this.marcas = marcas;
  }

  public obterTempos(): TemposPreset {
    return this.tempos;
  }

  public obterMarcas(): MarcasTemporais {
    return this.marcas;
  }
}

export class Preset {
  private readonly identidade: IdentidadePreset;
  private readonly configuracao: ConfiguracaoPreset;

  private constructor(
    identidade: IdentidadePreset,
    configuracao: ConfiguracaoPreset
  ) {
    this.identidade = identidade;
    this.configuracao = configuracao;
  }

  public static criar(parametros: {
    id: IdentificadorId;
    nome: NomePreset;
    tempoFocoMin: MinutosFoco;
    tempoPausaCurtaMin: MinutosPausaCurta;
    ciclosAntesPausaLonga: CiclosAntesPausaLonga;
    tempoPausaLongaMin: MinutosPausaLonga;
    criadoEm: TimestampMs;
    atualizadoEm: TimestampMs;
  }): Preset {
    const identidade = new IdentidadePreset(parametros.id, parametros.nome);
    const tempos = new TemposPreset(
      parametros.tempoFocoMin,
      parametros.tempoPausaCurtaMin,
      parametros.ciclosAntesPausaLonga,
      parametros.tempoPausaLongaMin
    );
    const marcas = new MarcasTemporais(parametros.criadoEm, parametros.atualizadoEm);
    const configuracao = new ConfiguracaoPreset(tempos, marcas);
    return new Preset(identidade, configuracao);
  }

  public obterId(): IdentificadorId {
    return this.identidade.obterId();
  }

  public atualizar(novosParametros: {
    nome: NomePreset;
    tempoFocoMin: MinutosFoco;
    tempoPausaCurtaMin: MinutosPausaCurta;
    ciclosAntesPausaLonga: CiclosAntesPausaLonga;
    tempoPausaLongaMin: MinutosPausaLonga;
    atualizadoEm: TimestampMs;
  }): Preset {
    return Preset.criar({
      id: this.identidade.obterId(),
      nome: novosParametros.nome,
      tempoFocoMin: novosParametros.tempoFocoMin,
      tempoPausaCurtaMin: novosParametros.tempoPausaCurtaMin,
      ciclosAntesPausaLonga: novosParametros.ciclosAntesPausaLonga,
      tempoPausaLongaMin: novosParametros.tempoPausaLongaMin,
      criadoEm: this.configuracao.obterMarcas().obterCriadoEm(),
      atualizadoEm: novosParametros.atualizadoEm,
    });
  }

  public paraDto(): PresetDto {
    const tempos = this.configuracao.obterTempos();
    const marcas = this.configuracao.obterMarcas();
    return {
      id: this.identidade.obterId().obterValor(),
      nome: this.identidade.obterNome().obterValor(),
      tempoFocoMin: tempos.obterFoco().obterValor(),
      tempoPausaCurtaMin: tempos.obterPausaCurta().obterValor(),
      ciclosAntesPausaLonga: tempos.ciclosAntesPausaLonga.obterValor(),
      tempoPausaLongaMin: tempos.minutosPausaLonga.obterValor(),
      criadoEm: marcas.obterCriadoEm().obterMilissegundos(),
      atualizadoEm: marcas.obterAtualizadoEm().obterMilissegundos(),
    };
  }
}
