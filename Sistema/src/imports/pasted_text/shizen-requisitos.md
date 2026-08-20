1	INTRODUÇÃO	7
2	IDENTIFICAÇÃO DO PROJETO	8
3	OBJETIVO DO SISTEMA	9
4	BENEFÍCIOS ESPERADOS	10
5	ESCOPO INICIAL DO PROJETO	11
6	PREMISSAS	12
7	RISCOS	13
8	MEMBROS DA EQUIPE	14
9	CRONOGRAMA	15
10	ATORES DO SISTEMA	16
10.1	Administradora / Proprietária	16
10.1.1	Necessidades Essenciais	16
10.1.2	Funcionalidades Disponíveis à Empreendedora	16
10.2	Gerente Financeiro	17
10.2.1	Necessidades essenciais do Gerente Financeiro:	17
10.2.2	Funcionalidades disponíveis ao Gerente Financeiro:	18
10.3	Analista de Cadastro	18
10.3.1	Necessidades essenciais do Analista de Cadastro:	18
10.3.2	Funcionalidades disponíveis ao Analista de Cadastro:	18
10.4	Estoquista	19
10.4.1	Necessidades essenciais do Estoquista:	19
10.4.2	Funcionalidades disponíveis ao Estoquista:	19
10.5	Vendedor	19
10.5.1	Necessidades essenciais do Vendedor:	20
10.5.2	Funcionalidades disponíveis ao Vendedor:	20
11	DOCUMENTO DE REQUISITOS	21
11.1	Requisitos Funcionais	21
11.2	Requisitos Não-Funcionais	23
12	REGRAS DE NEGÓCIO	25
12.1	RN01 – Apuração de Custos	25
12.2	RN02 – Margem Mínima de Lucro	25
12.3	RN03 – Padronização de Unidades de Medida	25
12.4	RN04 – Revisão Mensal de Preços de Compra	25
12.5	RN05 – Cadastro Obrigatório de Clientes	26
12.6	RN06 – Primeira Compra Vinculada ao Cadastro	26
12.7	RN07 – Conclusão do Pedido mediante Pagamento	26
12.8	RN08 – Notificação de Pagamentos Pendentes	26
12.9	RN09 – Alertas de Produtos Próximos do Vencimento	27
12.10	RN10 – Priorização de Fornecedores Certificados	27
12.11	RN11 – Auditoria de Movimentação de Estoque	27
13	DIAGRAMA DE ATIVIDADES	28
14	Diagrama EAP	29
15	Diagrama de Casos de Uso	30
16	ESPECIFICAÇÃO DOS CASOS DE USO	31
16.1	Módulo de Login	31
16.1.1	UC01 – Realizar Login	31
16.1.2	UC02 – Recuperar Senha	32
16.1.3	UC03 – Encerrar Sessão	32
16.2	Módulo de Vendas	33
16.2.1	UC04 – Realizar Vendas	33
16.2.2	UC05 – Verificar Estoque Inserção das Especificações de Caso de Uso	34
16.2.3	UC06 – Calcular Preço do Produto	35
16.3	Módulo Financeiro	35
16.3.1	UC07 – Gerar Relatórios Financeiros	35
16.3.2	UC08 – Acompanhar Indicadores de Desempenho Econômico	36
16.3.3	UC09 – Controlar Pagamentos Pendentes	37
16.4	Módulo de Cadastro	37
16.4.1	UC10 – Atualizar Tabelas de Produtos	37
16.4.2	UC11 – Cadastrar Produtos	38
16.4.3	UC12 – Cadastrar Clientes	39
16.5	Módulo de Compras e Estoque	39
16.5.1	UC13 – Emitir Pedido de Compra	39
16.5.2	UC14 – Comprar Produtos	40
16.5.3	UC15 – Descartar Produtos Vencidos	40
16.5.4	UC16 – Controlar Entrada e Saída de Mercadorias	41
17	REFERÊNCIAS	43
 
1	INTRODUÇÃO

Este documento tem como objetivo apresentar o projeto Shizen Orgânicos, uma proposta de desenvolvimento de um sistema digital voltado ao gerenciamento de pedidos, controle de estoque, precificação de produtos e organização financeira de um estabelecimento especializado em alimentos e produtos orgânicos.

Aqui são definidos o objetivo geral do projeto, os beneficios esperados, o escopo inicial, as premissas, os riscos identificados, bem como informações sobre a equipe envolvida e o cronograma preliminar.





















2	IDENTIFICAÇÃO DO PROJETO

Item	Descrição
Pedido	Plataforma para Gerenciamento de Pedidos, Estoque e Venda otimizada.
Requisitante	Shizen Orgânicos
Gerente de Projeto	Vinicius Kenzo Tomo


 
3	OBJETIVO DO SISTEMA

•	Desenvolver um sistema web de gestão para a Shizen Orgânicos, voltado para melhorar o controle de produtos, vendas e estoque da empresa.

•	Automatizar o cálculo de preços dos produtos, considerando custos de compra, produção e margem de lucro definida pelo negócio.

•	Centralizar as informações da empresa em um único sistema, permitindo o cadastro e gerenciamento de produtos, pedidos, clientes e fornecedores.

•	Apoiar a tomada de decisões da empreendedora, oferecendo dados mais organizados sobre custos, vendas e lucratividade.

