import { Resultado } from "../../compartilhado/dominio/Resultado";

export class NomePreset {
  private readonly valor: string;

  private constructor(valor: string) {
    this.valor = valor;
  }

  public static criar(texto: string): Resultado<NomePreset, string> {
    const limpo = texto.trim();
    if (limpo.length < 1 || limpo.length > 40) {
      return Resultado.falha("Nome do preset deve ter entre 1 e 40 caracteres.");
    }
    return Resultado.sucesso(new NomePreset(limpo));
  }

  public obterValor(): string {
    return this.valor;
  }
}

export class MinutosFoco {
  private readonly valor: number;

  private constructor(valor: number) {
    this.valor = valor;
  }

  public static criar(minutos: number): Resultado<MinutosFoco, string> {
    if (!Number.isInteger(minutos) || minutos < 1 || minutos > 120) {
      return Resultado.falha("Tempo de foco deve ser um inteiro entre 1 e 120 minutos.");
    }
    return Resultado.sucesso(new MinutosFoco(minutos));
  }

  public obterValor(): number {
    return this.valor;
  }
}

export class MinutosPausaCurta {
  private readonly valor: number;

  private constructor(valor: number) {
    this.valor = valor;
  }

  public static criar(minutos: number): Resultado<MinutosPausaCurta, string> {
    if (!Number.isInteger(minutos) || minutos < 1 || minutos > 60) {
      return Resultado.falha("Tempo de pausa curta deve ser um inteiro entre 1 e 60 minutos.");
    }
    return Resultado.sucesso(new MinutosPausaCurta(minutos));
  }

  public obterValor(): number {
    return this.valor;
  }
}

export class CiclosAntesPausaLonga {
  private readonly valor: number;

  private constructor(valor: number) {
    this.valor = valor;
  }

  public static criar(ciclos: number): Resultado<CiclosAntesPausaLonga, string> {
    if (!Number.isInteger(ciclos) || ciclos < 1 || ciclos > 12) {
      return Resultado.falha("Quantidade de ciclos deve ser um inteiro entre 1 e 12.");
    }
    return Resultado.sucesso(new CiclosAntesPausaLonga(ciclos));
  }

  public obterValor(): number {
    return this.valor;
  }
}

export class MinutosPausaLonga {
  private readonly valor: number;

  private constructor(valor: number) {
    this.valor = valor;
  }

  public static criar(minutos: number): Resultado<MinutosPausaLonga, string> {
    if (!Number.isInteger(minutos) || minutos < 1 || minutos > 60) {
      return Resultado.falha("Tempo de pausa longa deve ser um inteiro entre 1 e 60 minutos.");
    }
    return Resultado.sucesso(new MinutosPausaLonga(minutos));
  }

  public obterValor(): number {
    return this.valor;
  }
}
