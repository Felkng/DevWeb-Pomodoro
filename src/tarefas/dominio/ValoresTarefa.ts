import { Resultado } from "../../compartilhado/dominio/Resultado";

export type TipoEstadoTarefa =
  | "backlog"
  | "aFazer"
  | "emExecucao"
  | "concluida"
  | "cancelada";

export type TipoPrioridadeTarefa = "baixa" | "media" | "alta";

export class TituloTarefa {
  private readonly valor: string;

  private constructor(valor: string) {
    this.valor = valor;
  }

  public static criar(texto: string): Resultado<TituloTarefa, string> {
    const limpo = texto.trim();
    if (limpo.length < 1 || limpo.length > 100) {
      return Resultado.falha("Título da tarefa deve ter entre 1 e 100 caracteres.");
    }
    return Resultado.sucesso(new TituloTarefa(limpo));
  }

  public obterValor(): string {
    return this.valor;
  }
}

export class EstadoTarefa {
  private readonly valor: TipoEstadoTarefa;

  private constructor(valor: TipoEstadoTarefa) {
    this.valor = valor;
  }

  public static criar(valor: string): Resultado<EstadoTarefa, string> {
    const estadosValidos: readonly string[] = [
      "backlog",
      "aFazer",
      "emExecucao",
      "concluida",
      "cancelada",
    ];
    if (!estadosValidos.includes(valor)) {
      return Resultado.falha("Estado da tarefa inválido.");
    }
    return Resultado.sucesso(new EstadoTarefa(valor as TipoEstadoTarefa));
  }

  public static padrao(): EstadoTarefa {
    return new EstadoTarefa("backlog");
  }

  public obterValor(): TipoEstadoTarefa {
    return this.valor;
  }
}

export class PrioridadeTarefa {
  private readonly valor: TipoPrioridadeTarefa;

  private constructor(valor: TipoPrioridadeTarefa) {
    this.valor = valor;
  }

  public static criar(valor: string): Resultado<PrioridadeTarefa, string> {
    const prioridadesValidas: readonly string[] = ["baixa", "media", "alta"];
    if (!prioridadesValidas.includes(valor)) {
      return Resultado.falha("Prioridade da tarefa inválida.");
    }
    return Resultado.sucesso(new PrioridadeTarefa(valor as TipoPrioridadeTarefa));
  }

  public static padrao(): PrioridadeTarefa {
    return new PrioridadeTarefa("media");
  }

  public obterValor(): TipoPrioridadeTarefa {
    return this.valor;
  }
}