•	Reduzir processos manuais e erros operacionais, substituindo planilhas e registros em cadernos por um sistema digital integrado.

 
4	BENEFÍCIOS ESPERADOS

A Shizen Orgânicos tem como objetivo primário a utilização da tecnologia para a construção de um sistema de gestão de vendas, pedidos e estoque mais eficiente. Espera-se que o sistema possa:

•	Maior organização e controle das informações, com registro estruturado de produtos, pedidos, estoque e dados financeiros.

•	Precisão na precificação dos produtos, evitando cálculos manuais e garantindo margens de lucro mais consistentes.

•	Redução de erros e retrabalho, já que os processos de cadastro, cálculo e atualização de dados serão automatizados.

•	Melhoria na gestão do estoque, permitindo acompanhar entradas, saídas e validade dos produtos com mais eficiência.

•	Apoio ao crescimento do negócio, facilitando o planejamento estratégico e aumentando a competitividade da empresa no mercado de produtos orgânicos.
 

5	ESCOPO INICIAL DO PROJETO

Desenvolver um sistema de gestão interna para a Shizen Orgânicos que automatize o controle de estoque, venda, e a precificação, tornando os processos mais ágeis e precisos. O sistema deve permitir o cadastro de produtos, o registro de entradas e saídas com alertas de validade, o cálculo automático do preço de venda, o acompanhamento de pedidos e vendas, e a geração de relatórios de custos e estoque, priorizando uma experiência favorável e intuitiva que se adapte à rotina da loja.

 
6	PREMISSAS
•	Tecnologia Acessível
O sistema será desenvolvido como aplicação web responsiva, garantindo acesso por qualquer dispositivo com navegador atualizado, inclusive equipamentos mais simples, sem necessidade de instalação.

•	Precificação Automática e Rentável
Os preços de venda serão calculados automaticamente com base em regras de negócio definidas, como margem mínima de lucro de 35%, eliminando os cálculos manuais empíricos.

•	Interface Intuitiva para Usuários Leigos
A interface será simples, com linguagem clara e fluxos reduzidos de cliques, permitindo que a proprietária e seus auxiliares utilizem o sistema sem dificuldades, mesmo com pouca experiência em tecnologia.

•	Autonomia Operacional da Equipe
O sistema possibilitará que a própria equipe realize cadastros, atualizações de estoque e registros de venda de forma autônoma, reduzindo a dependência de suporte técnico externo.

•	Padronização e Consistência dos Dados
Todos os produtos e ingredientes terão unidades de medida padronizadas, assegurando a integridade dos cálculos de custo, controle de estoque e emissão de relatórios.

 

7	RISCOS

•	Integridade dos Dados na Migração 
Durante a migração dos dados atuais para o novo sistema, há risco de perda ou inconsistência de informações críticas, como cadastro de clientes e histórico de vendas, especialmente em falhas de conexão.

•	Dependência de Fornecedores Locais 
A variação na disponibilidade e nos preços dos produtos orgânicos fornecidos localmente pode exigir atualizações constantes no sistema, demandando disciplina da equipe para manter os registros precisos e atualizados.

•	Segurança da Informação 
É necessário garantir que os dados financeiros e cadastrais dos clientes sejam armazenados com confidencialidade, evitando acessos não autorizados e assegurando conformidade com os requisitos não funcionais de segurança.


 
8	MEMBROS DA EQUIPE

Nome	Cargo
Eduardo França da Silva Filho	Scrum Master
Giovanna Goor	Analista de qualidade de Software
Isabella Monagatti Fujita	Designer de Projetos
Leonardo Hideki Nakayama Silva	Desenvolvedor de Projetos
Vinicius Kenzo Tomo	Gerente de Projetos

 
9	CRONOGRAMA

Item	Início	Fim
Definição do problema e análise do negócio	06/03/2026	13/03/2026
Definição da solução proposta	06/03/2026	13/03/2026
Levantamento de requisitos do sistema	13/03/2026	20/03/2026
Documento de Definição de Atores	13/03/2026	20/03/2026
Definição das Regras de Negócio	15/03/2026	20/03/2026
Elaboração do diagrama de Atividades	30/03/2026	09/04/2026
Elaboração do Diagrama EAP	17/04/2026	21/04/2026
Diagramas de Casos de Uso	17/04/2026	21/04/2026
Especificação dos Casos de Uso	11/05/2026	17/05/2026
Preparação da apresentação do projeto		
Documento de Designs das Telas do Sistema		
Diagrama de Classe		



 
10	ATORES DO SISTEMA

Os atores representam os usuários ou entidades que interagem diretamente com o sistema de gestão da Shizen Orgânicos.

10.1	Administradora / Proprietária

O Administradora é o usuário responsável por operar o sistema Shizen Orgânico. Ela possui acesso completo às funcionalidades e é responsável pelo gerenciamento do Cadastro de Produtos, Estoque, Clientes, Pedidos, Pagamentos e demais configurações essenciais do sistema.

10.1.1	Necessidades Essenciais

•	Interface intuitiva e navegação simplificada;

•	Organização por áreas funcionais: produtos, estoque, pedidos, pagamentos, relatórios;

•	Agilidade em cadastros, consultas e atualizações;

•	Visibilidade clara do estoque, vendas e finanças.

