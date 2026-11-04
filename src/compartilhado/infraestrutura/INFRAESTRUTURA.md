# Infraestrutura Compartilhada (`src/compartilhado/infraestrutura`)

## 1. Responsabilidade
Este diretório agrupa os adaptadores que interagem diretamente com as APIs do navegador (Web APIs): persistência em `localStorage`, síntese sonora de alerta com Web Audio API e leitura do relógio do sistema.

## 2. Decisões de Design
1. **Contratos Claros (Interfaces)**: O domínio nunca interage diretamente com APIs globais como `window.localStorage` ou `Date.now()`. Ele depende de contratos ou adaptadores testáveis.
2. **Defensividade contra Falhas do Navegador**:
   - Tratamento de exceções de cota ou indisponibilidade de `localStorage` (R-03).
   - Suporte a dados corrompidos: caso o JSON esteja inválido, a infraestrutura reporta falha segura em vez de quebrar a aplicação.
3. **Submódulos Especializados**:
   - `audio/`: Notificação sonora respeitando a política de autoplay do navegador.
   - `persistencia/`: Driver tipado de leitura/escrita em localStorage.
   - `relogio/`: Provedor abstrato de tempo para permitir testes com tempo congelado ou acelerado.
