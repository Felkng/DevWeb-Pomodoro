# Fatia Vertical: Gestão de Tarefas (`src/tarefas`)

## 1. Responsabilidade
Encapsular todas as regras, armazenamento e interface para o painel lateral de tarefas de estudo do estudante (RF-15 a RF-20, UC12 a UC15).

## 2. Requisitos e Regras Cobertas
- **RF-15 / UC12**: Criar tarefa com título, estado e prioridade.
- **RF-16 / UC13**: Editar título, estado e prioridade de uma tarefa existente.
- **RF-17 / UC14**: Excluir tarefa existente, com confirmação obrigatória (RN-11).
- **RF-18 / UC15**: Exibir painel de tarefas à direita em desktop e abaixo em telas menores (RNF-05).
- **RF-19**: Ordenar tarefas de acordo com o algoritmo de ordenação estrito (RN-10).
- **RF-20**: Confirmar exclusão explicitamente.
- **RN-09**: Tarefas são desacopladas do temporizador; alterações em tarefas não afetam a sessão e vice-versa.
- **RN-10**: Ordenação fixa do painel:
  - 1º: Prioridade decrescente (`alta` > `media` > `baixa`).
  - 2º: Estado (`aFazer` > `emExecucao` > `concluida` > `cancelada` > `backlog`).
- **RN-12**: Toda tarefa criada assume estado `backlog` e prioridade `media` como valores padrão.
- **VR-06 a VR-08**: Validações de entrada por campo.

## 3. Estrutura Interna da Fatia
- `dominio/`: Entidade `Tarefa`, Value Objects (`TituloTarefa`, `EstadoTarefa`, `PrioridadeTarefa`) e coleção ordenada de primeira classe `ListaTarefas`.
- `persistencia/`: Repositório responsável pela chave `"pomodoro.tarefas"` no localStorage.
- `ui/`: Painel lateral responsivo, lista de cartões de tarefas e modal de criação/edição.
