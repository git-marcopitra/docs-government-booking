# DOCS GOVERNMENT BOOKING

## Tecnologias

- Firebase;
- Next.js;
- TypeScript;
- Stylin.js/elements.

## Em Construção

### Layout

- No centro do cabeçalho, está localizado o logótipo do sistema;
- No lado direito do cabeçalho, encontra-se o botão "Entrar" ou as informações do utilizador se tiver logado.

### Página inicial

- Abaixo do cabeçalho, no centro da página, há uma ilustração cuidadosamente escolhida para simbolizar a temática do sistema;
- Logo abaixo da ilustração, encontram-se alguns dizeres que dão as boas-vindas aos utilizadores;
- No centro, há um botão destacado denominado "Agendar", que convida o utilizador a iniciar o processo de marcação de um serviço.

### Tela de Login

- A tela de login, que aparece após o utilizador clicar em "Agendar" o layout divide-se em dois blocos principais. À esquerda, encontra-se uma ilustração que simboliza o processo de login;
- À direita da tela, está localizado o formulário de login. Este formulário é simples e direto, composto por dois campos de preenchimento obrigatórios. O primeiro campo destina-se ao número de Bilhete de Identidade, enquanto o segundo campo é reservado para a password;
- Abaixo dos campos, encontra-se o botão "Entrar", que, uma vez pressionado, permite ao utilizador autenticar-se no sistema e prosseguir com o agendamento;
- Logo abaixo do botão de login, está uma opção de cadastro, destinada aos utilizadores que ainda não têm uma conta registada no sistema. Esta opção, apresentada em letras menores, convida o utilizador a realizar o registo de forma discreta, mas visível.

### Tela principal ou Tela 0 do fluxo de agendamento

- Logo abaixo do logótipo e da área de utilizador, no centro da tela, encontramos a barra de navegação com as opções: Agendar (selecionada por padrão e destaca-se visualmente das restantes), minhas marcações, histórico e Perfil;
- Logo abaixo da barra de navegação, aparecem quatro categorias de agendamento, claramente organizadas para facilitar a navegação. As categorias incluem: Documentação Pessoal, Documentação Habitacional, Documentação Automóvel e Documentação Comercial.

### Tela 1 do fluxo de agendamento

- Primeira tela do fluxo de agendamento, que surge após o utilizador clicar na opção "Documentação Pessoal"
- Ao invés das quatro categorias de agendamento exibidas anteriormente, a parte central da tela apresenta agora um menu específico para que o utilizador escolha o tipo de documentação pessoal que deseja tratar. Este menu é simples e claro, permitindo ao utilizador selecionar entre as opções exibidas.
- Exemplo:
  1. Bilhete de Identidade;
  2. Emissão do Passaporte;
  3. Registro Criminal.

### Tela 2 do fluxo de agendamento

- A principal alteração nesta tela está no conteúdo central. À esquerda, há agora um painel informativo que detalha os requisitos necessários para dar continuidade ao processo de emissão do passaporte após o agendamento. Este painel contém uma descrição clara e objetiva sobre os documentos necessários, como o Bilhete de Identidade, fotografias, entre outros, ajudando o utilizador a preparar-se adequadamente;
- À direita, encontra-se uma listagem de instituições em forma de cards, que oferecem atendimento para o serviço de emissão do passaporte;
- Em cada card, há um botão destacado que diz "Agendar aqui", permitindo que o utilizador escolha rapidamente a instituição desejada para realizar o agendamento. Além disso, existe um botão de pin em cada card, que oferece a funcionalidade de afixar essa instituição no topo da lista, facilitando o seu acesso em agendamentos futuros, caso o utilizador tenha preferência por uma instituição específica;
- Acima da listagem de instituições, há ainda uma barra de pesquisa que permite ao
utilizador localizar rapidamente a instituição pretendida.

### Tela 3 do fluxo de agendamento

