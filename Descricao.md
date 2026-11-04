# **Documento de Requisitos de *Software*** **Aplicação *Web* de Gestão de Foco (Pomodoro)**

## **1\. Visão geral e objetivo**

Este documento especifica os requisitos de engenharia de software para uma aplicação web de temporizador de foco, popularmente conhecida como Pomodoro, destinada a estudantes que desejam melhorar a eficiência de seus ciclos de estudo. O sistema deve permitir a criação de temporizadores personalizados, a gestão de sessões de foco com persistência e retomada automática e o gerenciamento de tarefas de estudo em um painel lateral.

O documento é direcionado à equipe de desenvolvimento e serve como artefato de referência para implementação, validação e aceite do MVP.

Exemplos de aplicações semelhantes podem ser obtidos em pesquisas na Web, mas apresento uma para referência: [https\://pomodorotimer.online/pt](https://pomodorotimer.online/pt).

## **2\. Escopo e fora de escopo**

### 2.1 Dentro do escopo

* Aplicação web single-user, executada inteiramente no navegador.  
* Persistência local via localStorage.  
* Criação, edição, exclusão e listagem de temporizadores personalizados.  
* Execução de sessão de foco com fases de foco, pausa curta e pausa longa.  
* Controles de pausar, retomar, pular fase, reiniciar ciclos e encerrar sessão.  
* Persistência e retomada automática da sessão ativa com base em timestamps.  
* Descarte de sessão retomada.  
* Alerta sonoro ao fim de cada fase.  
* Painel lateral direito de tarefas, com criação, edição, exclusão e ordenação.  
* Layout responsivo para desktop e dispositivos móveis.  
* Interface em português, sem seletor de idioma.

### 2.2 Fora do escopo

* Autenticação, login ou qualquer forma de identificação de usuário.  
* Backend, banco de dados remoto ou sincronização entre dispositivos.  
* Multiusuário, colaboração ou compartilhamento.  
* Notificações do navegador, push ou qualquer canal externo de alerta.  
* Notificações sonoras customizáveis ou biblioteca de sons.  
* Filtros de tarefas, etiquetas, categorias ou subtarefas.  
* Integração com calendários, agendas ou ferramentas externas.  
* Aplicativo nativo (iOS, Android) ou versão desktop instalável.  
* Analytics, telemetria, gamificação, relatórios ou histórico de produtividade.  
* Internacionalização ou seletor de idioma.

## **3\. Contexto de uso e persona**

* Persona principal: estudante que utiliza ciclos de foco e pausa para organizar sessões de estudo.  
* Ambiente: navegador web moderno em desktop ou dispositivo móvel.  
* Contexto: uso individual, no próprio dispositivo, sem compartilhamento de dados.  
* Objetivo do usuário: configurar ciclos de estudo, mantê-los em execução, retomá-los após interrupções e registrar tarefas paralelas.

## **4\. Glossário**

* Preset (temporizador personalizado): configuração reutilizável composta por tempo de foco, tempo de pausa curta, quantidade de ciclos antes da pausa longa e tempo de pausa longa.  
* Sessão ativa: instância em execução de um preset, com fase atual, ciclo corrente, status e timestamps.  
* Fase: etapa da sessão, podendo ser foco, pausa curta ou pausa longa.  
* Ciclo: conjunto formado por uma fase de foco seguida de uma fase de pausa (curta ou longa).  
* Snapshot: cópia dos parâmetros do preset no momento em que a sessão foi iniciada.  
* Tarefa: item de estudo com título, estado e prioridade, exibido no painel lateral.  
  * O estado de uma tarefa pode ser identificado como:  
    * Backlog: tarefa capturada, mas ainda não comprometida com um ciclo de estudo. É o "talvez", o "algum dia", o "quando sobrar tempo". Serve para não perder a ideia sem poluir a lista do que está de fato planejado.  
    * A fazer: tarefa já comprometida, que o estudante pretende atacar nos próximos ciclos. É o "vai ser feito".  
    * Em execução: tarefa que está sendo trabalhada agora.  
    * Concluída: tarefa finalizada.  
    * Cancelada: tarefa abandonada, sem conclusão.  
* Timestamp: marca temporal absoluta usada para recalcular o estado da sessão após reabertura.

## **5\. Requisitos funcionais**

### 5.1 Gestão de temporizadores personalizados

* RF-01 \- Criar temporizador personalizado: o sistema deve permitir criar um preset informando nome, tempo de foco, tempo de pausa curta, quantidade de ciclos antes da pausa longa e tempo de pausa longa.  
* RF-02 \- Editar temporizador personalizado: o sistema deve permitir editar os campos de um preset existente, exceto quando houver sessão ativa baseada nele.  
* RF-03 \- Excluir temporizador personalizado: o sistema deve permitir excluir um preset existente, exceto quando ele estiver em uso por uma sessão ativa.  
* RF-04 \- Listar temporizadores personalizados: o sistema deve exibir a lista de presets cadastrados com seus parâmetros.

### 5.2 Execução de sessão de foco

* RF-05 \- Iniciar sessão de foco: o sistema deve permitir iniciar uma sessão a partir de um preset selecionado.  
* RF-06 \- Pausar sessão: o sistema deve permitir pausar a sessão ativa, preservando o tempo restante da fase corrente.  
* RF-07 \- Retomar sessão: o sistema deve permitir retomar uma sessão pausada, recalculando o fim da fase a partir do momento da retomada.  
* RF-08 \- Pular fase: o sistema deve permitir avançar manualmente da fase atual para a próxima fase prevista.  
* RF-09 \- Reiniciar ciclos: o sistema deve permitir zerar a contagem de ciclos e retornar ao primeiro ciclo de foco.  
* RF-10 \- Encerrar sessão: o sistema deve permitir finalizar a sessão ativa a qualquer momento.  
* RF-11 \- Trocar preset: o sistema deve permitir selecionar outro preset, encerrando automaticamente a sessão ativa em andamento.  
* RF-14 \- Emitir alerta sonoro: o sistema deve emitir um alerta sonoro audível ao fim de cada fase.

### 5.3 Persistência e retomada

* RF-12 \- Retomar sessão automaticamente: o sistema deve restaurar automaticamente a sessão ativa ao reabrir o navegador, recalculando o estado com base em timestamps.  
* RF-13 \- Descartar sessão retomada: o sistema deve permitir que o usuário descarte a sessão retomada, encerrando-a sem contabilizar progresso.

### 5.4 Gestão de tarefas

* RF-15 \- Criar tarefa: o sistema deve permitir criar uma tarefa informando título, estado e prioridade.  
* RF-16 \- Editar tarefa: o sistema deve permitir editar título, estado e prioridade de uma tarefa existente.  
* RF-17 \- Excluir tarefa: o sistema deve permitir excluir uma tarefa existente, com confirmação obrigatória.  
* RF-18 \- Visualizar painel de tarefas: o sistema deve exibir o painel de tarefas à direita do temporizador em desktop, com comportamento responsivo em telas menores.  
* RF-19 \- Ordenar tarefas: o sistema deve ordenar as tarefas por prioridade (alta, média, baixa) e, em seguida, por estado (backlog, a fazer, em execução, concluída, cancelada).  
* RF-20 \- Confirmar exclusões: o sistema deve solicitar confirmação explícita do usuário em toda operação de exclusão.

## **6\. Regras de negócio**

* RN-01 \- Um preset em uso por sessão ativa não pode ser editado nem excluído.  
* RN-02 \- Ao selecionar outro preset, a sessão ativa em andamento é encerrada automaticamente antes da troca.  
* RN-03 \- Pular uma fase de foco não incrementa a contagem de ciclos; pular uma fase de pausa também não incrementa.  
* RN-04 \- Reiniciar ciclos zera a contagem de ciclos e retorna ao primeiro ciclo de foco, mantendo o preset ativo.  
* RN-05 \- A sessão ativa utiliza um snapshot dos parâmetros do preset no momento do início, de modo que edições posteriores no preset não afetam a sessão em curso.  
* RN-06 \- Uma sessão pausada antes do fechamento do navegador retorna pausada ao ser reaberta, sem avanço automático.  
* RN-07 \- Fases vencidas durante o período em que o navegador esteve fechado são recalculadas por timestamp; o sistema avança automaticamente até a fase vigente ou até a conclusão da sessão.  
* RN-08 \- Se todas as fases previstas vencerem durante o período fechado, a sessão é encerrada com status concluído.  
* RN-09 \- Tarefas são desacopladas do temporizador; alterações em tarefas não afetam a sessão e vice-versa.  
* RN-10 \- A ordenação do painel de tarefas é fixa: prioridade em ordem decrescente (alta, média, baixa), seguida de estado na ordem a fazer, em execução, concluída, cancelada, backlog.  
* RN-11 \- Toda exclusão, de preset ou de tarefa, exige confirmação explícita do usuário.  
* RN-12 \- Toda tarefa criada assume estado backlog e prioridade média como valores padrão, podendo ser alterados antes da confirmação.  
* RN-13 \- Ao fim de cada fase, o sistema emite alerta sonoro e atualiza a interface para a próxima fase prevista.

## **7\. Validações de entrada**

* VR-01 \- Nome do preset: obrigatório, entre 1 e 40 caracteres.  
* VR-02 \- Tempo de foco: inteiro entre 1 e 120 minutos.  
* VR-03 \- Tempo de pausa curta: inteiro entre 1 e 60 minutos.  
* VR-04 \- Quantidade de ciclos antes da pausa longa: inteiro entre 1 e 12\.  
* VR-05 \- Tempo de pausa longa: inteiro entre 1 e 60 minutos.  
* VR-06 \- Título da tarefa: obrigatório, entre 1 e 100 caracteres.  
* VR-07 \- Estado da tarefa: um entre backlog, a fazer, em execução, concluída e cancelada.  
* VR-08 \- Prioridade da tarefa: uma entre baixa, média e alta.

Valores fora dos limites devem ser rejeitados com mensagem clara ao usuário. Campos obrigatórios vazios impedem a confirmação da operação.

## **8\. Casos de uso**

### UC01 \- Criar temporizador personalizado

* Ator: estudante.  
* Pré-condições: nenhuma.  
* Fluxo principal:  
  * O usuário aciona a opção de criar temporizador.  
  * O sistema apresenta o formulário com os campos previstos em RF-01.  
  * O usuário preenche os campos e confirma.  
  * O sistema valida os dados conforme VR-01 a VR-05.  
  * O sistema persiste o preset em Local Storage.  
  * O sistema atualiza a lista de presets.  
* Fluxos alternativos:  
  * 4a. Dados inválidos: o sistema exibe mensagens por campo e impede a confirmação.  
  * 3a. Usuário cancela: nenhum dado é persistido.  
* Pós-condições: preset persistido e visível na lista.  
* Critérios de aceite:  
  * Preset criado com todos os campos válidos é exibido na lista.  
  * Preset com dados inválidos não é persistido.  
  * Cancelamento não altera o estado persistido.

### UC02 \- Editar temporizador personalizado

* Ator: estudante.  
* Pré-condições: existir preset cadastrado e não haver sessão ativa baseada nele.  
* Fluxo principal:  
  * O usuário seleciona um preset e aciona edição.  
  * O sistema apresenta o formulário com os valores atuais.  
  * O usuário altera os campos e confirma.  
  * O sistema valida os dados conforme VR-01 a VR-05.  
  * O sistema persiste as alterações.  
* Fluxos alternativos:  
  * 1a. Preset em uso por sessão ativa: a opção de edição é bloqueada com mensagem explicativa (RN-01).  
  * 4a. Dados inválidos: mensagens por campo e confirmação impedida.  
* Pós-condições: preset atualizado em Local Storage.  
* Critérios de aceite:  
  * Edição só é permitida quando não houver sessão ativa baseada no preset.  
  * Alterações são refletidas na lista após confirmação.

### UC03 \- Excluir temporizador personalizado

* Ator: estudante.  
* Pré-condições: existir preset cadastrado e não haver sessão ativa baseada nele.  
* Fluxo principal:  
  * O usuário seleciona um preset e aciona exclusão.  
  * O sistema solicita confirmação explícita.  
  * O usuário confirma.  
  * O sistema remove o preset de Local Storage.  
  * O sistema atualiza a lista.  
* Fluxos alternativos:  
  * 1a. Preset em uso: exclusão bloqueada com mensagem (RN-01).  
  * 3a. Usuário cancela: nada é removido.  
* Pós-condições: preset removido.  
* Critérios de aceite:  
  * Exclusão só ocorre após confirmação (RN-11).  
  * Preset ativo não pode ser excluído (RN-01).

### UC04 \- Iniciar sessão de foco

* Ator: estudante.  
* Pré-condições: existir ao menos um preset cadastrado.  
* Fluxo principal:  
  * O usuário seleciona um preset.  
  * O usuário aciona iniciar.  
  * O sistema cria a sessão ativa com snapshot dos parâmetros do preset (RN-05).  
  * O sistema define a fase inicial como foco e o ciclo como 1\.  
  * O sistema registra timestamp de início e calcula o timestamp de fim da fase.  
  * O sistema persiste a sessão em Local Storage e inicia a contagem regressiva.  
* Pós-condições: sessão ativa em andamento e persistida.  
* Critérios de aceite:  
  * Sessão usa snapshot do preset, imune a edições posteriores.  
  * O estado persistido contém timestamps suficientes para recálculo (UC10).

### UC05 \- Pausar e retomar sessão

* Ator: estudante.  
* Pré-condições: existir sessão ativa em andamento.  
* Fluxo principal (pausar):  
  * O usuário aciona pausar.  
  * O sistema registra o tempo restante da fase e o timestamp dá pausa.  
  * O sistema altera o status da sessão para pausada.  
  * O sistema persiste o novo estado.  
* Fluxo principal (retomar):  
  * O usuário aciona retomar.  
  * O sistema recalcula o fim da fase a partir do momento da retomada.  
  * O sistema altera o status para em andamento.  
  * O sistema persiste o novo estado.  
* Pós-condições: status e timestamps atualizados.  
* Critérios de aceite:  
  * Tempo restante é preservado ao pausar.  
  * Ao retomar, o fim da fase é recalculado a partir do instante da retomada.

### UC06 \- Pular fase

* Ator: estudante.  
* Pré-condições: existir sessão ativa em andamento ou pausada.  
* Fluxo principal:  
  * O usuário aciona pular fase.  
  * O sistema encerra a fase atual sem contabilizá-la como concluída.  
  * O sistema avança para a próxima fase prevista.  
  * O sistema atualiza timestamps e persiste o estado.  
* Fluxos alternativos:  
  * 1a. Se a fase atual for a última antes da conclusão da sessão, a sessão é encerrada.  
* Pós-condições: sessão na próxima fase.  
* Critérios de aceite:  
  * Pular fase de foco não incrementa a contagem de ciclos (RN-03).  
  * Pular fase de pausa não incrementa a contagem de ciclos (RN-03).

### UC07 \- Reiniciar ciclos

* Ator: estudante.  
* Pré-condições: existir sessão ativa em andamento ou pausada.  
* Fluxo principal:  
  * O usuário aciona reiniciar ciclos.  
  * O sistema solicita confirmação.  
  * O usuário confirma.  
  * O sistema zera a contagem de ciclos e retorna ao primeiro ciclo de foco.  
  * O sistema atualiza timestamps e persiste o estado.  
* Pós-condições: sessão reiniciada no primeiro ciclo de foco.  
* Critérios de aceite:  
  * Contagem de ciclos volta a 1\.  
  * Fase atual é foco.

### UC08 \- Encerrar sessão

* Ator: estudante.  
* Pré-condições: existir sessão ativa.  
* Fluxo principal:  
  * O usuário aciona encerrar sessão.  
  * O sistema solicita confirmação.  
  * O usuário confirma.  
  * O sistema remove a sessão ativa de Local Storage.  
  * O sistema libera o preset correspondente para edição e exclusão.  
* Pós-condições: sessão encerrada e removida da persistência.  
* Critérios de aceite:  
  * Após encerramento, o preset volta a ser editável e excluível (RN-01).

### UC09 \- Trocar preset com encerramento automático

* Ator: estudante.  
* Pré-condições: existir sessão ativa.  
* Fluxo principal:  
  * O usuário seleciona outro preset.  
  * O sistema encerra automaticamente a sessão ativa (RN-02).  
  * O sistema inicia nova sessão com o preset selecionado.  
* Pós-condições: nova sessão ativa com o preset escolhido.  
* Critérios de aceite:  
  * Sessão anterior é encerrada sem confirmação adicional, conforme RN-02.  
  * Nova sessão utiliza snapshot do novo preset.

### UC10 \- Retomar sessão automaticamente

* Ator: sistema.  
* Pré-condições: existir sessão ativa persistida em Local Storage.  
* Fluxo principal:  
  * Ao carregar a aplicação, o sistema lê a sessão persistida.  
  * Se o status for “pausada”, o sistema restaura a sessão pausada sem avanço (RN-06).  
  * Se o status for “em andamento”, o sistema compara o timestamp atual com o fim da fase persistida.  
  * Se a fase ainda não venceu, o sistema recalcula o tempo restante e mantém a fase.  
  * Se a fase venceu, o sistema avança sequencialmente pelas fases previstas até encontrar uma fase não vencida ou até a sessão concluir (RN-07, RN-08).  
  * O sistema atualiza o estado “persistida” e apresenta a sessão ao usuário.  
* Fluxos alternativos:  
  * 5a. Todas as fases venceram durante o período fechado: a sessão é marcada como concluída (RN-08).  
* Pós-condições: sessão ativa consistente com o tempo decorrido.  
* Critérios de aceite:  
  * Sessão pausada retorna pausada (RN-06).  
  * Avanço de fases usa timestamps, não contadores em memória (RN-07).  
  * Sessão concluída durante o período fechado é marcada como concluída (RN-08).

### UC11 \- Descartar sessão retomada

* Ator: estudante.  
* Pré-condições: existir sessão ativa retomada automaticamente.  
* Fluxo principal:  
  * O usuário aciona descartar sessão.  
  * O sistema solicita confirmação.  
  * O usuário confirma.  
  * O sistema remove a sessão de Local Storage.  
  * O sistema libera o preset correspondente.  
* Pós-condições: sessão descartada sem contabilização de progresso.  
* Critérios de aceite:  
  * Descarte remove a sessão sem gerar histórico.  
  * Preset volta a ser editável e excluível.

### UC12 \- Criar tarefa

* Ator: estudante.  
* Pré-condições: nenhuma.  
* Fluxo principal:  
  * O usuário aciona criar tarefa no painel lateral.  
    * Interface responsiva pode posicionar o painel em local alternativo.  
  * O sistema apresenta o formulário com título, estado e prioridade.  
  * Os campos de estado e prioridade são preenchidos com valores padrão (RN-12).  
  * O usuário preenche e confirma.  
  * O sistema valida conforme VR-06 a VR-08.  
  * O sistema persiste a tarefa em Local Storage.  
  * O sistema reordena o painel conforme RN-10.  
* Pós-condições: tarefa persistida e visível.  
* Critérios de aceite:  
  * Título vazio impede criação.  
  * Tarefa criada aparece na posição correta de ordenação.

### UC13 \- Editar tarefa

* Ator: estudante.  
* Pré-condições: existir tarefa cadastrada.  
* Fluxo principal:  
  * O usuário seleciona uma tarefa e aciona edição.  
  * O sistema apresenta o formulário com os valores atuais.  
  * O usuário altera e confirma.  
  * O sistema valida conforme VR-06 a VR-08.  
  * O sistema persiste as alterações.  
  * O sistema reordena o painel conforme RN-10.  
* Pós-condições: tarefa atualizada.  
* Critérios de aceite:  
  * Estado e prioridade editáveis.  
  * Reordenação aplicada após edição.

### UC14 \- Excluir tarefa

* Ator: estudante.  
* Pré-condições: existir tarefa cadastrada.  
* Fluxo principal:  
  * O usuário seleciona uma tarefa e aciona exclusão.  
  * O sistema solicita confirmação (RN-11).  
  * O usuário confirma.  
  * O sistema remove a tarefa de Local Storage.  
  * O sistema reordena o painel.  
* Fluxos alternativos:  
  * 3a. Usuário cancela: nada é removido.  
* Pós-condições: tarefa removida.  
* Critérios de aceite:  
  * Exclusão permitida em qualquer estado, sempre com confirmação (RN-09, RN-11).  
  * Exclusão não afeta a sessão do temporizador (RN-09).

### UC15 \- Visualizar painel de tarefas

* Ator: estudante.  
* Pré-condições: nenhuma.  
* Fluxo principal:  
  * O sistema exibe o painel de tarefas à direita do temporizador em desktop.  
  * Em telas menores, o painel é reorganizado para baixo do temporizador.  
  * As tarefas são exibidas na ordem definida em RN-10.  
  * Cada tarefa exibe título, estado e prioridade.  
* Pós-condições: painel visível e consistente com a persistência.  
* Critérios de aceite:  
  * Painel visível ao lado do temporizador em desktop.  
  * Layout responsivo em telas menores.  
  * Ordenação fixa conforme RN-10.

## **9\. Requisitos não funcionais**

* RNF-01 \- Desempenho: a interface deve responder às interações do usuário em até 100 ms em condições normais.  
* RNF-02 \- Persistência: todos os dados de presets, tarefas e sessão ativa devem ser persistidos em Local Storage e restaurados na reabertura.  
* RNF-03 \- Precisão temporal: o recálculo de fases deve usar timestamps absolutos, tolerando imprecisões do navegador sem perda de progresso.  
* RNF-04 \- Usabilidade: a interface deve ser em português, com rótulos claros e mensagens de erro objetivas por campo.  
* RNF-05 \- Responsividade: o layout deve se adaptar a desktops e dispositivos móveis, com o painel de tarefas reorganizado em telas menores.  
* RNF-06 \- Confiabilidade: operações de exclusão devem ser sempre confirmadas; falhas de persistência devem ser reportadas ao usuário.  
* RNF-07 \- Acessibilidade: os controles devem ser acessíveis por teclado e possuir rótulos semânticos.  
* RNF-08 \- Compatibilidade: a aplicação deve funcionar em versões recentes de navegadores modernos com suporte a Local Storage.  
* RNF-09 \- Manutenibilidade: o código deve ser em TypeScript e React, com separação clara entre domínio, persistência e interface.  
* RNF-10 \- Áudio: o alerta sonoro deve ser emitido ao fim de cada fase, respeitando as políticas de reprodução automática do navegador.

## **10\. Restrições técnicas**

* RT-01 \- Stack obrigatória: TypeScript e React.  
* RT-02 \- Persistência exclusivamente local via localStorage.  
* RT-03 \- Aplicação single-user, sem backend, autenticação ou sincronização.  
* RT-04 \- Interface em português, sem seletor de idioma.  
* RT-05 \- Sem notificações do navegador, push ou canais externos de alerta.  
* RT-06 \- Sem filtros de tarefas; ordenação fixa conforme RN-10.

## **11\. Modelo conceitual de dados**

### 11.1 Entidade TemporizadorPersonalizado (preset)

* id: identificador único.  
* nome: texto entre 1 e 40 caracteres.  
* tempoFocoMin: inteiro entre 1 e 120\.  
* tempoPausaCurtaMin: inteiro entre 1 e 60\.  
* ciclosAntesPausaLonga: inteiro entre 1 e 12\.  
* tempoPausaLongaMin: inteiro entre 1 e 60\.  
* criadoEm: timestamp.  
* atualizadoEm: timestamp.

### 11.2 Entidade SessaoAtiva

* id: identificador único.  
* presetId: referência ao preset de origem.  
* snapshotPreset: cópia dos parâmetros do preset no início da sessão.  
* faseAtual: foco, pausaCurta ou pausaLonga.  
* cicloAtual: inteiro a partir de 1\.  
* status: emAndamento, pausada ou concluida.  
* inicioFaseEm: timestamp.  
* fimFasePrevistoEm: timestamp calculado.  
* pausadaEm: timestamp ou nulo.  
* tempoRestanteAoPausarMs: inteiro ou nulo.  
* criadaEm: timestamp.  
* atualizadaEm: timestamp.

### 11.3 Entidade Tarefa

* id: identificador único.  
* titulo: texto entre 1 e 100 caracteres.  
* estado: backlog, aFazer, emExecucao, concluida ou cancelada.  
* prioridade: baixa, media ou alta.  
* criadaEm: timestamp.  
* atualizadaEm: timestamp.

### 11.4 Chaves de persistência

* "pomodoro.presets": lista de presets.  
* "pomodoro.tarefas": lista de tarefas.  
* "pomodoro.sessaoAtiva": sessão ativa ou ausente.

## **12\. Matriz de rastreabilidade**

| Requisito | Casos de uso | Regras de negócio |
| :---- | :---- | :---- |
| RF-01 | UC01 | RN-11, VR-01 a VR-05 |
| RF-02 | UC02 | RN-01, RN-05, RN-11, VR-01 a VR-05 |
| RF-03 | UC03 | RN-01, RN-11 |
| RF-04 | UC01, UC02, UC03, UC04 | \- |
| RF-05 | UC04 | RN-05 |
| RF-06 | UC05 | RN-06 |
| RF-07 | UC05 | RN-06 |
| RF-08 | UC06 | RN-03 |
| RF-09 | UC07 | RN-04 |
| RF-10 | UC08 | RN-01 |
| RF-11 | UC09 | RN-02, RN-05 |
| RF-12 | UC10 | RN-06, RN-07, RN-08 |
| RF-13 | UC11 | \- |
| RF-14 | UC04, UC06, UC07, UC10 | RN-13 |
| RF-15 | UC12 | RN-10, RN-12, VR-06 a VR-08 |
| RF-16 | UC13 | RN-10, VR-06 a VR-08 |
| RF-17 | UC14 | RN-09, RN-11 |
| RF-18 | UC15 | RN-10 |
| RF-19 | UC15 | RN-10 |
| RF-20 | UC03, UC07, UC08, UC11, UC14 | RN-11 |

## **13\. Riscos e decisões abertas**

* R-01 \- Política de autoplay de áudio: navegadores podem bloquear reprodução automática sem interação prévia. Mitigação: emitir o primeiro som após interação do usuário com o botão iniciar, mantendo o contexto de áudio ativo.  
* R-02 \- Precisão de timestamps em segundo plano: navegadores podem suspender timers em abas inativas. Mitigação: usar timestamps absolutos para recálculo, não contadores de intervalo. (RESOLVIDO NESTA VERSÃO)  
* R-03 \- Corrupção ou inconsistência em Local Storage: falhas de gravação parciais podem gerar estados inválidos. Mitigação: validar o estado ao carregar e, em caso de inconsistência, oferecer descarte da sessão.  
* R-04 \- Limite de armazenamento: Local Storage tem limite restrito. Para o escopo atual (presets, tarefas e uma sessão), o risco é baixo. Revisitar caso o escopo cresça.  
* R-05 \- Conclusão de múltiplas fases durante o período fechado: o recálculo pode atravessar vários ciclos. A regra RN-07 e o critério de UC10 definem o comportamento esperado, mas o tempo de execução do recálculo deve ser desprezível.