10.1.2	Funcionalidades Disponíveis à Empreendedora

•	Gerenciar Produtos: cadastro, edição, exclusão de itens com informações completas;

•	Controlar Estoque: monitorar quantidades, validades, custos e alertas de reposição;

•	Gerenciar Pedidos: registro, personalização, finalização e acompanhamento;

•	Acompanhar Relatórios: vendas, custos, consumo e movimentações por período;

•	Configurar o Sistema: margem de lucro, limites de estoque, formas de pagamento;

•	Consultar Informações Financeiras: recebimentos por método e intervalo de tempo;

•	Gerenciar Clientes: cadastro, histórico de compras e preferências;

•	Emitir e adquirir produtos: Poder emitir e adquirir produtos de acordo com a necessidade da empresa.

10.2	Gerente Financeiro

O Gerente Financeiro é responsável pela supervisão das informações financeiras do sistema, realizando a análise de custos, geração de relatórios de compras e definição dos preços de venda dos produtos. Também acompanha a rentabilidade do negócio e auxilia na tomada de decisões estratégicas relacionadas à gestão financeira.

10.2.1	Necessidades essenciais do Gerente Financeiro:

•	Interface que apresente indicadores financeiros claros e atualizados;

•	Facilidade para analisar custos, margens e rentabilidade;

•	Acesso rápido a relatórios gerenciais e históricos.

10.2.2	Funcionalidades disponíveis ao Gerente Financeiro:

•	Analisar custos de produção e definir preços de venda com base em margem de lucro;

•	Gerar relatórios financeiros, de compras e de rentabilidade por período;

•	Acompanhar indicadores de desempenho econômico do negócio.

10.3	Analista de Cadastro

O Analista de Cadastro é responsável pela manutenção das informações de produtos no sistema. Suas atividades incluem o cadastro de novos itens, atualização de preços e unidades de medida, além da organização e padronização das tabelas e descrições de produtos

10.3.1	Necessidades essenciais do Analista de Cadastro:

•	Interface organizada por categorias para facilitar a manutenção de produtos;

•	Agilidade no cadastro e atualização de informações;

•	Visualização clara das tabelas e descrições.

10.3.2	Funcionalidades disponíveis ao Analista de Cadastro:

Cadastrar, editar e excluir produtos;

Atualizar preços, unidades de medida e descrições;

Organizar e padronizar tabelas e categorias de produtos.

10.4	Estoquista

O Estoquista é responsável pelo controle de entrada e saída de produtos no estoque, registrando mercadorias recebidas, atualizando quantidades disponíveis e acompanhando prazos de validade. Também registra perdas por vencimento e informa a necessidade de reposição de itens.

10.4.1	Necessidades essenciais do Estoquista:

•	Visibilidade imediata das quantidades em estoque e prazos de validade;

•	Alertas automáticos sobre produtos próximos ao vencimento;

•	Facilidade para registrar entradas, saídas e descartes.

10.4.2	Funcionalidades disponíveis ao Estoquista:

•	Controlar entrada e saída de mercadorias;

•	Registrar validade e receber alertas automáticos de vencimento;


•	Dar baixa em produtos vencidos e notificar necessidade de reposição.

•	Poder emitir e adquirir produtos de acordo com a necessidade da empresa.

10.5	Vendedor

O Vendedor é responsável pelo atendimento ao cliente e registro das vendas no sistema. Suas funções incluem cadastrar pedidos, informar valores e formas de pagamento, atualizar o status das vendas e consultar a disponibilidade de produtos no estoque.

10.5.1	Necessidades essenciais do Vendedor:

•	Interface rápida e intuitiva para registro de pedidos;


•	Consulta ágil da disponibilidade de produtos no estoque;

•	Facilidade para registrar formas de pagamento e finalizar vendas.

10.5.2	Funcionalidades disponíveis ao Vendedor:

•	Cadastrar clientes;

•	Registrar pedidos e vendas presenciais ou online;

•	Consultar disponibilidade de produtos em tempo real;

•	Atualizar status do pedido e registrar formas de pagamento.

 
11	DOCUMENTO DE REQUISITOS

11.1	Requisitos Funcionais

Código	Nome Abreviado	Descrição	Obrigatório ou
Desejável
RF001	Autenticação de usuário	O sistema deve permitir que a empreendedora e funcionários acessem sua conta mediante inserção de email e senha válidos.	Obrigatório
RF002	Validar Credenciais
	O sistema deve validar se o e-mail e a senha informados correspondem a um usuário cadastrado.	Obrigatório
