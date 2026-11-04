import { IdentificadorId } from "../../compartilhado/dominio/IdentificadorId";
import { Preset } from "./Preset";

export class ListaPresets {
  private readonly itens: readonly Preset[];

  private constructor(itens: readonly Preset[]) {
    this.itens = itens;
  }

  public static criarVazia(): ListaPresets {
    return new ListaPresets([]);
  }

  public static deArray(presets: readonly Preset[]): ListaPresets {
    return new ListaPresets([...presets]);
  }

  public adicionar(preset: Preset): ListaPresets {
    return new ListaPresets([...this.itens, preset]);
  }

  public atualizar(presetAtualizado: Preset): ListaPresets {
    const novosItens = this.itens.map((item) => {
      if (item.obterId().ehIgual(presetAtualizado.obterId())) {
        return presetAtualizado;
      }
      return item;
    });
    return new ListaPresets(novosItens);
  }

  public remover(id: IdentificadorId): ListaPresets {
    const filtrados = this.itens.filter((item) => !item.obterId().ehIgual(id));
    return new ListaPresets(filtrados);
  }

  public obterPorId(id: IdentificadorId): Preset | undefined {
    return this.itens.find((item) => item.obterId().ehIgual(id));
  }

  public quantidade(): number {
    return this.itens.length;
  }

  public paraArray(): readonly Preset[] {
    return this.itens;
  }
}
