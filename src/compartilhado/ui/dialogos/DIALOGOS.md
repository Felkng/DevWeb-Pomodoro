# Diálogos de Confirmação (`src/compartilhado/ui/dialogos`)

## 1. Responsabilidade
Fornecer o componente modal para confirmações explícitas de ações destrutivas ou de transição que exigem concordância do usuário.

## 2. Decisões de Design
1. **Regra de Negócio Centralizada (RN-11 / RF-20)**:
   - "Toda exclusão, de preset ou de tarefa, exige confirmação explícita do usuário."
   - Também aplicável a ações de encerramento de sessão (UC08), descarte de sessão retomada (UC11) e reinício de ciclos (UC07).
2. **Prevenção de Cliques Acidentais**:
   - Diálogo com foco inicial no botão "Cancelar", exigindo ação intencional para confirmar a operação.
   - Suporte nativo ao fechamento via tecla `Escape`.
3. **Composição Simples**:
   - Componente recebe: `titulo`, `mensagem`, `textoConfirmar`, `onConfirmar`, `onCancelar` e `aberto`.
