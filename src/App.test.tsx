import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("App Integrado (Pomodoro + Presets + Tarefas)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("deve carregar a tela principal com preset padrao, temporizador e painel de tarefas", () => {
    render(<App />);

    expect(screen.getByText("Pomodoro Padrão")).toBeInTheDocument();
    expect(screen.getByText("25:00")).toBeInTheDocument();
    expect(screen.getByText("Tarefas de Estudo")).toBeInTheDocument();
  });

  it("deve iniciar sessao de foco e atualizar status do preset em uso (RN-01)", () => {
    render(<App />);

    const botaoIniciar = screen.getByRole("button", { name: /Iniciar Sessão/i });
    fireEvent.click(botaoIniciar);

    // O preset padrão agora está em uso por sessão ativa
    const botaoEditarPadrao = screen.getByTestId("editar-preset-padrao-pomodoro");
    expect(botaoEditarPadrao).toBeDisabled();

    // Temporizador exibe botões de pausa e pular fase
    expect(screen.getByRole("button", { name: /Pausar/i })).toBeInTheDocument();
  });

  it("deve permitir adicionar uma nova tarefa com valores padrao (RN-12)", () => {
    render(<App />);

    const botaoNovaTarefa = screen.getByRole("button", { name: /\+ Adicionar/i });
    fireEvent.click(botaoNovaTarefa);

    const inputTitulo = screen.getByLabelText(/Título da tarefa/i);
    fireEvent.change(inputTitulo, { target: { value: "Estudar TypeScript estrito" } });

    const botaoSalvar = screen.getByRole("button", { name: /Salvar/i });
    fireEvent.click(botaoSalvar);

    expect(screen.getByText("Estudar TypeScript estrito")).toBeInTheDocument();
  });

  it("ao editar uma tarefa apos criar outra, deve abrir com os dados da tarefa selecionada e nao da ultima criada", () => {
    render(<App />);

    // 1. Criar Tarefa 1
    fireEvent.click(screen.getByRole("button", { name: /\+ Adicionar/i }));
    fireEvent.change(screen.getByLabelText(/Título da tarefa/i), {
      target: { value: "Primeira Tarefa" },
    });
    fireEvent.change(screen.getByLabelText(/Estado da tarefa/i), {
      target: { value: "aFazer" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));

    // 2. Criar Tarefa 2
    fireEvent.click(screen.getByRole("button", { name: /\+ Adicionar/i }));
    fireEvent.change(screen.getByLabelText(/Título da tarefa/i), {
      target: { value: "Segunda Tarefa" },
    });
    fireEvent.change(screen.getByLabelText(/Estado da tarefa/i), {
      target: { value: "concluida" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));

    // Ambas estão na tela
    expect(screen.getByText("Primeira Tarefa")).toBeInTheDocument();
    expect(screen.getByText("Segunda Tarefa")).toBeInTheDocument();

    // 3. Clicar no botão de editar da "Primeira Tarefa"
    const botoesEditar = screen.getAllByTitle("Editar Tarefa");
    // Primeira tarefa (aFazer vem antes de concluida pela RN-10 se tiver mesma prioridade)
    fireEvent.click(botoesEditar[0]);

    // O modal deve estar com "Primeira Tarefa" e "aFazer", NÃO "Segunda Tarefa" ou "concluida"!
    const inputTitulo = screen.getByLabelText(/Título da tarefa/i) as HTMLInputElement;
    const selectEstado = screen.getByLabelText(/Estado da tarefa/i) as HTMLSelectElement;

    expect(inputTitulo.value).toBe("Primeira Tarefa");
    expect(selectEstado.value).toBe("aFazer");

    // Salvar alteração da Primeira Tarefa
    fireEvent.change(inputTitulo, { target: { value: "Primeira Tarefa Atualizada" } });
    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));

    expect(screen.getByText("Primeira Tarefa Atualizada")).toBeInTheDocument();
    expect(screen.getByText("Segunda Tarefa")).toBeInTheDocument();
  });
});
