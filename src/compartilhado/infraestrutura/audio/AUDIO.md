# Infraestrutura de Áudio (`src/compartilhado/infraestrutura/audio`)

## 1. Responsabilidade
Responsável por gerar o alerta sonoro audível ao final de cada fase da sessão de foco (RF-14, RN-13, RNF-10).

## 2. Decisões de Design
1. **Web Audio API Pura**:
   - Para não depender de arquivos de áudio externos ou requisições de rede (RT-03), utilizamos osciladores sintetizados do próprio navegador (`AudioContext` / `OscillatorNode`).
   - Tom agradável e suave de término de fase (ex.: acorde simples de sino / bipe harmônico).
2. **Mitigação do Autoplay Policy (R-01)**:
   - Navegadores bloqueiam áudio automático antes do primeiro gesto do usuário.
   - O adaptador inicializa ou desbloqueia (`resume()`) o contexto de áudio assim que o usuário clica no botão "Iniciar" ou "Retomar".
3. **Isolamento de Erros**:
   - Se o áudio falhar (por restrição de hardware ou política do navegador), a execução da contagem do temporizador não é interrompida.
