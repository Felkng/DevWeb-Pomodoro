import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PainelTarefasView } from "./PainelTarefasView";
import { TarefaDto } from "../dominio/Tarefa";

describe("PainelTarefasView (RF-18, RF-19, RN-10)", () => {
  const tarefasExemplo: TarefaDto[] = [
    {
      id: "t-1",
      titulo: "Fazer exercícios de Física",
      estado: "aFazer",
      prioridade: "alta",
      criadoEm: 1000,
      atualizadoEm: 1000,
    },
    {
      id: "t-2",
      titulo: "Organizar anotações",
      estado: "backlog",
      prioridade: "baixa",
      criadoEm: 2000,
      atualizadoEm: 2000,
    },
  ];

  it("deve renderizar a lista de tarefas e badges", () => {
    render(
      <PainelTarefasView
        tarefas={tarefasExemplo}
        onNovaTarefa={vi.fn()}
        onEditarTarefa={vi.fn()}
        onExcluirTarefa={vi.fn()}
      />
    );
    expect(screen.getByText("Fazer exercícios de Física")).toBeInTheDocument();
    expect(screen.getByText("Organizar anotações")).toBeInTheDocument();
    expect(screen.getByText("Alta")).toBeInTheDocument();
    expect(screen.getByText("A fazer")).toBeInTheDocument();
  });

  it("deve chamar onEditarTarefa e onExcluirTarefa", () => {
    const onEditar = vi.fn();
    const onExcluir = vi.fn();
    render(
      <PainelTarefasView
        tarefas={tarefasExemplo}
        onNovaTarefa={vi.fn()}
        onEditarTarefa={onEditar}
        onExcluirTarefa={onExcluir}
      />
    );
    fireEvent.click(screen.getByTestId("editar-t-1"));
    expect(onEditar).toHaveBeenCalledWith(tarefasExemplo[0]);

    fireEvent.click(screen.getByTestId("excluir-t-1"));
    expect(onExcluir).toHaveBeenCalledWith(tarefasExemplo[0]);
  });
});
