# Arquitetura Global do Projeto

## 1. Visão Geral
Este documento define a arquitetura, convenções e decisões estruturais da aplicação de gestão de foco Pomodoro. A aplicação é executada 100% no navegador (single-user), com persistência exclusiva em `localStorage`, sem backend externo e com interface em português.

## 2. Padrão Arquitetural: Vertical Slice Architecture
Em vez da tradicional separação horizontal em camadas monolíticas (onde todo domínio fica separado de toda UI), este projeto adota **Fatias Verticais (Vertical Slices)**. Cada fatia reúne tudo o que pertence a um conjunto de casos de uso coeso:
- `presets/`: Gestão de configurações de temporizadores reutilizáveis (UC01 a UC04).
- `sessao_foco/`: Ciclo de vida da sessão Pomodoro, transições de fases, recálculo por timestamp e alerta sonoro (UC04 a UC11).
- `tarefas/`: Gestão e exibição ordenada da lista de afazeres (UC12 a UC15).
- `compartilhado/`: Recursos transversais de baixo nível (Value Objects básicos, adaptadores de armazenamento e áudio).

### 2.1 Vantagens das Fatias Verticais neste Projeto
1. **Alta Coesão**: Modificar o comportamento de presets não afeta o código de tarefas nem a máquina de sessão de foco.
2. **Documentação Viva e Localizada**: Cada fatia possui sua própria documentação em `.md` no mesmo nível do seu código.
3. **Evolução Independente**: Casos de uso podem ser testados de ponta a ponta (do domínio à interface) isoladamente.

## 3. Diretrizes de Object Calisthenics
Todo o código deste repositório adere estritamente às 9 regras de Object Calisthenics:
1. **Apenas 1 nível de indentação por método**: O fluxo deve ser plano, delegando passos a funções auxiliares.
2. **Não use a palavra-chave ELSE**: Utilizar guard clauses e retornos antecipados (*early returns*).
3. **Encapsule todos os tipos primitivos e strings**: Nenhum dado trafega solto. Números e strings devem ser Value Objects com validações embutidas (VR-01 a VR-08).
4. **Coleções de primeira classe**: Qualquer módulo que encapsule uma lista/array não terá outro campo além da própria coleção e operações puras sobre ela.
5. **Apenas um ponto por linha (Law of Demeter)**: Não encadear chamadas entre objetos distintos. Comunicar por comandos de intenção.
6. **Não abrevie**: Nomes completos e expressivos (ex.: `temporizador`, `repositorio`, `identificador`).
7. **Mantenha as entidades pequenas**: Nenhuma classe com mais de 50 linhas; pacotes coesos com poucos arquivos.
8. **No máximo 2 variáveis de instância**: Alta modularidade e coesão via composição.
9. **Não use Getters/Setters anêmicos**: Favorecer comportamento ("Tell, Don't Ask") e representações imutáveis.

## 4. Política de Baixa Carga Cognitiva
- Código explícito, compreensível no primeiro relance.
- Proibição de truques sintáticos, expressões regulares excessivamente densas ou *one-liners* crípticos.
- Nomes em português, refletindo fielmente a linguagem ubíqua descrita no glossário de requisitos.

## 5. Estratégia de Testes (Red / Green / Refactor)
Todo comportamento de negócio é implementado guiado por TDD com Vitest:
1. **Red**: Escrever o teste unitário que define a expectativa e falha.
2. **Green**: Escrever o código mínimo necessário para fazer o teste passar.
3. **Refactor**: Ajustar estrutura, legibilidade e calisthenics mantendo os testes 100% verdes.
