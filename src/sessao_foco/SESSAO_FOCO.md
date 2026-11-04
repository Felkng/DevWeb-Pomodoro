# Fatia Vertical: Sessão de Foco (`src/sessao_foco`)

## 1. Responsabilidade
Gerenciar o ciclo de vida da sessão ativa de Pomodoro, controlando as fases de foco, pausa curta e pausa longa, o cálculo rigoroso por timestamps, o recálculo ao reabrir o navegador e a emissão do alerta sonoro (RF-05 a RF-14, UC04 a UC11).

## 2. Requisitos e Regras Cobertas
- **RF-05 / UC04**: Iniciar sessão a partir de um preset selecionado com snapshot de parâmetros (RN-05).
- **RF-06 e RF-07 / UC05**: Pausar e retomar preservando o tempo restante exato da fase (RN-06).
- **RF-08 / UC06**: Pular fase sem incrementar ciclos concluídos (RN-03).
- **RF-09 / UC07**: Reiniciar ciclos zerando a contagem e retornando ao primeiro foco (RN-04).
- **RF-10 / UC08**: Encerrar sessão ativa liberando o preset (RN-01).
- **RF-11 / UC09**: Trocar preset encerrando a sessão ativa anterior automaticamente (RN-02).
- **RF-12 / UC10**: Retomar sessão automaticamente recalculando o estado decorrido por timestamps (RN-07, RN-08).
- **RF-13 / UC11**: Descartar sessão retomada sem contabilizar progresso.
- **RF-14**: Alerta sonoro ao fim de cada fase (RN-13).

## 3. Estrutura Interna da Fatia
- `dominio/`: Entidade `SessaoAtiva`, `SnapshotPreset`, tipos de fase (`foco`, `pausaCurta`, `pausaLonga`), status (`ocioso`, `emAndamento`, `pausada`, `concluida`) e função pura de recálculo temporal.
- `maquina/`: Máquina de estados XState formalizando todas as transições e guardas.
- `persistencia/`: Repositório responsável pela chave `"pomodoro.sessaoAtiva"`.
- `ui/`: Visor de tempo regressivo (MM:SS), indicador de ciclo, botões de ação e notificador sonoro.
