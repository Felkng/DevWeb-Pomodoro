import { TimestampMs } from "../../compartilhado/dominio/TimestampMs";
import {
  SessaoAtiva,
  TipoFaseSessao,
  EstadoExecucaoSessao,
  TimestampsSessao,
  DadosVariaveisSessao,
} from "./SessaoAtiva";

export class CalculadorFases {
  public static concluirFaseAtual(
    sessao: SessaoAtiva,
    momentoTransicao: TimestampMs
  ): SessaoAtiva {
    return this.avancarProximaFase(sessao, momentoTransicao, true);
  }

  public static pularFase(
    sessao: SessaoAtiva,
    momentoTransicao: TimestampMs
  ): SessaoAtiva {
    return this.avancarProximaFase(sessao, momentoTransicao, false);
  }

  public static reiniciarCiclos(
    sessao: SessaoAtiva,
    momentoReinicio: TimestampMs
  ): SessaoAtiva {
    const snapshot = sessao.obterIdentidade().snapshot;
    const novoFim = momentoReinicio.somarMinutos(snapshot.tempoFocoMin);
    const novoEstado = new EstadoExecucaoSessao("emAndamento", "foco", 1);
    const novosTimestamps = new TimestampsSessao(
      momentoReinicio,
      novoFim,
      null,
      null
    );
    return new SessaoAtiva(
      sessao.obterIdentidade(),
      new DadosVariaveisSessao(novoEstado, novosTimestamps)
    );
  }

  public static recalcularAposReabertura(
    sessao: SessaoAtiva,
    momentoAgora: TimestampMs
  ): SessaoAtiva {
    const dados = sessao.obterDados();
    if (dados.estado.status === "pausada") {
      return sessao;
    }
    let atual = sessao;
    while (atual.obterDados().estado.status === "emAndamento") {
      const fimPrevisto = atual.obterDados().timestamps.fimFasePrevistoEm;
      if (!momentoAgora.ehMaiorOuIgualA(fimPrevisto)) {
        break;
      }
      atual = this.concluirFaseAtual(atual, fimPrevisto);
    }
    return atual;
  }

  private static avancarProximaFase(
    sessao: SessaoAtiva,
    momentoInicio: TimestampMs,
    incrementaCiclo: boolean
  ): SessaoAtiva {
    const snapshot = sessao.obterIdentidade().snapshot;
    const estado = sessao.obterDados().estado;
    const faseAtual = estado.faseAtual;
    const cicloAtual = estado.cicloAtual;

    if (faseAtual === "foco") {
      let proximaFase: TipoFaseSessao = "pausaCurta";
      let duracaoMinutos = snapshot.tempoPausaCurtaMin;
      if (cicloAtual >= snapshot.ciclosAntesPausaLonga) {
        proximaFase = "pausaLonga";
        duracaoMinutos = snapshot.tempoPausaLongaMin;
      }
      const fim = momentoInicio.somarMinutos(duracaoMinutos);

      const novoEstado = new EstadoExecucaoSessao(
        "emAndamento",
        proximaFase,
        cicloAtual
      );
      const novosTimestamps = new TimestampsSessao(
        momentoInicio,
        fim,
        null,
        null
      );
      return new SessaoAtiva(
        sessao.obterIdentidade(),
        new DadosVariaveisSessao(novoEstado, novosTimestamps)
      );
    }

    if (faseAtual === "pausaLonga") {
      const estadoConcluido = new EstadoExecucaoSessao(
        "concluida",
        faseAtual,
        cicloAtual
      );
      const timestamps = new TimestampsSessao(
        momentoInicio,
        momentoInicio,
        null,
        null
      );
      return new SessaoAtiva(
        sessao.obterIdentidade(),
        new DadosVariaveisSessao(estadoConcluido, timestamps)
      );
    }

    // Saindo da pausaCurta para foco:
    let novoCiclo = cicloAtual;
    if (incrementaCiclo) {
      novoCiclo = cicloAtual + 1;
    }
    const fimFoco = momentoInicio.somarMinutos(snapshot.tempoFocoMin);
    const novoEstado = new EstadoExecucaoSessao("emAndamento", "foco", novoCiclo);
    const novosTimestamps = new TimestampsSessao(
      momentoInicio,
      fimFoco,
      null,
      null
    );
    return new SessaoAtiva(
      sessao.obterIdentidade(),
      new DadosVariaveisSessao(novoEstado, novosTimestamps)
    );
  }
}
