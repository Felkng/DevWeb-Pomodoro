import { describe, it, expect } from "vitest";
import { TimestampMs } from "./TimestampMs";

describe("TimestampMs", () => {
  it("deve criar timestamp válido a partir de milissegundos positivos", () => {
    const timestamp = TimestampMs.deNumero(1700000000000);
    expect(timestamp.obterMilissegundos()).toBe(1700000000000);
  });

  it("deve rejeitar números negativos", () => {
    expect(() => TimestampMs.deNumero(-1)).toThrow();
  });

  it("deve somar minutos convertendo para milissegundos", () => {
    const base = TimestampMs.deNumero(1000);
    const somado = base.somarMinutos(2);
    expect(somado.obterMilissegundos()).toBe(1000 + 2 * 60 * 1000);
  });

  it("deve somar milissegundos", () => {
    const base = TimestampMs.deNumero(1000);
    const somado = base.somarMilissegundos(500);
    expect(somado.obterMilissegundos()).toBe(1500);
  });

  it("deve calcular diferenca em milissegundos", () => {
    const t1 = TimestampMs.deNumero(5000);
    const t2 = TimestampMs.deNumero(3000);
    expect(t1.diferencaPara(t2)).toBe(2000);
  });

  it("deve comparar se já passou ou se é maior/menor", () => {
    const t1 = TimestampMs.deNumero(5000);
    const t2 = TimestampMs.deNumero(3000);
    expect(t1.ehMaiorOuIgualA(t2)).toBe(true);
    expect(t2.ehMaiorOuIgualA(t1)).toBe(false);
  });
});
