# Módulo Compartilhado (`src/compartilhado`)

## 1. Responsabilidade
O diretório `compartilhado/` contém abstrações, contratos e utilitários transversais essenciais que são reutilizados pelas diferentes fatias verticais (`presets`, `sessao_foco`, `tarefas`), evitando acoplamento direto entre as fatias.

## 2. Decisões de Design
1. **Sem Dependência de Fatias**: O código em `compartilhado/` nunca importa nada de `presets/`, `sessao_foco/` ou `tarefas/`. A dependência é estritamente unidirecional das fatias para o compartilhado.
2. **Encapsulamento Estrito**: Tipos genéricos (como `Resultado<T, E>`), identificadores e utilitários temporais residem aqui como blocos fundamentais de construção.
3. **Isolamento de Efeitos Colaterais**: Operações de I/O de baixo nível (`window.localStorage`, Web Audio API, relógio do sistema) são encapsuladas em adaptadores defensivos em `infraestrutura/`.

## 3. Subestruturas
- `dominio/`: Value Objects fundamentais compartilhados (`IdentificadorId`, `TimestampMs`, `Resultado`).
- `infraestrutura/`: Adaptadores técnicos para persistência local, emissão de áudio e leitura de tempo.
- `ui/`: Componentes atômicos e diálogos de confirmação reutilizáveis exigidos pelas regras de negócio (RN-11).
