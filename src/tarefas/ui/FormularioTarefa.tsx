import React, { useState, useEffect } from "react";
import { TarefaDto } from "../dominio/Tarefa";
import {
  TituloTarefa,
  EstadoTarefa,
  PrioridadeTarefa,
  TipoEstadoTarefa,
  TipoPrioridadeTarefa,
} from "../dominio/ValoresTarefa";

export interface DadosFormularioTarefa {
  readonly titulo: string;
  readonly estado: TipoEstadoTarefa;
  readonly prioridade: TipoPrioridadeTarefa;
}

interface PropriedadesFormularioTarefa {
  readonly aberto: boolean;
  readonly tarefaEdicao?: TarefaDto | null;
  readonly onSalvar: (dados: DadosFormularioTarefa) => void;
  readonly onCancelar: () => void;
}

export const FormularioTarefa: React.FC<PropriedadesFormularioTarefa> = ({
  aberto,
  tarefaEdicao,
  onSalvar,
  onCancelar,
}) => {
  const obterValorInicialTitulo = (): string => {
    if (tarefaEdicao) {
      return tarefaEdicao.titulo;
    }
    return "";
  };

  const obterValorInicialEstado = (): TipoEstadoTarefa => {
    if (tarefaEdicao) {
      return tarefaEdicao.estado;
    }
    return EstadoTarefa.padrao().obterValor();
  };

  const obterValorInicialPrioridade = (): TipoPrioridadeTarefa => {
    if (tarefaEdicao) {
      return tarefaEdicao.prioridade;
    }
    return PrioridadeTarefa.padrao().obterValor();
  };

  const [titulo, setTitulo] = useState(obterValorInicialTitulo);
  const [estado, setEstado] = useState<TipoEstadoTarefa>(obterValorInicialEstado);
  const [prioridade, setPrioridade] = useState<TipoPrioridadeTarefa>(obterValorInicialPrioridade);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!aberto) {
      return;
    }
    let tituloInicial = "";
    if (tarefaEdicao) {
      tituloInicial = tarefaEdicao.titulo;
    }
    let estadoInicial = EstadoTarefa.padrao().obterValor();
    if (tarefaEdicao) {
      estadoInicial = tarefaEdicao.estado;
    }
    let prioridadeInicial = PrioridadeTarefa.padrao().obterValor();
    if (tarefaEdicao) {
      prioridadeInicial = tarefaEdicao.prioridade;
    }

    setTitulo(tituloInicial);
    setEstado(estadoInicial);
    setPrioridade(prioridadeInicial);
    setErro(null);
  }, [aberto, tarefaEdicao]);

  if (!aberto) {
    return null;
  }

  const validarESubmeter = (evento: React.FormEvent) => {
    evento.preventDefault();
    setErro(null);

    const resTitulo = TituloTarefa.criar(titulo);
    if (resTitulo.temFalha()) {
      setErro(resTitulo.obterErro());
      return;
    }

    const resEstado = EstadoTarefa.criar(estado);
    if (resEstado.temFalha()) {
      setErro(resEstado.obterErro());
      return;
    }

    const resPrioridade = PrioridadeTarefa.criar(prioridade);
    if (resPrioridade.temFalha()) {
      setErro(resPrioridade.obterErro());
      return;
    }

    onSalvar({
      titulo: resTitulo.obterValor().obterValor(),
      estado: resEstado.obterValor().obterValor(),
      prioridade: resPrioridade.obterValor().obterValor(),
    });
  };

  let tituloModal = "Nova Tarefa de Estudo";
  if (tarefaEdicao) {
    tituloModal = "Editar Tarefa";
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-modal-tarefa"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 id="titulo-modal-tarefa" className="text-xl font-bold text-slate-800">
          {tituloModal}
        </h2>

        {erro && (
          <div role="alert" className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
            {erro}
          </div>
        )}

        <form onSubmit={validarESubmeter} className="mt-4 space-y-4">
          <div>
            <label htmlFor="input-titulo-tarefa" className="block text-sm font-semibold text-slate-700">
              Título da tarefa (1 a 100 caracteres)
            </label>
            <input
              id="input-titulo-tarefa"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Ler capítulo 4 de Biologia"
              className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="select-estado-tarefa" className="block text-sm font-semibold text-slate-700">
                Estado da tarefa
              </label>
              <select
                id="select-estado-tarefa"
                value={estado}
                onChange={(e) => setEstado(e.target.value as TipoEstadoTarefa)}
                className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-indigo-500 focus:outline-none"
              >
                <option value="backlog">Backlog</option>
                <option value="aFazer">A fazer</option>
                <option value="emExecucao">Em execução</option>
                <option value="concluida">Concluída</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>

            <div>
              <label htmlFor="select-prioridade-tarefa" className="block text-sm font-semibold text-slate-700">
                Prioridade da tarefa
              </label>
              <select
                id="select-prioridade-tarefa"
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value as TipoPrioridadeTarefa)}
                className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-indigo-500 focus:outline-none"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancelar}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
