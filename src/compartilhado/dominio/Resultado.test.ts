import { describe, it, expect } from "vitest";
import { Resultado } from "./Resultado";

describe("Resultado", () => {
  it("deve criar um resultado de sucesso e identificar como sucesso", () => {
    const resultado = Resultado.sucesso("dados");
    expect(resultado.temSucesso()).toBe(true);
    expect(resultado.temFalha()).toBe(false);
    expect(resultado.obterValor()).toBe("dados");
  });

  it("deve criar um resultado de falha e identificar como falha", () => {
    const resultado = Resultado.falha("mensagem de erro");
    expect(resultado.temSucesso()).toBe(false);
    expect(resultado.temFalha()).toBe(true);
    expect(resultado.obterErro()).toBe("mensagem de erro");
  });

  it("deve lançar erro ao tentar obter valor de um resultado com falha", () => {
    const resultado = Resultado.falha("erro");
    expect(() => resultado.obterValor()).toThrow();
  });

  it("deve lançar erro ao tentar obter erro de um resultado com sucesso", () => {
    const resultado = Resultado.sucesso("ok");
    expect(() => resultado.obterErro()).toThrow();
  });
});
