import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DialogoConfirmacao } from "./DialogoConfirmacao";

describe("DialogoConfirmacao", () => {
  it("nao deve exibir conteudo quando aberto for falso", () => {
    render(
      <DialogoConfirmacao
        aberto={false}
        titulo="Excluir Item"
        mensagem="Tem certeza que deseja excluir?"
        onConfirmar={vi.fn()}
        onCancelar={vi.fn()}
      />
    );
    expect(screen.queryByText("Excluir Item")).not.toBeInTheDocument();
  });

  it("deve exibir titulo, mensagem e botoes quando aberto for verdadeiro", () => {
    render(
      <DialogoConfirmacao
        aberto={true}
        titulo="Excluir Item"
        mensagem="Tem certeza que deseja excluir?"
        onConfirmar={vi.fn()}
        onCancelar={vi.fn()}
      />
    );
    expect(screen.getByText("Excluir Item")).toBeInTheDocument();
    expect(screen.getByText("Tem certeza que deseja excluir?")).toBeInTheDocument();
  });

  it("deve chamar onConfirmar ao clicar no botao confirmar", () => {
    const onConfirmar = vi.fn();
    render(
      <DialogoConfirmacao
        aberto={true}
        titulo="Confirmar"
        mensagem="Mensagem de teste"
        onConfirmar={onConfirmar}
        onCancelar={vi.fn()}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));
    expect(onConfirmar).toHaveBeenCalledTimes(1);
  });

  it("deve chamar onCancelar ao clicar no botao cancelar", () => {
    const onCancelar = vi.fn();
    render(
      <DialogoConfirmacao
        aberto={true}
        titulo="Confirmar"
        mensagem="Mensagem de teste"
        onConfirmar={vi.fn()}
        onCancelar={onCancelar}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onCancelar).toHaveBeenCalledTimes(1);
  });
});
