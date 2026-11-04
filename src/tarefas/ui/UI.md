# Interface de Tarefas (`src/tarefas/ui`)

## 1. Responsabilidade
Renderizar o painel lateral de tarefas de estudo com ordenação automática (RN-10), criação rápida com valores padrão (RN-12), edição e confirmação de exclusão (RN-11).

## 2. Decisões de Design
1. **Posicionamento Responsivo (RF-18, RNF-05)**:
   - Em desktop (telas a partir de `lg`), o painel de tarefas fica posicionado à direita do temporizador.
   - Em telas menores (mobile e tablets), o painel se reorganiza fluentemente para baixo do temporizador.
2. **Formulário com Valores Padrão (RN-12)**:
   - Ao abrir o modal de nova tarefa, `estado` já vem selecionado como `backlog` e `prioridade` como `media`.
3. **Badges Visuais**:
   - Cada tarefa exibe de forma clara seu título, badge de estado e badge de prioridade com cores semânticas distintas.
4. **Confirmação de Exclusão (RN-11, RF-20)**:
   - Aciona o diálogo de confirmação compartilhado antes de remover a tarefa.
