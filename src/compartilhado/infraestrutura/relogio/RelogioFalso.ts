import { Relogio } from "./Relogio";
import { TimestampMs } from "../../dominio/TimestampMs";

export class RelogioFalso implements Relogio {
  private tempoAtual: TimestampMs;

  public constructor(inicial: TimestampMs) {
    this.tempoAtual = inicial;
  }

  public agora(): TimestampMs {
    return this.tempoAtual;
  }

  public avancarMilissegundos(ms: number): void {
    this.tempoAtual = this.tempoAtual.somarMilissegundos(ms);
  }

  public avancarMinutos(minutos: number): void {
    this.tempoAtual = this.tempoAtual.somarMinutos(minutos);
  }
}
