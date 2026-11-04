import { describe, it, expect } from "vitest";
import {
  TituloTarefa,
  EstadoTarefa,
  PrioridadeTarefa,
} from "./ValoresTarefa";

describe("ValoresTarefa (VR-06, VR-07, VR-08)", () => {
  describe("TituloTarefa", () => {
    it("deve aceitar titulo válido de 1 a 100 caracteres", () => {
      const res = TituloTarefa.criar("Ler capítulo 3 do livro");
      expect(res.temSucesso()).toBe(true);
      expect(res.obterValor().obterValor()).toBe("Ler capítulo 3 do livro");
    });

    it("deve rejeitar titulo vazio", () => {
      const res = TituloTarefa.criar("   ");
      expect(res.temFalha()).toBe(true);
      expect(res.obterErro()).toBe("Título da tarefa deve ter entre 1 e 100 caracteres.");
    });

    it("deve rejeitar titulo maior que 100 caracteres", () => {
      const res = TituloTarefa.criar("a".repeat(101));
      expect(res.temFalha()).toBe(true);
    });
  });

  describe("EstadoTarefa", () => {
    it("deve aceitar estados válidos", () => {
      expect(EstadoTarefa.criar("backlog").temSucesso()).toBe(true);
      expect(EstadoTarefa.criar("aFazer").temSucesso()).toBe(true);
      expect(EstadoTarefa.criar("emExecucao").temSucesso()).toBe(true);
      expect(EstadoTarefa.criar("concluida").temSucesso()).toBe(true);
      expect(EstadoTarefa.criar("cancelada").temSucesso()).toBe(true);
    });

    it("deve rejeitar estado desconhecido", () => {
      expect(EstadoTarefa.criar("invalido").temFalha()).toBe(true);
    });

    it("deve criar valor padrao backlog (RN-12)", () => {
      expect(EstadoTarefa.padrao().obterValor()).toBe("backlog");
    });
  });

  describe("PrioridadeTarefa", () => {
    it("deve aceitar prioridades válidas", () => {
      expect(PrioridadeTarefa.criar("baixa").temSucesso()).toBe(true);
      expect(PrioridadeTarefa.criar("media").temSucesso()).toBe(true);
      expect(PrioridadeTarefa.criar("alta").temSucesso()).toBe(true);
    });

    it("deve rejeitar prioridade desconhecida", () => {
      expect(PrioridadeTarefa.criar("urgente").temFalha()).toBe(true);
    });

    it("deve criar valor padrao media (RN-12)", () => {
      expect(PrioridadeTarefa.padrao().obterValor()).toBe("media");
    });
  });
});
