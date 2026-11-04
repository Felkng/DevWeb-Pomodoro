# Fatia Vertical: Gestão de Presets (`src/presets`)

## 1. Responsabilidade
Encapsular todas as operações relativas a temporizadores personalizados (presets): criação, edição, exclusão e listagem (RF-01 a RF-04, UC01 a UC04).

## 2. Requisitos e Regras Cobertas
- **RF-01 / UC01**: Criar preset com nome, tempo de foco, pausa curta, ciclos até pausa longa e pausa longa.
- **RF-02 / UC02**: Editar preset existente.
- **RF-03 / UC03**: Excluir preset existente, exigindo confirmação (RN-11).
- **RF-04**: Listar todos os presets disponíveis.
- **RN-01**: Preset em uso por sessão ativa não pode ser editado nem excluído.
- **RN-11**: Exclusão exige confirmação explícita do usuário.
- **VR-01 a VR-05**: Validações estritas de entrada por campo.

## 3. Estrutura Interna da Fatia
- `dominio/`: Value Objects com validação (`NomePreset`, `MinutosFoco`, etc.), entidade `Preset` e coleção `ListaPresets`.
- `persistencia/`: Adaptador de repositório responsável pela chave `"pomodoro.presets"` no localStorage.
- `ui/`: Componentes visuais para listar presets, formulário de cadastro/edição e botões de ação com feedback de validação.
