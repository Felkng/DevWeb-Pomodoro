import { describe, it, expect, beforeEach } from "vitest";
import { ArmazenamentoLocal } from "./ArmazenamentoLocal";

describe("ArmazenamentoLocal", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("deve retornar nulo ao buscar chave inexistente", () => {
    const armazenamento = new ArmazenamentoLocal();
    const resultado = armazenamento.lerItem<string>("chave.inexistente");
    expect(resultado).toBeNull();
  });

  it("deve gravar e ler objeto serializado", () => {
    const armazenamento = new ArmazenamentoLocal();
    const dados = { nome: "estudo", valor: 42 };
    const resultadoGravacao = armazenamento.gravarItem("chave.teste", dados);
    expect(resultadoGravacao.temSucesso()).toBe(true);

    const lido = armazenamento.lerItem<{ nome: string; valor: number }>("chave.teste");
    expect(lido).toEqual(dados);
  });

  it("deve remover item", () => {
    const armazenamento = new ArmazenamentoLocal();
    armazenamento.gravarItem("chave.remover", "abc");
    armazenamento.removerItem("chave.remover");
    expect(armazenamento.lerItem("chave.remover")).toBeNull();
  });

  it("deve retornar nulo e nao quebrar se JSON estiver corrompido", () => {
    localStorage.setItem("chave.corrompida", "{invalido:json");
    const armazenamento = new ArmazenamentoLocal();
    const lido = armazenamento.lerItem("chave.corrompida");
    expect(lido).toBeNull();
  });
});