RF003	Exibir Mensagem de Erro	O sistema deve informar quando o usuário inserir e-mail ou senha inválidos.	Obrigatório
RF004	Recuperação de senha	O sistema deve oferecer uma funcionalidade recuperação de senha, em caso de esquecimento.	Obrigatório
RF005	Encerrar Sessão	O sistema deve permitir que o usuário realize logout do sistema.	Obrigatório
RF006	Controlar Funcionalidades por ator	O sistema deve restringir funcionalidades de acordo com o perfil do usuário (Administrador, Vendedor, Estoquista, Gerente Financeiro e Analista de Cadastro).	Obrigatório
RF007	Bloquear Tentativas Inválidas	O sistema deve bloquear temporariamente o acesso após múltiplas tentativas inválidas consecutivas.	Obrigatório
RF008	Gerenciamento de clientes	O sistema deve permitir o cadastro, consulta e atualização de dados dos clientes da empresa.	Obrigatório
RF009	Controle financeiro	O sistema deve oferecer recursos para o controle de receitas, despesas e saldo financeiro geral.	Obrigatório
RF010	Registro de pedidos	O sistema deve possibilitar o registro, consulta e gerenciamento dos pedidos realizados por clientes.	Obrigatório
RF011	CRUD de Produto	O sistema deve permitir a criação, visualização, edição e exclusão de produtos, armazenando informações como nome, categoria, preço e unidade e/ou peso.	Obrigatório
RF012	CRUD de Matéria prima	O sistema deve permitir o cadastro, visualização, edição e exclusão de matérias-primas, informando nome, custo por unidade/peso e fornecedor. O estoque deve ser atualizado automaticamente conforme entrada e saída de produtos.	Obrigatório
RF013	Calcular Preço do Produto	O sistema deve calcular automaticamente o preço do produto e sugerir um preço de venda com base na unidade de medida.	Obrigatório
RF014	Personalização do Produto	O sistema deve permitir que o cliente insira uma nota de personalização no pedido, especificando detalhes sobre como deseja o produto (ex.: tipo de embalagem, substituições, observações sobre ingredientes).	Obrigatório
RF015	Atualizar Preço de Produto	O sistema deve permitir a atualização de preços dos produtos, de forma manual ou via integração com tabelas de mercado. Também deve possibilitar ajustar preços conforme promoções ou atualizações de fornecedores.	Obrigatório
RF016	Gerar Relatórios de Custos	O sistema deve gerar relatórios de custos dos produtos e comparar com os preços de venda para análise de lucratividade.	Obrigatório
RF017	Controlar entrada e saída de mercadorias	O sistema deve permitir o registro e acompanhamento da entrada e saída de mercadorias no estoque.	Obrigatório

11.2	Requisitos Não-Funcionais

Categoria Principal	Subcategoria	RNF	Descrição
Confiabilidade (Reliability)	Disponibilidade	RNF01	O sistema deve estar disponível 24 horas por dia e 7 dias por semana, exceto em períodos ne manutenção.
	Precificação	RNF02	Os cálculos de custo, margem de lucro e preço final devem seguir fórmulas definidas com precisão, sem arredondamentos indevidos ou perdas de dados.
	Tratamento de erros	RNF03	O sistema deve detectar e tratar erros comuns (ex.: campos vazios, dados inválidos) sem travar ou apresentar comportamentos inesperados.
	Mensagens de erro	RNF04	Deve exibir mensagens de erro claras e amigáveis ao usuário, explicando o que ocorreu e como corrigir.
	Consistência dos dados	RNF05	As informações salvas (pedidos, pesos, precificações anteriores) devem permanecer íntegras mesmo após o fechamento inesperado do sistema ou interrupção da conexão.
	Tolerância a Falhas	RNF06	O sistema deve continuar operando de forma segura mesmo em casos de falhas parciais, evitando perda de dados de vendas, estoque ou informações financeiras.
Usabilidade (Usability)	Operabilidade	RNF07	O sistema deve possuir uma interface simples, intuitiva e acessível, com linguagem voltada para usuários leigos em tecnologia.
	Clareza de linguagem	RNF08	Os termos técnicos devem ser evitados ou explicados com exemplos práticos do dia a dia da loja.
	Facilidade de uso	RNF09	O fluxo de uso deve exigir o mínimo de cliques possíveis para realizar ações básicas, como registrar vendas ou atualizar o estoque.
Eficiência de desempenho (Performance Efficiency)	Capacidade de resposta	RNF10	O tempo de resposta para cálculos e exibição de resultados não deve exceder 2 segundos.
Segurança (Security)	Confidencialidade	RNF11	Dados financeiros e pessoais só devem ser acessíveis pela administradora da loja.
	Proteção de dados	RNF12	O sistema não deve compartilhar dados com terceiros sem consentimento explícito.
Portabilidade (Portability)	Adaptabilidade	RNF13	O sistema deve ser projetado para rodar em múltiplas plataformas (web e aplicações locais).
	Manutenibilidade	RNF14	A arquitetura deve permitir fácil manutenção e possíveis migrações tecnológicas futuras.


 
12	REGRAS DE NEGÓCIO

12.1	RN01 – Apuração de Custos

Todo produto comercializado pela Shizen Orgânicos deve ter o custo de produção e aquisição apurado com base em critérios consistentes de precificação, considerando fornecedores, transporte, mão de obra e despesas operacionais.

Implementado por: RF011 (CRUD de Produto), RF012 (CRUD de Matéria-prima), RF013 (Calcular preço do produto), RF016 (Gerar relatórios de custos)

Apoiado por: RNF04 (Mensagens de erro), RNF05 (Consistência dos dados), RNF06 (Tolerância a falhas), RNF09 (Facilidade de uso)

12.2	RN02 – Margem Mínima de Lucro

A loja deve manter uma margem mínima de lucro de 35% sobre o custo total de cada produto orgânico.

Implementado por: RF009 (Controle financeiro), RF011 (CRUD de Produto), RF013 (Calcular preço do produto), RF016 (Gerar relatórios de custos)

