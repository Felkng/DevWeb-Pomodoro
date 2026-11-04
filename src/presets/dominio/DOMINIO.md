# Domínio de Presets (`src/presets/dominio`)

## 1. Responsabilidade
Contém a entidade `Preset`, a coleção de primeira classe `ListaPresets` e os Value Objects de validação para cada campo.

## 2. Validações e Value Objects (VR-01 a VR-05)
- `NomePreset`: Texto obrigatório entre 1 e 40 caracteres (VR-01).
- `MinutosFoco`: Inteiro positivo entre 1 e 120 minutos (VR-02).
- `MinutosPausaCurta`: Inteiro positivo entre 1 e 60 minutos (VR-03).
- `CiclosAntesPausaLonga`: Inteiro positivo entre 1 e 12 ciclos (VR-04).
- `MinutosPausaLonga`: Inteiro positivo entre 1 e 60 minutos (VR-05).

## 3. Aplicação de Object Calisthenics
1. **Encapsular Primitivos**: Nenhum dos limites numéricos ou regras de string é validado solto na tela; tudo reside nos Value Objects.
2. **Coleção de Primeira Classe (`ListaPresets`)**: A lista de presets possui métodos próprios (`adicionar`, `atualizar`, `remover`, `obterPorId`) e não expõe diretamente o array interno mutável.
3. **Imutabilidade**: Todas as alterações produzem novas instâncias, garantindo previsibilidade.
4. **Sem ELSE**: Validações retornam `Resultado.sucesso()` ou `Resultado.falha()` utilizando guard clauses.
