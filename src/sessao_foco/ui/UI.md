# Interface da Sessão de Foco (`src/sessao_foco/ui`)

## 1. Responsabilidade
Exibir o temporizador visual (contagem regressiva em minutos e segundos), o tipo de fase corrente (Foco, Pausa Curta, Pausa Longa), o ciclo atual versus o total, e os controles de ação (Iniciar, Pausar, Retomar, Pular Fase, Reiniciar Ciclos, Encerrar e Descartar).

## 2. Decisões de Design
1. **Comunicação por Eventos ("Tell, Don't Ask")**:
   - O componente visual não realiza cálculos de tempo internamente. Ele consulta o ator XState ou o hook controlador e despacha eventos semânticos (`send({ type: 'PAUSAR' })`).
2. **Atualização Visual Suave**:
   - Um tick leve em intervalo (ex.: 500ms ou via `requestAnimationFrame`) lê a diferença entre o timestamp de fim e o relógio atual para atualizar os dígitos `MM:SS`.
3. **Indicadores de Estado e Fases**:
   - Cores e rótulos semânticos distintos para cada fase (ex.: Tom focado para Foco, tom calmo/relaxante para Pausa Curta e Pausa Longa).
4. **Diálogos de Confirmação**:
   - Ações de Encerrar, Reiniciar Ciclos e Descartar acionam confirmação explícita antes do envio do evento destrutivo (RN-11).
