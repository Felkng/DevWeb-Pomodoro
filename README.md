# Gestão de Foco Pomodoro — Aplicação Web

Aplicação web moderna para gerenciamento de ciclos de foco e pausas baseada na técnica Pomodoro, voltada para estudantes que desejam estruturar e acompanhar suas sessões de estudo com eficiência.

Projeto desenvolvido para a disciplina de **Desenvolvimento Web**.

---

## 👥 Equipe do Projeto

| Papel | Nome |
| :--- | :--- |
| **Líder da Equipe** | *Felipe Rodrigues de Sousa Ferreira* |
| Membro | *Luigi Eliabe Ataide da Silva* |
| Membro | *Ana Kelly Souza Ribeiro* |
| Membro | *Maicon Pedro Macedo Leles* |

---

## 🚀 Funcionalidades Principais

1. **Gestão de Temporizadores Personalizados (Presets)**:
   - Criação, edição, exclusão e listagem de temporizadores informando tempo de foco (1 a 120 min), pausa curta (1 a 60 min), quantidade de ciclos (1 a 12) e pausa longa (1 a 60 min).
   - Bloqueio inteligente de edição e exclusão de preset atualmente em uso por sessão ativa (**RN-01**).
   - Confirmação explícita prévia em todas as exclusões (**RN-11**, **RF-20**).

2. **Execução de Sessões Pomodoro**:
   - Fases de **Foco**, **Pausa Curta** e **Pausa Longa** calculadas automaticamente a partir de snapshot imutável (**RN-05**).
   - Controles de **Iniciar**, **Pausar**, **Retomar**, **Pular Fase**, **Reiniciar Ciclos** e **Encerrar Sessão**.
   - Pular fase preserva a contagem de ciclos sem incrementá-la indevidamente (**RN-03**).
   - Trocar de preset encerra automaticamente a sessão ativa anterior (**RN-02**), preservando a sessão caso o mesmo preset seja selecionado.

3. **Precisão Temporal e Retomada Automática (Resiliência)**:
   - Persistência contínua do estado da sessão ativa no `localStorage`.
   - Recálculo por **timestamps absolutos** na reabertura do navegador, compensando períodos fechados ou abas suspensas sem perda de progresso (**RN-07**, **RN-08**, **RNF-03**).
   - Sessões pausadas permanecem estritamente pausadas após a reabertura (**RN-06**).
   - Opção de **Descartar Sessão Retomada** com diálogo de confirmação (**RF-13**, **UC11**).

4. **Alerta Sonoro**:
   - Emissão de alerta sonoro harmônico ao término de cada fase (**RN-13**, **RF-14**), sintetizado via Web Audio API sem necessidade de arquivos externos pesados.
   - Ativação/desbloqueio do contexto de áudio logo na primeira interação do usuário, respeitando as políticas restritivas de *autoplay* dos navegadores modernos (**R-01**, **RNF-10**).

5. **Painel Lateral de Tarefas de Estudo**:
   - Criação, edição e exclusão de tarefas de estudo desacopladas do temporizador (**RN-09**).
   - Valores padrão automáticos: estado `backlog` e prioridade `média` (**RN-12**).
   - **Ordenação Fixa Automática (RN-10)**: Prioridade decrescente (`alta` → `média` → `baixa`) e, como critério de desempate, estado na ordem: `a fazer` → `em execução` → `concluída` → `cancelada` → `backlog`.
   - Layout responsivo: painel posicionado à direita em telas grandes e reposicionado abaixo do temporizador em dispositivos móveis (**RNF-05**).

---

## 🛠️ Decisões Técnicas e Arquitetura

O projeto foi construído empregando práticas de engenharia de software e padrões de design modernos:

### 1. Stack Tecnológica
- **React 19** & **TypeScript (Strict Mode)**: Interface reativa e fortemente tipada, com garantia de integridade em tempo de compilação sem uso de tipos `any`.
- **XState v5**: Máquina de estados finita determinística para modelar com precisão o ciclo de vida da sessão Pomodoro (`ocioso`, `emExecucao`, `pausado`, `concluido`).
- **Tailwind CSS**: Estilização utilitária e responsiva com foco em acessibilidade e consistência visual.
- **Vitest & React Testing Library**: Suíte de testes unitários e de integração abrangente orientada a TDD (*Red-Green-Refactor*).
- **Vite**: Ferramenta de build de alta performance e recarregamento instantâneo.

### 2. Vertical Slice Architecture (Fatias Verticais)
Em vez de organizar o código em camadas horizontais monolíticas, o código é estruturado por fatias funcionais verticais autônomas:
- `src/sessao_foco/`: Ciclo de vida da sessão Pomodoro, máquina XState, cálculo temporal e componente de temporizador.
- `src/presets/`: Entidade, validações, persistência e visualização de presets.
- `src/tarefas/`: Gestão, ordenação estrita (**RN-10**) e formulários de tarefas.
- `src/compartilhado/`: Objetos de valor primitivos (`IdentificadorId`, `TimestampMs`, `Resultado`), áudio e adaptadores de armazenamento.

### 3. Object Calisthenics
O código segue rigorosamente as 9 diretrizes de *Object Calisthenics*:
1. Apenas 1 nível de indentação por método.
2. Não utilizar a palavra-chave `else` (uso de *guard clauses* e *early returns*).
3. Encapsulamento de primitivos em *Value Objects* com validação embutida (**VR-01 a VR-08**).
4. Coleções de primeira classe (`ListaPresets`, `ListaTarefas`).
5. Apenas um ponto por linha (Lei de Demeter).
6. Não abreviar nomes de variáveis e funções.
7. Entidades pequenas e coesas.
8. Máximo de 2 variáveis de instância por classe.
9. Sem *getters/setters* anêmicos (favorecendo o princípio *Tell, Don't Ask* e estruturas de dados imutáveis).

---

## 📋 Instruções de Execução

### Pré-requisitos
- **Node.js** (versão 18.x ou superior recomendada)
- **npm** (versão 9.x ou superior)

### 1. Clonar o Repositório
```bash
git clone <url-do-repositorio>
cd DevWeb-Pomodoro
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Executar em Ambiente de Desenvolvimento
```bash
npm run dev
```
Acesse a aplicação no navegador através do endereço exibido no terminal (geralmente `http://localhost:5173/`).

### 4. Executar os Testes Automatizados
```bash
# Execução única dos testes unitários e de integração
npm test -- --run

# Execução interativa (watch mode)
npm test
```

### 5. Compilar para Produção (Build)
```bash
npm run build
```
Os arquivos otimizados para produção serão gerados no diretório `dist/`. Para visualizar o build de produção localmente:
```bash
npm run preview
```
