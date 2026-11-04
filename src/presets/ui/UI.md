# Interface de Presets (`src/presets/ui`)

## 1. Responsabilidade
Exibir a lista de presets cadastrados, permitir a seleção do preset ativo, disponibilizar o formulário de criação/edição e acionar a confirmação de exclusão.

## 2. Decisões de Design
1. **Regra de Bloqueio Ativo (RN-01)**:
   - Os botões de editar e excluir ficam desabilitados quando o preset corresponde à sessão ativa em andamento ou pausada, acompanhados de mensagem informativa ao usuário.
2. **Formulário com Validação Imediata (VR-01 a VR-05)**:
   - Mensagens de erro claras e em português exibidas diretamente abaixo de cada campo inválido.
   - O botão "Salvar" só é habilitado quando todos os campos satisfazem os requisitos de validação.
3. **Confirmação Explícita de Exclusão (RN-11)**:
   - Ao clicar no botão de excluir, abre o diálogo de confirmação compartilhado antes de remover o preset da persistência.
