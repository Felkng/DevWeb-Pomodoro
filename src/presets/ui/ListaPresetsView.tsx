import React from "react";
import { PresetDto } from "../dominio/Preset";

interface PropriedadesListaPresetsView {
  readonly presets: readonly PresetDto[];
  readonly idPresetSelecionado: string | null;
  readonly idPresetSessaoAtiva: string | null;
  readonly onSelecionarPreset: (id: string) => void;
  readonly onNovoPreset: () => void;
  readonly onEditarPreset: (preset: PresetDto) => void;
  readonly onExcluirPreset: (preset: PresetDto) => void;
}

export const ListaPresetsView: React.FC<PropriedadesListaPresetsView> = ({
  presets,
  idPresetSelecionado,
  idPresetSessaoAtiva,
  onSelecionarPreset,
  onNovoPreset,
  onEditarPreset,
  onExcluirPreset,
}) => {
  return (
    <section aria-labelledby="titulo-presets" className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 id="titulo-presets" className="text-base font-bold text-slate-800">
          Temporizadores Disponíveis
        </h2>
        <button
          type="button"
          onClick={onNovoPreset}
          className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
        >
          + Novo
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {presets.map((preset) => {
          const ehAtivo = preset.id === idPresetSelecionado;
          const emUsoPorSessao = preset.id === idPresetSessaoAtiva;
          let estiloBorda = "border-slate-200 bg-slate-50 hover:border-slate-300";
          if (ehAtivo) {
            estiloBorda = "border-indigo-600 bg-indigo-50/50";
          }
          let tituloAcaoEditar = "Editar";
          let tituloAcaoExcluir = "Excluir";
          if (emUsoPorSessao) {
            tituloAcaoEditar = "Em uso por sessão ativa (RN-01)";
            tituloAcaoExcluir = "Em uso por sessão ativa (RN-01)";
          }

          return (
            <div
              key={preset.id}
              className={`flex items-center gap-2 rounded-xl border p-2.5 transition ${estiloBorda}`}
            >
              <button
                type="button"
                onClick={() => onSelecionarPreset(preset.id)}
                className="text-left"
              >
                <span className="block text-sm font-semibold text-slate-800">
                  {preset.nome}
                </span>
                <span className="block text-xs text-slate-500">
                  {preset.tempoFocoMin}m foco | {preset.tempoPausaCurtaMin}m pausa | {preset.ciclosAntesPausaLonga} ciclos | {preset.tempoPausaLongaMin}m longa
                </span>
              </button>

              <div className="ml-2 flex items-center gap-1 border-l border-slate-200 pl-2">
                <button
                  type="button"
                  data-testid={`editar-${preset.id}`}
                  disabled={emUsoPorSessao}
                  onClick={() => onEditarPreset(preset)}
                  title={tituloAcaoEditar}
                  className="rounded p-1 text-xs text-slate-500 hover:bg-slate-200 disabled:opacity-40"
                >
                  ✎
                </button>
                <button
                  type="button"
                  data-testid={`excluir-${preset.id}`}
                  disabled={emUsoPorSessao}
                  onClick={() => onExcluirPreset(preset)}
                  title={tituloAcaoExcluir}
                  className="rounded p-1 text-xs text-rose-600 hover:bg-rose-50 disabled:opacity-40"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
