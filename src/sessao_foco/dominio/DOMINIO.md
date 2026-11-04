# Domínio da Sessão de Foco (`src/sessao_foco/dominio`)

## 1. Responsabilidade
Encapsular os conceitos de Fases, Ciclos, Snapshots de Preset e o cálculo temporal absoluto baseado em timestamps.

## 2. Decisões de Design
1. **Snapshot Imutável do Preset (RN-05)**:
   - Ao iniciar a sessão, uma cópia exata dos tempos e limites do preset é gravada na sessão. Alterações posteriores no cadastro do preset não afetam a sessão em andamento.
2. **Cálculo Determinístico por Timestamps (RN-07, RN-08, RNF-03)**:
   - Toda contagem regressiva e transição de fase é baseada em `fimFasePrevistoEm - agora()`.
   - Isso elimina qualquer dependência de `setInterval` suspenso quando abas do navegador entram em hibernação ou quando a janela é fechada.
3. **Função Pura de Avanço de Fases**:
   - `avancarFasesVencidas(sessao, timestampAtual)`: avalia iterativamente se o tempo decorrido ultrapassou o término da fase atual, computando a fase vigente exata ou concluindo a sessão se todos os ciclos terminaram.
4. **Regras de Ciclo (RN-03, RN-04)**:
   - Pular fase manual não incrementa ciclo.
   - Concluir fase de pausa normal incrementa o ciclo corrente.
   - Reiniciar ciclos retorna ao ciclo 1 na fase foco.
