import { Resultado } from "./Resultado";

export class IdentificadorId {
  private readonly valor: string;

  private constructor(valor: string) {
    this.valor = valor;
  }

  public static gerarNovo(): IdentificadorId {
    const valorGerado = crypto.randomUUID();
    return new IdentificadorId(valorGerado);
  }

  public static deString(
    texto: string
  ): Resultado<IdentificadorId, string> {
    const textoLimpo = texto.trim();
    if (textoLimpo.length === 0) {
      return Resultado.falha("Identificador não pode ser vazio.");
    }
    return Resultado.sucesso(new IdentificadorId(textoLimpo));
  }

  public obterValor(): string {
    return this.valor;
  }

  public ehIgual(outro: IdentificadorId): boolean {
    return this.valor === outro.obterValor();
  }
}
