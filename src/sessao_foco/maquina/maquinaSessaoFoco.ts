import { setup, assign } from "xstate";
import { SessaoAtiva, SnapshotPreset } from "../dominio/SessaoAtiva";
import { CalculadorFases } from "../dominio/CalculadorFases";
import { IdentificadorId } from "../../compartilhado/dominio/IdentificadorId";
import { TimestampMs } from "../../compartilhado/dominio/TimestampMs";
import { PresetDto } from "../../presets/dominio/Preset";

export interface ContextoMaquinaSessao {
  readonly sessao: SessaoAtiva | null;
}

export type EventoMaquinaSessao =
  | { readonly type: "INICIAR"; readonly preset: PresetDto; readonly agora: number }
  | { readonly type: "PAUSAR"; readonly agora: number }
  | { readonly type: "RETOMAR"; readonly agora: number }
  | { readonly type: "PULAR_FASE"; readonly agora: number }
  | { readonly type: "REINICIAR_CICLOS"; readonly agora: number }
  | { readonly type: "ENCERRAR" }
  | { readonly type: "DESCARTAR" }
  | { readonly type: "CARREGAR_PERSISTIDA"; readonly sessao: SessaoAtiva }
  | { readonly type: "VERIFICAR_TICK"; readonly agora: number };

export const maquinaSessaoFoco = setup({
  types: {
    context: {} as ContextoMaquinaSessao,
    events: {} as EventoMaquinaSessao,
  },
  actions: {
    tocarAlertaSonoro: () => {
      // Configurado ou sobrescrito via provide()
    },
    salvarPersistencia: () => {
      // Sincronização
    },
  },
}).createMachine({
  id: "sessaoFoco",
  initial: "ocioso",
  context: {
    sessao: null,
  },
  states: {
    ocioso: {
      on: {
        INICIAR: {
          target: "emExecucao",
          actions: assign({
            sessao: ({ event }) => {
              const snapshot = new SnapshotPreset({
                tempoFocoMin: event.preset.tempoFocoMin,
                tempoPausaCurtaMin: event.preset.tempoPausaCurtaMin,
                ciclosAntesPausaLonga: event.preset.ciclosAntesPausaLonga,
                tempoPausaLongaMin: event.preset.tempoPausaLongaMin,
              });
              return SessaoAtiva.iniciar({
                id: IdentificadorId.gerarNovo(),
                presetId: event.preset.id,
                snapshot,
                momentoInicio: TimestampMs.deNumero(event.agora),
              });
            },
          }),
        },
        CARREGAR_PERSISTIDA: [
          {
            guard: ({ event }) => event.sessao.obterDados().estado.status === "pausada",
            target: "pausado",
            actions: assign({ sessao: ({ event }) => event.sessao }),
          },
          {
            guard: ({ event }) => event.sessao.obterDados().estado.status === "concluida",
            target: "concluido",
            actions: assign({ sessao: ({ event }) => event.sessao }),
          },
          {
            target: "emExecucao",
            actions: assign({ sessao: ({ event }) => event.sessao }),
          },
        ],
      },
    },

    emExecucao: {
      on: {
        PAUSAR: {
          target: "pausado",
          actions: assign({
            sessao: ({ context, event }) => {
              if (!context.sessao) {
                return null;
              }
              return context.sessao.pausar(TimestampMs.deNumero(event.agora));
            },
          }),
        },
        PULAR_FASE: {
          actions: assign({
            sessao: ({ context, event }) => {
              if (!context.sessao) {
                return null;
              }
              return CalculadorFases.pularFase(
                context.sessao,
                TimestampMs.deNumero(event.agora)
              );
            },
          }),
        },
        REINICIAR_CICLOS: {
          actions: assign({
            sessao: ({ context, event }) => {
              if (!context.sessao) {
                return null;
              }
              return CalculadorFases.reiniciarCiclos(
                context.sessao,
                TimestampMs.deNumero(event.agora)
              );
            },
          }),
        },
        ENCERRAR: {
          target: "ocioso",
          actions: assign({ sessao: null }),
        },
        DESCARTAR: {
          target: "ocioso",
          actions: assign({ sessao: null }),
        },
        VERIFICAR_TICK: [
          {
            guard: ({ context, event }) => {
              if (!context.sessao) {
                return false;
              }
              const fim = context.sessao.paraDto().fimFasePrevistoEm;
              return event.agora >= fim;
            },
            actions: [
              assign({
                sessao: ({ context, event }) => {
                  if (!context.sessao) {
                    return null;
                  }
                  return CalculadorFases.concluirFaseAtual(
                    context.sessao,
                    TimestampMs.deNumero(event.agora)
                  );
                },
              }),
              "tocarAlertaSonoro",
            ],
          },
        ],
      },
    },

    pausado: {
      on: {
        RETOMAR: {
          target: "emExecucao",
          actions: assign({
            sessao: ({ context, event }) => {
              if (!context.sessao) {
                return null;
              }
              return context.sessao.retomar(TimestampMs.deNumero(event.agora));
            },
          }),
        },
        PULAR_FASE: {
          actions: assign({
            sessao: ({ context, event }) => {
              if (!context.sessao) {
                return null;
              }
              return CalculadorFases.pularFase(
                context.sessao,
                TimestampMs.deNumero(event.agora)
              );
            },
          }),
        },
        REINICIAR_CICLOS: {
          actions: assign({
            sessao: ({ context, event }) => {
              if (!context.sessao) {
                return null;
              }
              return CalculadorFases.reiniciarCiclos(
                context.sessao,
                TimestampMs.deNumero(event.agora)
              );
            },
          }),
        },
        ENCERRAR: {
          target: "ocioso",
          actions: assign({ sessao: null }),
        },
        DESCARTAR: {
          target: "ocioso",
          actions: assign({ sessao: null }),
        },
      },
    },

    concluido: {
      on: {
        ENCERRAR: {
          target: "ocioso",
          actions: assign({ sessao: null }),
        },
        DESCARTAR: {
          target: "ocioso",
          actions: assign({ sessao: null }),
        },
      },
    },
  },
});