- À esquerda da tela, encontra-se um painel de visualização que mostra a localização exata da instituição onde o agendamento será realizado. Este painel contém um mapa interativo, permitindo que o utilizador visualize facilmente onde fica a instituição, bem como as rotas de acesso e outros pontos de referência nas proximidades;
- À direita, o utilizador é apresentado a um calendário intuitivo, onde apenas os dias disponíveis para agendamento estão ativados. O utilizador pode selecionar a data desejada para o seu atendimento, assegurando que está ciente das opções disponíveis. Após escolher a data, uma nova seção permite ao utilizador selecionar o horário através de slots de horário disponíveis, que são claramente indicados;
- Assim que o utilizador seleciona a data e a hora, uma mensagem de confirmação aparece na tela, acompanhada de um ícone de “Verificado”, simbolizando que o agendamento foi concluído com sucesso. Esta mensagem é clara e informativa, destacando os detalhes importantes do agendamento, incluindo a data, hora e local da marcação, proporcionando uma visão clara do que foi agendado;
- Por fim, a tela inclui um botão “Concluir”, que permite ao utilizador retornar à página principal do sistema. Este botão é destacado e fácil de localizar, encerrando o fluxo de agendamento de forma fluida e eficaz.

### Tela “Minhas marcações”

- Na parte superior da tela, mantém-se a barra de navegação;
- A listagem de marcações apresenta cada agendamento em formato de linha, onde são incluídos detalhes como a data e a hora do agendamento, que estão destacadas para facilitar a identificação rápida. Também é indicada a natureza do serviço agendado, como Bilhete de Identidade ou Emissão do Passaporte, assim como o nome da instituição onde o atendimento está agendado;
- Para cada marcação, são oferecidas duas opções principais para o utilizador. O primeiro é o botão de "Reagendar", que permite modificar a data e/ou hora do agendamento;
- Ao clicar neste botão, o utilizador é redirecionado para um fluxo semelhante ao processo de agendamento inicial, onde pode selecionar uma nova data e hora, assim como a instituição desejada;
- O segundo é o botão de "Cancelar", que possibilita cancelar uma marcação existente. Ao clicar neste botão, é apresentada uma confirmação para garantir que o utilizador realmente deseja prosseguir com o cancelamento, evitando ações acidentais.

### Tela principal administrativa

- É um Back Office;
- Assim que o utilizador clica em "Entrar" na página inicial.

### Tela serviços

- A tela "Serviços" é uma interface dedicada que apresenta uma listagem clara e organizada de todos os serviços disponíveis no sistema. Assim que o utilizador acede a esta secção, é recebido por uma barra de navegação na parte superior, que mantém o logo e as opções de menu, proporcionando um acesso fácil a outras áreas da aplicação;
- No centro da tela, a listagem exibe cada serviço em formato de cartão ou linha, onde são apresentados detalhes importantes como a duração média do atendimento para cada serviço, permitindo que os utilizadores tenham uma noção do tempo necessário para cada procedimento. Além disso, é indicada a capacidade máxima de atendimento, especificando quantas pessoas podem ser atendidas por vez para cada serviço. Essa informação é crucial para o planeamento e gestão dos atendimentos, especialmente em períodos de maior demanda;
- Abaixo de cada serviço, são disponibilizadas duas opções funcionais. O botão "Editar" permite que o utilizador faça alterações nas configurações do serviço selecionado. Ao clicar neste botão, o utilizador é redirecionado para uma tela onde pode modificar a duração do atendimento, a capacidade de atendimento e outras informações relevantes, garantindo que os serviços estejam sempre actualizados de acordo com as necessidades da instituição. Por outro lado, o botão "Remover" possibilita ao utilizador eliminar um serviço do sistema. Ao clicar neste botão, o sistema apresenta uma confirmação para evitar cancelamentos acidentais, assegurando que o utilizador realmente pretende proceder com a remoção;
- Esta tela é projectada para ser intuitiva e funcional, garantindo que os utilizadores possam facilmente visualizar e gerir os serviços disponíveis. A disposição clara das informações e a facilidade de acesso às opções de edição e remoção asseguram uma experiência de utilizador eficiente, permitindo que os administradores mantenham o sistema sempre actualizado e adaptado às suas necessidades operacionais.
