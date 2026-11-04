# Domínio de Tarefas (`src/tarefas/dominio`)

## 1. Responsabilidade
Modelar a entidade `Tarefa`, seus Value Objects e a coleção `ListaTarefas` com a regra estrita de ordenação fixa (RN-10).

## 2. Validações e Value Objects
- `TituloTarefa`: Texto obrigatório entre 1 e 100 caracteres (VR-06).
- `EstadoTarefa`: Enumeração restrita entre `backlog`, `aFazer`, `emExecucao`, `concluida` e `cancelada` (VR-07). Padrão ao criar: `backlog` (RN-12).
- `PrioridadeTarefa`: Enumeração restrita entre `baixa`, `media` e `alta` (VR-08). Padrão ao criar: `media` (RN-12).

## 3. Algoritmo de Ordenação Obrigatório (RN-10)
A coleção `ListaTarefas` garante que os itens retornados estejam ordenados segundo o peso composto:
1. Peso de Prioridade:
   - `alta` = 3
   - `media` = 2
   - `baixa` = 1
2. Peso de Estado (critério de desempate):
   - `aFazer` = 5
   - `emExecucao` = 4
   - `concluida` = 3
   - `cancelada` = 2
   - `backlog` = 1

## 4. Aplicação de Object Calisthenics
- **Coleção de Primeira Classe**: A ordenação e manipulação são métodos de `ListaTarefas`.
- **Sem ELSE**: O cálculo de pesos e comparações é feito via mapeamento estático simples ou retornos antecipados.
- **Entidades Pequenas**: A classe `Tarefa` é imutável e mantém apenas métodos de comportamento para alterar estado ou prioridade gerando nova instância.
