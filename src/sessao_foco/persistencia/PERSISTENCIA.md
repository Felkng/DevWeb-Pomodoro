# Persistência da Sessão Ativa (`src/sessao_foco/persistencia`)

## 1. Responsabilidade
Persistir o estado da sessão ativa no `localStorage` sob a chave obrigatória `"pomodoro.sessaoAtiva"` e carregá-la no arranque da aplicação para retomada automática (RF-12, UC10).

## 2. Decisões de Design
1. **Contrato de Repositório (`RepositorioSessaoAtiva`)**:
   - `carregar(): SessaoAtiva | null`
   - `salvar(sessao: SessaoAtiva): Resultado<void, string>`
   - `limpar(): void`
2. **Tratamento de Inconsistência e Retomada**:
   - Ao carregar a aplicação, se a sessão encontrada for válida:
     - Se estava `pausada`: reabre exatamente pausada (RN-06).
     - Se estava `emAndamento`: executa a função de recálculo temporal puro com base em `Date.now()`. Caso todas as fases tenham expirado enquanto o navegador esteve fechado, transiciona para `concluida` (RN-08).
   - Caso o payload esteja corrompido, limpa o registro com segurança para evitar travamento da interface (R-03).
