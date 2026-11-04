# Persistência de Tarefas (`src/tarefas/persistencia`)

## 1. Responsabilidade
Persistir a lista de tarefas no `localStorage` sob a chave `"pomodoro.tarefas"` (Seção 11.4).

## 2. Decisões de Design
1. **Contrato de Repositório (`RepositorioTarefas`)**:
   - `carregar(): ListaTarefas`
   - `salvar(tarefas: ListaTarefas): Resultado<void, string>`
2. **Desacoplamento do Temporizador (RN-09)**:
   - Modificações na persistência de tarefas não tocam e não alteram nenhum dado de presets ou sessão de foco.
3. **Resiliência a Erros**:
   - Qualquer payload inválido é descartado ou isolado, retornando lista vazia sem lançar exceções para a interface.
