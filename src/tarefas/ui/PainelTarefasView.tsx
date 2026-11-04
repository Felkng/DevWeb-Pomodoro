import React from "react";
import { TarefaDto } from "../dominio/Tarefa";
import { TipoEstadoTarefa, TipoPrioridadeTarefa } from "../dominio/ValoresTarefa";

interface PropriedadesPainelTarefasView {
  readonly tarefas: readonly TarefaDto[];
  readonly onNovaTarefa: () => void;
  readonly onEditarTarefa: (tarefa: TarefaDto) => void;
  readonly onExcluirTarefa: (tarefa: TarefaDto) => void;
}

const ROTULOS_ESTADO: Record<TipoEstadoTarefa, string> = {
  backlog: "Backlog",
  aFazer: "A fazer",
  emExecucao: "Em execução",
  concluida: "Concluída",
  cancelada: "Cancelada",
};

const CORES_ESTADO: Record<TipoEstadoTarefa, string> = {
  backlog: "bg-slate-100 text-slate-700",
  aFazer: "bg-blue-100 text-blue-700",
  emExecucao: "bg-amber-100 text-amber-700",
  concluida: "bg-emerald-100 text-emerald-700",
  cancelada: "bg-rose-100 text-rose-700",
};

const ROTULOS_PRIORIDADE: Record<TipoPrioridadeTarefa, string> = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
};

const CORES_PRIORIDADE: Record<TipoPrioridadeTarefa, string> = {
  alta: "text-rose-600 border-rose-300 bg-rose-50",
  media: "text-amber-600 border-amber-300 bg-amber-50",
  baixa: "text-slate-600 border-slate-300 bg-slate-50",
};

export const PainelTarefasView: React.FC<PropriedadesPainelTarefasView> = ({
  tarefas,
  onNovaTarefa,
  onEditarTarefa,
  onExcluirTarefa,
}) => {
  return (
    <aside
      aria-labelledby="titulo-painel-tarefas"
      className="flex flex-col rounded-2xl bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 id="titulo-painel-tarefas" className="text-base font-bold text-slate-800">
            Tarefas de Estudo
          </h2>
          <p className="text-xs text-slate-500">
            Ordenação automática por prioridade e estado
          </p>
        </div>
        <button
          type="button"
          onClick={onNovaTarefa}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
        >
          + Adicionar
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        {tarefas.length === 0 && (
          <p className="py-6 text-center text-sm text-slate-400">
            Nenhuma tarefa cadastrada. Adicione sua primeira tarefa!
          </p>
        )}

        {tarefas.map((tarefa) => (
          <div
            key={tarefa.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-3"
          >
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-slate-800">
                {tarefa.titulo}
              </span>
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={`rounded-md px-2 py-0.5 font-medium ${CORES_ESTADO[tarefa.estado]}`}
                >
                  {ROTULOS_ESTADO[tarefa.estado]}
                </span>
                <span
                  className={`rounded-md border px-1.5 py-0.5 font-medium ${CORES_PRIORIDADE[tarefa.prioridade]}`}
                >
                  {ROTULOS_PRIORIDADE[tarefa.prioridade]}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                data-testid={`editar-${tarefa.id}`}
                onClick={() => onEditarTarefa(tarefa)}
                title="Editar Tarefa"
                className="rounded p-1.5 text-xs text-slate-500 hover:bg-slate-200"
              >
                ✎
              </button>
              <button
                type="button"
                data-testid={`excluir-${tarefa.id}`}
                onClick={() => onExcluirTarefa(tarefa)}
                title="Excluir Tarefa"
                className="rounded p-1.5 text-xs text-rose-600 hover:bg-rose-50"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
