import { describe, it, expect } from "vitest";
import {
  NomePreset,
  MinutosFoco,
  MinutosPausaCurta,
  CiclosAntesPausaLonga,
  MinutosPausaLonga,
} from "./ValoresPreset";

describe("ValoresPreset (Value Objects)", () => {
  describe("NomePreset (VR-01)", () => {
    it("deve aceitar nome válido entre 1 e 40 caracteres", () => {
      const res = NomePreset.criar("Estudo Intenso");
      expect(res.temSucesso()).toBe(true);
      expect(res.obterValor().obterValor()).toBe("Estudo Intenso");
    });

    it("deve rejeitar nome vazio ou apenas espaços", () => {
      const res = NomePreset.criar("   ");
      expect(res.temFalha()).toBe(true);
      expect(res.obterErro()).toBe("Nome do preset deve ter entre 1 e 40 caracteres.");
    });

    it("deve rejeitar nome maior que 40 caracteres", () => {
      const longo = "a".repeat(41);
      const res = NomePreset.criar(longo);
      expect(res.temFalha()).toBe(true);
      expect(res.obterErro()).toBe("Nome do preset deve ter entre 1 e 40 caracteres.");
    });
  });

  describe("MinutosFoco (VR-02)", () => {
    it("deve aceitar minutos entre 1 e 120", () => {
      expect(MinutosFoco.criar(1).temSucesso()).toBe(true);
      expect(MinutosFoco.criar(25).temSucesso()).toBe(true);
      expect(MinutosFoco.criar(120).temSucesso()).toBe(true);
    });

    it("deve rejeitar minutos fora do intervalo [1, 120] ou não inteiros", () => {
      expect(MinutosFoco.criar(0).temFalha()).toBe(true);
      expect(MinutosFoco.criar(121).temFalha()).toBe(true);
      expect(MinutosFoco.criar(25.5).temFalha()).toBe(true);
    });
  });

  describe("MinutosPausaCurta (VR-03)", () => {
    it("deve aceitar minutos entre 1 e 60", () => {
      expect(MinutosPausaCurta.criar(1).temSucesso()).toBe(true);
      expect(MinutosPausaCurta.criar(5).temSucesso()).toBe(true);
      expect(MinutosPausaCurta.criar(60).temSucesso()).toBe(true);
    });

    it("deve rejeitar minutos fora do intervalo [1, 60]", () => {
      expect(MinutosPausaCurta.criar(0).temFalha()).toBe(true);
      expect(MinutosPausaCurta.criar(61).temFalha()).toBe(true);
    });
  });

  describe("CiclosAntesPausaLonga (VR-04)", () => {
    it("deve aceitar ciclos entre 1 e 12", () => {
      expect(CiclosAntesPausaLonga.criar(1).temSucesso()).toBe(true);
      expect(CiclosAntesPausaLonga.criar(4).temSucesso()).toBe(true);
      expect(CiclosAntesPausaLonga.criar(12).temSucesso()).toBe(true);
    });

    it("deve rejeitar ciclos fora do intervalo [1, 12]", () => {
      expect(CiclosAntesPausaLonga.criar(0).temFalha()).toBe(true);
      expect(CiclosAntesPausaLonga.criar(13).temFalha()).toBe(true);
    });
  });

  describe("MinutosPausaLonga (VR-05)", () => {
    it("deve aceitar minutos entre 1 e 60", () => {
      expect(MinutosPausaLonga.criar(15).temSucesso()).toBe(true);
    });

    it("deve rejeitar minutos fora do intervalo [1, 60]", () => {
      expect(MinutosPausaLonga.criar(0).temFalha()).toBe(true);
      expect(MinutosPausaLonga.criar(61).temFalha()).toBe(true);
    });
  });
});
