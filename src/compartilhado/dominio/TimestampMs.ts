export class TimestampMs {
  private readonly milissegundos: number;

  private constructor(milissegundos: number) {
    this.milissegundos = milissegundos;
  }

  public static deNumero(milissegundos: number): TimestampMs {
    if (milissegundos < 0) {
      throw new Error("Timestamp não pode ser negativo.");
    }
    return new TimestampMs(milissegundos);
  }

  public obterMilissegundos(): number {
    return this.milissegundos;
  }

  public somarMinutos(minutos: number): TimestampMs {
    const milissegundosPorMinuto = 60 * 1000;
    const adicional = minutos * milissegundosPorMinuto;
    return new TimestampMs(this.milissegundos + adicional);
  }

  public somarMilissegundos(ms: number): TimestampMs {
    return new TimestampMs(this.milissegundos + ms);
  }

  public diferencaPara(outro: TimestampMs): number {
    return this.milissegundos - outro.obterMilissegundos();
  }

  public ehMaiorOuIgualA(outro: TimestampMs): boolean {
    return this.milissegundos >= outro.obterMilissegundos();
  }
}
