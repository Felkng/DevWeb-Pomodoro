import { describe, it, expect } from "vitest";
import { RelogioFalso } from "./RelogioFalso";
import { RelogioSistema } from "./RelogioSistema";
import { TimestampMs } from "../../dominio/TimestampMs";

describe("Relogio", () => {
  it("RelogioSistema deve retornar timestamp atual aproximado", () => {
    const relogio = new RelogioSistema();
    const agora = relogio.agora();
    expect(agora.obterMilissegundos()).toBeGreaterThan(0);
  });

  it("RelogioFalso deve permitir definir e avancar tempo", () => {
    const inicial = TimestampMs.deNumero(1000);
    const relogio = new RelogioFalso(inicial);
    expect(relogio.agora().obterMilissegundos()).toBe(1000);

    relogio.avancarMilissegundos(500);
    expect(relogio.agora().obterMilissegundos()).toBe(1500);

    relogio.avancarMinutos(1);
    expect(relogio.agora().obterMilissegundos()).toBe(1500 + 60000);
  });
});
