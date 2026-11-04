# Persistência de Presets (`src/presets/persistencia`)

## 1. Responsabilidade
Gerenciar a serialização e desserialização da lista de presets no `localStorage` sob a chave obrigatória `"pomodoro.presets"` (Seção 11.4).

## 2. Decisões de Design
1. **Contrato de Repositório (`RepositorioPresets`)**:
   - `carregar(): ListaPresets`
   - `salvar(presets: ListaPresets): Resultado<void, string>`
2. **Preset Padrão**:
   - Caso o armazenamento esteja vazio (primeiro acesso do estudante), inicializa automaticamente com um preset clássico de Pomodoro:
     - Foco: 25 min
     - Pausa Curta: 5 min
     - Ciclos: 4
     - Pausa Longa: 15 min
3. **Tratamento de Dados Inválidos**:
   - Se o conteúdo persistido contiver dados corrompidos, descarta registros defeituosos e preserva a integridade do sistema.
