# Infraestrutura de Persistência Local (`src/compartilhado/infraestrutura/persistencia`)

## 1. Responsabilidade
Fornecer um driver genérico, seguro e desacoplado para operações de gravação, leitura e remoção no `localStorage` do navegador.

## 2. Decisões de Design
1. **Chaves Padronizadas**:
   - Apenas o contrato de armazenamento conhece o prefixo ou as chaves definidas pelo documento de requisitos (Seção 11.4):
     - `"pomodoro.presets"`
     - `"pomodoro.tarefas"`
     - `"pomodoro.sessaoAtiva"`
2. **Prevenção de Corrupção (R-03)**:
   - Toda leitura faz *parse* protegido em bloco `try/catch`. Caso o conteúdo armazenado esteja corrompido ou seja um JSON inválido, retorna valor nulo/falha limpa em vez de quebrar a aplicação.
3. **Serialização Segura**:
   - Falhas de gravação (ex.: cota cheia do navegador) retornam erro explícito via tipo `Resultado`.