Apoiado por: RNF02 (Precificação), RNF05 (Consistência dos dados), RNF06 (Tolerância a falhas)

12.3	RN03 – Padronização de Unidades de Medida

A padronização das unidades de medida (gramas e unidades) é obrigatória em todo o sistema para garantir a consistência nos cálculos e no controle de estoque.

Implementado por: RF011 (CRUD de Produto), RF012 (CRUD de Matéria-prima), RF013 (Calcular preço do produto)

Apoiado por: RNF07 (Operabilidade), RNF08 (Clareza de linguagem), RNF09 (Facilidade de uso)

12.4	RN04 – Revisão Mensal de Preços de Compra

Os preços de compra dos produtos e insumos devem ser revisados mensalmente, garantindo atualização conforme variações de mercado e fornecedores.

Implementado por: RF011 (CRUD de Produto), RF012 (CRUD de Matéria-prima), RF015 (Atualizar preço de produto), RF016 (Gerar relatórios de custos)

Apoiado por: RNF01 (Disponibilidade), RNF05 (Consistência dos dados), RNF06 (Tolerância a falhas)

12.5	RN05 – Cadastro Obrigatório de Clientes

Para cadastrar um cliente, é obrigatória a inserção de nome, telefone e e-mail para controle e comunicação.

Implementado por: RF008 (Gerenciamento de clientes), RF010 (Registro de pedidos)

Apoiado por: RNF05 (Consistência dos dados), RNF07 (Operabilidade), RNF08 (Clareza de linguagem)

12.6	RN06 – Primeira Compra Vinculada ao Cadastro

A primeira inclusão de um cliente deve estar vinculada a um pedido de compra, garantindo o registro de histórico de consumo.

Implementado por: RF008 (Gerenciamento de clientes), RF010 (Registro de pedidos)

Apoiado por: RNF02 (Precificação), RNF05 (Consistência dos dados), RNF06 (Tolerância a falhas)

12.7	RN07 – Conclusão do Pedido mediante Pagamento

Um pedido será considerado concluído apenas após a confirmação de pagamento ou liberação manual pela empreendedora mediante código de autorização.

Implementado por: RF009 (Controle financeiro), RF010 (Registro de pedidos)

Apoiado por: RNF02 (Precificação), RNF05 (Consistência dos dados), RNF06 (Tolerância a falhas)

12.8	RN08 – Notificação de Pagamentos Pendentes

O sistema deve notificar a empreendedora automaticamente sobre clientes com pagamentos pendentes a cada 15 dias.

Implementado por: RF009 (Controle financeiro)

Apoiado por: RNF01 (Disponibilidade), RNF05 (Consistência dos dados), RNF07 (Operabilidade)

12.9	RN09 – Alertas de Produtos Próximos do Vencimento

Produtos próximos do vencimento devem gerar alertas automáticos, permitindo ações como descontos ou doação antes do prazo de validade.

Implementado por: RF012 (CRUD de Matéria-prima)

Apoiado por: RNF01 (Disponibilidade), RNF07 (Operabilidade), RNF09 (Facilidade de uso)

12.10	RN10 – Priorização de Fornecedores Certificados

A Shizen Orgânicos deve priorizar fornecedores certificados e produtos com selo orgânico reconhecido, garantindo conformidade com normas ambientais e de qualidade.

Implementado por: RF011 (CRUD de Produto), RF012 (CRUD de Matéria-prima)

Apoiado por: RNF02 (Precificação), RNF05 (Consistência dos dados), RNF06 (Tolerância a falhas)

12.11	RN11 – Auditoria de Movimentação de Estoque

Toda entrada e saída de mercadorias deve registrar usuário, data, horário e quantidade movimentada.

Implementado por: RF017 (Controlar entrada e saída de mercadorias)

Apoiado por: RNF05 (Consistência dos dados), RNF06 (Tolerância a falhas), RNF11 (Confidencialidade)














13	DIAGRAMA DE ATIVIDADES

 



















14	DIAGRAMA EAP

 

Link: https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=EAP.drawio&dark=auto#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D11jMLagCCtb2bfWFCR_r-dzg7EenjNDRW%26export%3Ddownload#%7B%22pageId%22%3A%223evGHLkjT7XFUqER0_F6%22%7D
15	DIAGRAMA DE CASOS DE USO

 

 
16	ESPECIFICAÇÃO DOS CASOS DE USO

16.1	Módulo de Login

16.1.1	UC01 – Realizar Login

•	Introdução: Permite que usuários autenticados acessem o sistema utilizando e-mail e senha cadastrados.
•	Requisitos Relacionados: RF001, RF002, RF003, RF006, RF007
•	Pré-Condições: O usuário deve possuir cadastro ativo no sistema.
•	Pós-Condições: Usuário autenticado e direcionado ao módulo correspondente ao seu perfil.

Cenários:

