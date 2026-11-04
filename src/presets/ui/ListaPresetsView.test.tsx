import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ListaPresetsView } from "./ListaPresetsView";
import { PresetDto } from "../dominio/Preset";

describe("ListaPresetsView", () => {
  const presetsExemplo: PresetDto[] = [
    {
      id: "preset-1",
      nome: "Pomodoro Clássico",
      tempoFocoMin: 25,
      tempoPausaCurtaMin: 5,
      ciclosAntesPausaLonga: 4,
      tempoPausaLongaMin: 15,
      criadoEm: 1000,
      atualizadoEm: 1000,
    },
    {
      id: "preset-2",
      nome: "Foco Rápido",
      tempoFocoMin: 15,
      tempoPausaCurtaMin: 3,
      ciclosAntesPausaLonga: 2,
      tempoPausaLongaMin: 10,
      criadoEm: 2000,
      atualizadoEm: 2000,
    },
  ];

  it("deve renderizar a lista de presets cadastrados", () => {
    render(
      <ListaPresetsView
        presets={presetsExemplo}
        idPresetSelecionado="preset-1"
        idPresetSessaoAtiva={null}
        onSelecionarPreset={vi.fn()}
        onNovoPreset={vi.fn()}
        onEditarPreset={vi.fn()}
        onExcluirPreset={vi.fn()}
      />
    );
    expect(screen.getByText("Pomodoro Clássico")).toBeInTheDocument();
    expect(screen.getByText("Foco Rápido")).toBeInTheDocument();
  });

  it("deve desabilitar botoes de editar e excluir do preset em uso por sessao ativa (RN-01)", () => {
    render(
      <ListaPresetsView
        presets={presetsExemplo}
        idPresetSelecionado="preset-1"
        idPresetSessaoAtiva="preset-1"
        onSelecionarPreset={vi.fn()}
        onNovoPreset={vi.fn()}
        onEditarPreset={vi.fn()}
        onExcluirPreset={vi.fn()}
      />
    );
    const botaoEditarPreset1 = screen.getByTestId("editar-preset-1");
    const botaoExcluirPreset1 = screen.getByTestId("excluir-preset-1");
    expect(botaoEditarPreset1).toBeDisabled();
    expect(botaoExcluirPreset1).toBeDisabled();

    const botaoEditarPreset2 = screen.getByTestId("editar-preset-2");
    expect(botaoEditarPreset2).not.toBeDisabled();
  });

  it("deve acionar selecao ao clicar em um preset", () => {
    const onSelecionar = vi.fn();
    render(
      <ListaPresetsView
        presets={presetsExemplo}
        idPresetSelecionado="preset-1"
        idPresetSessaoAtiva={null}
        onSelecionarPreset={onSelecionar}
        onNovoPreset={vi.fn()}
        onEditarPreset={vi.fn()}
        onExcluirPreset={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText("Foco Rápido"));
    expect(onSelecionar).toHaveBeenCalledWith("preset-2");
  });
});
