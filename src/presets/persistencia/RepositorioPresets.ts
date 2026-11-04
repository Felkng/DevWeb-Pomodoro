import { ArmazenamentoLocal } from "../../compartilhado/infraestrutura/persistencia/ArmazenamentoLocal";
import { Resultado } from "../../compartilhado/dominio/Resultado";
import { IdentificadorId } from "../../compartilhado/dominio/IdentificadorId";
import { TimestampMs } from "../../compartilhado/dominio/TimestampMs";
import { Preset, PresetDto } from "../dominio/Preset";
import { ListaPresets } from "../dominio/ListaPresets";
import {
  NomePreset,
  MinutosFoco,
  MinutosPausaCurta,
  CiclosAntesPausaLonga,
  MinutosPausaLonga,
} from "../dominio/ValoresPreset";

export class RepositorioPresets {
  private static readonly CHAVE_STORAGE = "pomodoro.presets";
  private readonly armazenamento: ArmazenamentoLocal;

  public constructor(armazenamento: ArmazenamentoLocal) {
    this.armazenamento = armazenamento;
  }

  public carregar(): ListaPresets {
    const dados = this.armazenamento.lerItem<readonly PresetDto[]>(
      RepositorioPresets.CHAVE_STORAGE
    );
    if (!dados || dados.length === 0) {
      return this.criarListaPadrao();
    }
    const presetsValidos = dados
      .map((dto) => this.converterDtoParaPreset(dto))
      .filter((p): p is Preset => p !== null);

    if (presetsValidos.length === 0) {
      return this.criarListaPadrao();
    }
    return ListaPresets.deArray(presetsValidos);
  }

  public salvar(lista: ListaPresets): Resultado<void, string> {
    const dtos = lista.paraArray().map((p) => p.paraDto());
    return this.armazenamento.gravarItem(RepositorioPresets.CHAVE_STORAGE, dtos);
  }

  private criarListaPadrao(): ListaPresets {
    const padrao = Preset.criar({
      id: IdentificadorId.deString("preset-padrao-pomodoro").obterValor(),
      nome: NomePreset.criar("Pomodoro Padrão").obterValor(),
      tempoFocoMin: MinutosFoco.criar(25).obterValor(),
      tempoPausaCurtaMin: MinutosPausaCurta.criar(5).obterValor(),
      ciclosAntesPausaLonga: CiclosAntesPausaLonga.criar(4).obterValor(),
      tempoPausaLongaMin: MinutosPausaLonga.criar(15).obterValor(),
      criadoEm: TimestampMs.deNumero(Date.now()),
      atualizadoEm: TimestampMs.deNumero(Date.now()),
    });
    return ListaPresets.criarVazia().adicionar(padrao);
  }

  private converterDtoParaPreset(dto: PresetDto): Preset | null {
    try {
      return Preset.criar({
        id: IdentificadorId.deString(dto.id).obterValor(),
        nome: NomePreset.criar(dto.nome).obterValor(),
        tempoFocoMin: MinutosFoco.criar(dto.tempoFocoMin).obterValor(),
        tempoPausaCurtaMin: MinutosPausaCurta.criar(dto.tempoPausaCurtaMin).obterValor(),
        ciclosAntesPausaLonga: CiclosAntesPausaLonga.criar(dto.ciclosAntesPausaLonga).obterValor(),
        tempoPausaLongaMin: MinutosPausaLonga.criar(dto.tempoPausaLongaMin).obterValor(),
        criadoEm: TimestampMs.deNumero(dto.criadoEm),
        atualizadoEm: TimestampMs.deNumero(dto.atualizadoEm),
      });
    } catch {
      return null;
    }
  }
}
