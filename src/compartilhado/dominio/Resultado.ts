export class Resultado<TipoSucesso, TipoErro> {
  private readonly valor: TipoSucesso | null;
  private readonly erro: TipoErro | null;

  private constructor(
    valor: TipoSucesso | null,
    erro: TipoErro | null
  ) {
    this.valor = valor;
    this.erro = erro;
  }

  public static sucesso<S, E>(valor: S): Resultado<S, E> {
    return new Resultado<S, E>(valor, null);
  }

  public static falha<S, E>(erro: E): Resultado<S, E> {
    return new Resultado<S, E>(null, erro);
  }

  public temSucesso(): boolean {
    return this.erro === null;
  }

  public temFalha(): boolean {
    return this.erro !== null;
  }

  public obterValor(): TipoSucesso {
    if (this.temFalha()) {
      throw new Error("Não é possível obter valor de um resultado com falha");
    }
    return this.valor as TipoSucesso;
  }

  public obterErro(): TipoErro {
    if (this.temSucesso()) {
      throw new Error("Não é possível obter erro de um resultado com sucesso");
    }
    return this.erro as TipoErro;
  }
}
