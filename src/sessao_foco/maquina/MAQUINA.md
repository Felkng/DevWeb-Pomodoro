# Máquina de Estados da Sessão de Foco (`src/sessao_foco/maquina`)

## 1. Responsabilidade
Formalizar através do XState (v5) todas as transições de estado, eventos permitidos, guardas e ações executadas durante a vida de uma sessão Pomodoro.

## 2. Decisões de Design
1. **Estados Principais**:
   - `ocioso`: Nenhuma sessão ativa em andamento.
   - `emExecucao`: Sessão com temporizador ativo e calculando tempo restante com base em timestamps.
   - `pausado`: Sessão pausada com tempo restante congelado (RN-06).
   - `concluido`: Todos os ciclos do preset foram finalizados (RN-08).
2. **Eventos**:
   - `INICIAR`: Cria a sessão ativa com snapshot do preset e define fase inicial como foco (ciclo 1).
   - `PAUSAR`: Congela a contagem e salva o tempo restante em milissegundos.
   - `RETOMAR`: Recalcula o fim previsto somando o tempo restante ao instante presente.
   - `PULAR_FASE`: Avança para a próxima fase sem incrementar o contador de ciclos (RN-03).
   - `REINICIAR_CICLOS`: Retorna a contagem para o ciclo 1 em fase foco (RN-04).
   - `ENCERRAR`: Finaliza a sessão ativa e limpa a persistência (RN-01).
   - `DESCARTAR`: Remove a sessão restaurada sem gerar histórico (UC11).
   - `TICK`: Verifica se a fase atual venceu (`agora >= fimFasePrevistoEm`).
3. **Ações e Efeitos**:
   - Ao vencer uma fase: emitir alerta sonoro (RN-13) e transicionar para a próxima fase calculada.
   - Sincronização automática com a persistência em `localStorage`.
