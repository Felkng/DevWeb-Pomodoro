import { ArmazenamentoLocal } from "../../compartilhado/infraestrutura/persistencia/ArmazenamentoLocal";
import { Resultado } from "../../compartilhado/dominio/Resultado";
import { IdentificadorId } from "../../compartilhado/dominio/IdentificadorId";
import { TimestampMs } from "../../compartilhado/dominio/TimestampMs";
import {
  SessaoAtiva,
  SessaoAtivaDto,
  SnapshotPreset,
  EstadoExecucaoSessao,
  TimestampsSessao,
  IdentidadeSessao,
  DadosVariaveisSessao,
} from "../dominio/SessaoAtiva";
import { CalculadorFases } from "../dominio/CalculadorFases";

export class RepositorioSessaoAtiva {
  private static readonly CHAVE_STORAGE = "pomodoro.sessaoAtiva";
  private readonly armazenamento: ArmazenamentoLocal;

  public constructor(armazenamento: ArmazenamentoLocal) {
    this.armazenamento = armazenamento;
  }

  public carregar(momentoAgora: TimestampMs): SessaoAtiva | null {
    const dto = this.armazenamento.lerItem<SessaoAtivaDto>(
      RepositorioSessaoAtiva.CHAVE_STORAGE
    );
    if (!dto) {
      return null;
    }
    const sessao = this.converterDtoParaSessao(dto);
    if (!sessao) {
      return null;
    }
    return CalculadorFases.recalcularAposReabertura(sessao, momentoAgora);
  }

  public salvar(sessao: SessaoAtiva): Resultado<void, string> {
    return this.armazenamento.gravarItem(
      RepositorioSessaoAtiva.CHAVE_STORAGE,
      sessao.paraDto()
    );
  }

  public limpar(): void {
    this.armazenamento.removerItem(RepositorioSessaoAtiva.CHAVE_STORAGE);
  }

  private converterDtoParaSessao(dto: SessaoAtivaDto): SessaoAtiva | null {
    try {
      const id = IdentificadorId.deString(dto.id).obterValor();
      const snapshot = new SnapshotPreset(dto.snapshotPreset);
      const identidade = new IdentidadeSessao(id, dto.presetId, snapshot);
      const estado = new EstadoExecucaoSessao(
        dto.status,
        dto.faseAtual,
        dto.cicloAtual
      );
      let pausadaEm: TimestampMs | null = null;
      if (dto.pausadaEm) {
        pausadaEm = TimestampMs.deNumero(dto.pausadaEm);
      }
      const timestamps = new TimestampsSessao(
        TimestampMs.deNumero(dto.inicioFaseEm),
        TimestampMs.deNumero(dto.fimFasePrevistoEm),
        pausadaEm,
        dto.tempoRestanteAoPausarMs
      );
      return new SessaoAtiva(identidade, new DadosVariaveisSessao(estado, timestamps));
    } catch {
      return null;
    }
  }
}
