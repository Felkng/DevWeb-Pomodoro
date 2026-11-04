import { describe, it, expect } from "vitest";
import { IdentificadorId } from "./IdentificadorId";

describe("IdentificadorId", () => {
  it("deve gerar um identificador válido não vazio", () => {
    const id = IdentificadorId.gerarNovo();
    expect(id.obterValor().length).toBeGreaterThan(0);
  });

  it("deve criar identificador a partir de string válida", () => {
    const resultado = IdentificadorId.deString("id-123");
    expect(resultado.temSucesso()).toBe(true);
    expect(resultado.obterValor().obterValor()).toBe("id-123");
  });

  it("deve rejeitar identificador com texto vazio", () => {
    const resultado = IdentificadorId.deString("   ");
    expect(resultado.temFalha()).toBe(true);
    expect(resultado.obterErro()).toBe("Identificador não pode ser vazio.");
  });

  it("deve verificar igualdade entre identificadores", () => {
    const id1 = IdentificadorId.deString("abc").obterValor();
    const id2 = IdentificadorId.deString("abc").obterValor();
    const id3 = IdentificadorId.deString("xyz").obterValor();
    expect(id1.ehIgual(id2)).toBe(true);
    expect(id1.ehIgual(id3)).toBe(false);
  });
});