FB – Realizar Login
1.	O usuário acessa a tela de login. 
2.	O sistema solicita e-mail e senha. 
3.	O usuário informa suas credenciais de acesso (RF001). 
4.	O sistema valida os dados informados e verifica permissões do usuário (RF002, RF006). [FA01 – Senha inválida] [FA02 – Usuário não cadastrado] 
5.	O sistema autentica o usuário e libera acesso às funcionalidades permitidas conforme perfil cadastrado (RF006). 
6.	Fim do caso de uso. 
FA01 – Senha inválida
1.	O sistema informa que a senha digitada está incorreta (RF003, RNF04). 
FA02 – Usuário não cadastrado
1.	O sistema informa que não existe usuário cadastrado com o e-mail informado (RF002, RNF04). 
FA03 – Usuário bloqueado
1.	O sistema informa que o acesso foi temporariamente bloqueado após múltiplas tentativas inválidas consecutivas (RF007, RNF06). 
________________________________________
16.1.2	UC02 – Recuperar Senha

•	Introdução: Permite que o usuário recupere o acesso à conta em caso de esquecimento da senha.
•	Requisitos Relacionados: RF004
•	Pré-Condições: O usuário deve possuir um e-mail cadastrado no sistema.
•	Pós-Condições: Nova senha cadastrada e acesso liberado ao usuário.

Cenários:

FB – Recuperar Senha
1.	O usuário acessa a funcionalidade “Esqueci minha senha”. 
2.	O sistema solicita o e-mail cadastrado para recuperação da conta. 
3.	O usuário informa o e-mail de recuperação (RF004). 
4.	O sistema valida se o e-mail informado pertence a um usuário cadastrado. [FA01 – E-mail não cadastrado] 
5.	O sistema envia um código ou link de recuperação para o e-mail do usuário (RF004). 
6.	O usuário acessa o link ou informa o código recebido. 
7.	O sistema solicita o cadastro de uma nova senha. 
8.	O usuário informa e confirma a nova senha. 
9.	O sistema atualiza a senha do usuário no banco de dados (RF004, RNF05). 
10.	Fim do caso de uso. 
FA01 – E-mail não cadastrado
1.	O sistema informa que o e-mail digitado não está cadastrado no sistema (RF004, RNF04). 

16.1.3	UC03 – Encerrar Sessão

•	Introdução: Permite que o usuário encerre sua sessão de acesso ao sistema com segurança.
•	Requisitos Relacionados: RF005
•	Pré-Condições: O usuário deve estar autenticado no sistema.
•	Pós-Condições: Sessão encerrada e acesso ao sistema finalizado.

Cenários:

FB – Encerrar Sessão
1.	O usuário acessa a opção “Sair” do sistema. 
2.	O sistema solicita confirmação de encerramento da sessão. 
3.	O usuário confirma o encerramento da sessão (RF005). 
4.	O sistema encerra a sessão ativa e remove os dados temporários de autenticação (RF005). 
5.	O sistema redireciona o usuário para a tela de login. 
6.	Fim do caso de uso. 
FA01 – Sessão expirada
1.	O sistema informa que a sessão foi encerrada automaticamente por tempo de inatividade.

16.2	Módulo de Vendas

16.2.1	UC04 – Realizar Vendas

•	Introdução: Permite que o vendedor registre vendas presenciais ou online, cadastre clientes, consulte produtos disponíveis e finalize pedidos.
•	Requisitos Relacionados: RF008, RF009, RF010, RF013, RF014
•	Pré-Condições: O vendedor deve estar autenticado no sistema.
•	Pós-Condições: Pedido registrado no sistema e vinculado ao cliente.

Cenários:

FB – Realizar Vendas
1.	O vendedor acessa a funcionalidade “Realizar Vendas”. 
2.	O sistema exibe a tela de novo pedido. 
3.	O vendedor informa os dados do cliente ou realiza um novo cadastro com nome, telefone e e-mail obrigatórios (RF008, RN05). [FA01 – Cliente já cadastrado] 
4.	O vendedor adiciona produtos ao pedido e consulta a disponibilidade no estoque (RF010). [FA02 – Produto indisponível] 
5.	O sistema calcula automaticamente o valor total do pedido considerando os preços atualizados e a margem mínima de lucro definida (RF013, RN02). 
6.	O vendedor adiciona observações de personalização do pedido (RF014), informa a forma de pagamento e finaliza a venda. 
7.	O sistema registra o pedido com status “Pendente de Pagamento” até confirmação financeira (RF009, RN07). 
8.	Fim do caso de uso. 
FA01 – Cliente já cadastrado
1.	O vendedor localiza um cliente previamente cadastrado no sistema (RF008). 
FA02 – Produto indisponível
1.	O sistema informa que o produto não possui quantidade suficiente disponível em estoque (RF012, RN09).

16.2.2	UC05 – Verificar Estoque

•	Introdução: Permite que o vendedor e o estoquista consultem a quantidade disponível de produtos e recebam alertas de validade.
•	Requisitos Relacionados: RF012, RF018
•	Pré-Condições: O usuário deve estar autenticado no sistema.
•	Pós-Condições: O sistema exibe informações atualizadas sobre estoque e validade dos produtos.

Cenários:

FB – Verificar Estoque
1.	O usuário acessa a funcionalidade “Consultar Estoque”. 
2.	O usuário pesquisa um produto por nome, categoria ou código. 
3.	O sistema exibe quantidade disponível, unidade de medida e validade do produto (RF012). 
4.	O sistema verifica produtos próximos do vencimento e exibe alertas automáticos (RN09). [FA01 – Produto não encontrado] 
5.	Fim do caso de uso. 
FA01 – Produto não encontrado
1.	O sistema informa que não existem produtos cadastrados com os dados informados (RF012, RNF04). 

