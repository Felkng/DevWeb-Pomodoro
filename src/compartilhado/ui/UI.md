# Interface Compartilhada (`src/compartilhado/ui`)

## 1. Responsabilidade
Contém componentes visuais de apresentação reutilizáveis, primitivas estilizadas com Tailwind CSS e padrões de acessibilidade que atendem aos requisitos não funcionais da aplicação.

## 2. Decisões de Design
1. **Acessibilidade por Teclado e Semântica (RNF-07)**:
   - Botões, inputs e diálogos utilizam elementos nativos semânticos (`<button>`, `<input>`, `<dialog>`), com foco visível e suporte a navegação por teclado (`Tab`, `Enter`, `Escape`).
2. **Design Responsivo e Estilo com Tailwind (RNF-04, RNF-05)**:
   - Uso de classes utilitárias do Tailwind para garantir consistência visual sem poluir o código com arquivos CSS avulsos.
   - Padrão visual sóbrio, com tipografia legível e contrastes adequados para estudantes em foco prolongado.
3. **Baixa Carga Cognitiva**:
   - Componentes sem lógicas internas complexas de estado. Eles recebem propriedades simples e emitem eventos diretos.
