# Domínio Compartilhado (`src/compartilhado/dominio`)

## 1. Responsabilidade
Este diretório hospeda os Value Objects transversais e tipos fundamentais de domínio que não pertencem exclusivamente a uma única fatia de negócio.

## 2. Decisões de Design
1. **Padrão Resultado (`Resultado<Sucesso, Erro>`)**:
   - Tratamento de falhas explícito e tipado sem lançar exceções não controladas no fluxo comum.
   - Permite que validações (VR-01 a VR-08) retornem mensagens de erro objetivas sem sobrecarregar o chamador.
2. **Identificador Único (`IdentificadorId`)**:
   - Encapsulamento de strings de identificadores (UUID v4) impedindo o uso acidental de strings vazias ou nulas como IDs.
3. **Marca Temporal Absoluta (`TimestampMs`)**:
   - Encapsulamento de números inteiros positivos representando milissegundos desde a epoch unix, essencial para os recálculos de fases (RN-07).

## 3. Aplicação de Object Calisthenics
- **Encapsular Primitivos**: `IdentificadorId` e `TimestampMs` impedem primitivos crus.
- **Sem Palavra-chave ELSE**: Métodos de validação usam retornos antecipados.
- **No máximo 2 campos de instância**: Cada Value Object guarda apenas o seu valor imutável validado.