16.2.3	UC06 – Calcular Preço do Produto

•	Introdução: Permite calcular automaticamente o preço de venda dos produtos com base nos custos cadastrados e na margem mínima de lucro.
•	Requisitos Relacionados: RF013
•	Pré-Condições: Os custos do produto devem estar cadastrados no sistema.
•	Pós-Condições: O sistema exibe o preço sugerido para venda.

Cenários:

FB – Calcular Preço do Produto
1.	O sistema recebe os custos de compra, transporte, produção e despesas operacionais do produto (RN01). 
2.	O sistema aplica automaticamente a margem mínima de lucro de 35% (RN02). 
3.	O sistema verifica a padronização das unidades de medida utilizadas (RN03). 
4.	O sistema calcula o preço final do produto (RF013). 
5.	O sistema exibe o valor sugerido de venda. 
6.	Fim do caso de uso. 

16.3	Módulo Financeiro

16.3.1	UC07 – Gerar Relatórios Financeiros

•	Introdução: Permite que o gerente financeiro gere relatórios financeiros, de compras, custos e lucratividade.
•	Requisitos Relacionados: RF009, RF016
•	Pré-Condições: O gerente financeiro deve estar autenticado no sistema.
•	Pós-Condições: Relatórios financeiros gerados no sistema.

Cenários:

FB – Gerar Relatórios Financeiros
1.	O gerente financeiro acessa o módulo de relatórios.
2.	Seleciona o período desejado.
3.	O sistema reúne informações de receitas, despesas, vendas e custos (RF009).
4.	O sistema calcula a lucratividade dos produtos (RF016, RN02).
5.	O sistema exibe os relatórios financeiros para consulta e análise.
6.	Fim do caso de uso.
FA01 – Período sem movimentações
1.	O sistema informa que não existem dados financeiros registrados no período selecionado (RF016, RNF04).

16.3.2	UC08 – Acompanhar Indicadores de Desempenho Econômico

•	Introdução: Permite que o gerente financeiro acompanhe indicadores financeiros e econômicos da Shizen Orgânicos para auxiliar na tomada de decisões.
•	Requisitos Relacionados: RF009, RF016
•	Pré-Condições: O gerente financeiro deve estar autenticado no sistema.
•	Pós-Condições: Indicadores econômicos exibidos para análise.

Cenários:

FB – Acompanhar Indicadores de Desempenho Econômico
1.	O gerente financeiro acessa a funcionalidade “Indicadores Econômicos”.
2.	O sistema reúne informações de vendas, estoque, receitas, despesas e custos (RF009).
3.	O sistema calcula automaticamente indicadores econômicos do negócio (RF016).
4.	O sistema exibe indicadores como faturamento, margem de lucro, custo operacional, produtos mais vendidos e lucratividade.
5.	O gerente financeiro consulta os dados para apoiar decisões estratégicas da empresa.
6.	Fim do caso de uso.
FA01 – Período sem movimentações
1.	O sistema informa que não existem dados financeiros registrados no período selecionado (RF016, RNF04).

16.3.3	UC09 – Controlar Pagamentos Pendentes

•	Introdução: Permite que o gerente financeiro acompanhe pedidos pendentes e pagamentos em atraso.
•	Requisitos Relacionados: RF009, RF010
•	Pré-Condições: O gerente financeiro deve estar autenticado no sistema.
•	Pós-Condições: Clientes inadimplentes identificados e notificados.

Cenários:

FB – Controlar Pagamentos Pendentes
1.	O gerente financeiro acessa a funcionalidade “Pagamentos Pendentes”.
2.	O sistema consulta pedidos sem confirmação de pagamento (RF010).
3.	O sistema identifica pagamentos pendentes há mais de 15 dias (RN08).
4.	O sistema gera notificações automáticas para acompanhamento (RF009).
5.	Fim do caso de uso.

16.4	Módulo de Cadastro

16.4.1	UC10 – Atualizar Tabelas de Produtos

•	Introdução: Permite que o analista de cadastro atualize informações de produtos e matérias-primas.
•	Requisitos Relacionados: RF011, RF012, RF015
•	Pré-Condições: O analista deve estar autenticado no sistema.
•	Pós-Condições: Informações atualizadas no sistema.

Cenários:

FB – Atualizar Tabelas de Produtos
1.	O analista acessa a área de gerenciamento de produtos.
2.	Seleciona um produto previamente cadastrado.
3.	Atualiza preço, descrição, categoria, unidade de medida e fornecedor (RF011, RF015).
4.	O sistema valida as informações conforme padronização das unidades (RN03).
5.	O sistema salva as alterações realizadas.
6.	Fim do caso de uso.

16.4.2	UC11 – Cadastrar Produtos

•	Introdução: Permite cadastrar novos produtos e matérias-primas no sistema.
•	Requisitos Relacionados: RF011, RF012, RF013
•	Pré-Condições: O analista deve estar autenticado no sistema.
•	Pós-Condições: Produto cadastrado no sistema.

Cenários:

FB – Cadastrar Produtos
1.	O analista acessa a funcionalidade “Cadastrar Produto”.
2.	Informa nome, categoria, unidade de medida, fornecedor e custos do produto (RF011).
3.	O sistema valida os dados conforme padronização das unidades de medida (RN03).
4.	O sistema calcula automaticamente o preço do produto (RF013, RN02).
5.	O sistema registra o produto no banco de dados.
6.	Fim do caso de uso.

