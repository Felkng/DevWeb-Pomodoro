# Infraestrutura de Relógio (`src/compartilhado/infraestrutura/relogio`)

## 1. Responsabilidade
Fornecer a marca temporal corrente (`TimestampMs`) para cálculos de início e término de fases, garantindo que o código dependente possa ser testado com precisão determinística.

## 2. Decisões de Design
1. **Interface de Relógio (`Relogio`)**:
   - Expõe apenas o método `agora(): TimestampMs`.
2. **Implementação de Produção (`RelogioSistema`)**:
   - Utiliza `Date.now()` para capturar a marca temporal absoluta em milissegundos.
3. **Implementação de Teste (`RelogioFalso` / `FakeTimer`)**:
   - Permite avançar o relógio instantaneamente em testes unitários para simular fases concluídas, sono da aba do navegador e reabertura após longos períodos (UC10, RN-07).
