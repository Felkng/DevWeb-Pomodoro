import { Resultado } from "../../dominio/Resultado";

export class ArmazenamentoLocal {
  public lerItem<TipoItem>(chave: string): TipoItem | null {
    try {
      const valorBruto = localStorage.getItem(chave);
      if (valorBruto === null) {
        return null;
      }
      return JSON.parse(valorBruto) as TipoItem;
    } catch {
      return null;
    }
  }

  public gravarItem<TipoItem>(
    chave: string,
    item: TipoItem
  ): Resultado<void, string> {
    try {
      const serializado = JSON.stringify(item);
      localStorage.setItem(chave, serializado);
      return Resultado.sucesso(undefined);
    } catch {
      return Resultado.falha("Falha ao salvar dados no navegador.");
    }
  }

  public removerItem(chave: string): void {
    localStorage.removeItem(chave);
  }
}