16.4.3	UC12 – Cadastrar Clientes
Introdução: Permite que o analista de cadastro realize o cadastro, consulta e atualização de clientes da Shizen Orgânicos.
Requisitos Relacionados: RF008
Pré-Condições: O analista de cadastro deve estar autenticado no sistema.
Pós-Condições: Cliente cadastrado e disponível para utilização em pedidos e consultas.
Cenários:
FB – Cadastrar Clientes
1.	O analista acessa a funcionalidade “Cadastrar Clientes”. 
2.	O sistema exibe o formulário de cadastro de cliente. 
3.	O analista informa nome, telefone e e-mail do cliente (RF008, RN05). 
4.	O sistema valida os dados preenchidos e verifica se já existe cliente cadastrado com o mesmo e-mail ou telefone. [FA01 – Cliente já cadastrado] 
5.	O sistema registra o cliente no banco de dados (RF008). 
6.	O sistema confirma o cadastro realizado com sucesso. 
7.	Fim do caso de uso. 
FA01 – Cliente já cadastrado
1.	O sistema informa que já existe um cliente cadastrado com os dados informados (RF008, RNF04). 
FA02 – Campos obrigatórios não preenchidos
1.	O sistema informa que nome, telefone e e-mail são obrigatórios para o cadastro do cliente (RN05, RNF04).

16.5	Módulo de Compras e Estoque

16.5.1	UC13 – Emitir Pedido de Compra

•	Introdução: Permite que o estoquista registre pedidos de reposição de estoque.
•	Requisitos Relacionados: RF012, RF017
•	Pré-Condições: O estoquista deve estar autenticado no sistema.
•	Pós-Condições: Pedido de compra registrado no sistema.

Cenários:

FB – Emitir Pedido de Compra
1.	O estoquista acessa a funcionalidade “Emitir Pedido de Compra”.
2.	O sistema exibe produtos com baixo estoque e alertas de validade (RN09).
3.	O estoquista seleciona os produtos e informa as quantidades desejadas.
4.	O sistema prioriza fornecedores certificados (RN10).
5.	O sistema registra o pedido de compra com status pendente de recebimento (RF017).
6.	Fim do caso de uso.

16.5.2	UC14 – Comprar Produtos

•	Introdução: Permite registrar a entrada de produtos e atualizar automaticamente o estoque.
•	Requisitos Relacionados: RF012, RF017
•	Pré-Condições: O estoquista deve estar autenticado no sistema.
•	Pós-Condições: Estoque atualizado e custos revisados.

Cenários:

FB – Comprar Produtos
1.	O estoquista acessa a funcionalidade “Comprar Produtos”.
2.	Informa os produtos recebidos, fornecedor e quantidades.
3.	O sistema atualiza automaticamente o estoque (RF017).
4.	O sistema revisa os custos dos produtos conforme atualização mensal de preços (RN04).
5.	O sistema registra a movimentação no histórico do estoque (RN16).
6.	Fim do caso de uso.

16.5.3	UC15 – Descartar Produtos Vencidos

•	Introdução: Permite registrar perdas de produtos vencidos e atualizar o estoque.
•	Requisitos Relacionados: RF012, RF017
•	Pré-Condições: O produto deve estar cadastrado no estoque.
•	Pós-Condições: Produto removido do estoque e perda registrada.

Cenários:

FB – Descartar Produtos Vencidos
1.	O estoquista acessa a funcionalidade “Descartar Produtos”.
2.	O sistema exibe produtos vencidos ou próximos do vencimento (RN09).
3.	O estoquista informa a quantidade descartada.
4.	O sistema atualiza automaticamente o estoque (RF017).
5.	O sistema registra a perda financeira relacionada ao descarte (RF009).
6.	Fim do caso de uso.

16.5.4	UC16 – Controlar Entrada e Saída de Mercadorias

•	Introdução: Permite que o estoquista registre e acompanhe movimentações de entrada e saída de mercadorias no estoque.
•	Requisitos Relacionados: RF017
•	Pré-Condições: O estoquista deve estar autenticado no sistema.
•	Pós-Condições: Movimentação registrada e estoque atualizado.

Cenários:

FB – Controlar Entrada e Saída de Mercadorias
1.	O estoquista acessa a funcionalidade “Movimentação de Estoque”.
2.	O sistema solicita o tipo de movimentação: entrada ou saída.
3.	O estoquista seleciona o produto e informa a quantidade movimentada.
4.	O sistema registra usuário, data, horário e quantidade da movimentação (RN16).
5.	O sistema atualiza automaticamente o estoque (RF017).
6.	Fim do caso de uso.
FA01 – Quantidade insuficiente para saída
1.	O sistema informa que o estoque disponível é insuficiente para realizar a saída da mercadoria (RF017, RNF04). 

17	REFERÊNCIAS

SOMMERVILLE, Ian. Engenharia de Software. 9. ed. São Paulo: Pearson Addison Wesley, 2011.
LARMAN, Craig. Utilizando UML e Padrões: uma introdução à análise e ao projeto orientados a objetos e ao desenvolvimento iterativo. Porto Alegre: Bookman, 2000.
