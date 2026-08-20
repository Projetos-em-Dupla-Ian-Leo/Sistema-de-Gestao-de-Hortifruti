Perfeito. Como você vai colar isso direto no **Figma AI (Make Design / First Draft)**, o ideal é dar instruções extremamente objetivas, sem deixar espaço para ela inventar layout.

Use exatamente este prompt:

---

# PROMPT PARA FIGMA AI — SHIZEN ORGÂNICOS (GERAR 6 TELAS)

Crie **6 telas desktop (1440×1024)** para um **Sistema Web de Gestão Interna da empresa Shizen Orgânicos**.

Objetivo: criar telas **prontas para prototipação em Figma**, seguindo visual corporativo, orgânico, limpo e profissional.

IMPORTANTE:

* NÃO criar landing page.
* NÃO criar e-commerce.
* NÃO criar visual futurista.
* NÃO criar dark mode.
* NÃO usar gradientes fortes.
* NÃO inventar módulos.
* Criar interface administrativa interna.
* Seguir padrão ERP / Dashboard.
* Interface simples para usuários leigos.
* Todos os componentes devem usar Auto Layout.
* Criar componentes reutilizáveis.

---

# ESTILO VISUAL (OBRIGATÓRIO)

Referência visual:
Site da Shizen Orgânicos.

Visual:

* orgânico
* sofisticado
* minimalista
* empresarial
* acolhedor
* moderno

Tipografia:
Poppins

Espaçamentos:
8 / 16 / 24 / 32

Bordas:
12–16 px

Sombras suaves.

---

# PALETA (OBRIGATÓRIA)

Primária:

* Verde escuro → #14391E
* Verde principal → #2E6B35
* Verde médio → #3D8442
* Verde claro → #5CA652

Secundárias:

* Verde folha → #89B84A
* Amarelo orgânico → #D6B43D

Neutros:

* Fundo → #F7F6F2
* Branco → #FFFFFF
* Texto → #222C25
* Cinza → #8A918C

Feedback:

* Sucesso → #2F9D57
* Alerta → #E6A530
* Erro → #D64B4B

---

# COMPONENTES GLOBAIS (USAR EM TODAS AS TELAS)

Sidebar fixa:
largura 280 px

Elementos:
Logo Shizen
Dashboard
Vendas
Financeiro
Estoque
Cadastros
Relatórios
Configurações
Usuários
Sair

Sidebar:
verde escuro.

Header:
altura 88 px

Header contém:
notificações
avatar
nome do usuário
perfil

Cards:
radius 16

Inputs:
altura 48

Botões:
altura 48
radius 12

Tabelas:
cabeçalho claro
linhas limpas

Ícones:
Lucide style.

---

# TELA 1 — LOGIN

Objetivo:
autenticar usuários.

Layout:
Dividir tela:

ESQUERDA 40%
DIREITA 60%

Esquerda:
fundo verde escuro
logo Shizen
imagem orgânica (hortifruti)
texto:

"Sistema de Gestão para Mercado Hortifruti Orgânico"

Direita:

Título:
Bem-vindo de volta

Subtexto:
Faça login para acessar o sistema

Campos:
E-mail
Senha

ações:
mostrar senha
esqueci senha

Botão:
Entrar

Rodapé:
direitos reservados

Estado de erro:
mensagem amigável abaixo do campo.

---

# TELA 2 — ADMINISTRADOR

Objetivo:
visão geral do negócio.

Header:
"Bem-vinda, Administradora"

Cards KPI:
Receita do Dia
Pedidos Pendentes
Produtos em Alerta
Clientes Ativos

Área central:
gráfico linha:
Faturamento Mensal

lado direito:
gráfico pizza:
Categorias vendidas

abaixo:
Tabela:
Últimas movimentações

colunas:
Data
Tipo
Usuário
Valor
Status

Adicionar botão:
Novo Pedido

---

# TELA 3 — FINANCEIRO

Objetivo:
controle financeiro.

Header:
Financeiro

Abas:
Resumo
Receitas
Despesas
Fluxo Caixa
Relatórios

KPIs:
Receitas
Despesas
Lucro Líquido
Margem

Seção:
gráfico barras:
Fluxo de Caixa

lado direito:
pizza:
Despesas por categoria

Tabela:
Pagamentos Pendentes

colunas:
Cliente
Pedido
Valor
Dias
Status

Status:
verde
amarelo
vermelho

---

# TELA 4 — ANALISTA DE CADASTRO

Objetivo:
gerenciar produtos.

Título:
Cadastro de Produtos

Abas:
Produtos
Matéria-prima
Fornecedores
Clientes

Barra:
Pesquisa

Filtros:
Categoria
Fornecedor
Situação

Tabela:

Produto
Categoria
Unidade
Fornecedor
Preço
Estoque
Situação
Ações

Botão destaque:

* Novo Produto

Ao clicar:
abrir drawer lateral.

Drawer:
Nome
Categoria
Fornecedor
Unidade
Custo
Preço sugerido
Salvar

---

# TELA 5 — VENDAS

Objetivo:
registrar pedidos.

Título:
Novo Pedido

Layout:
2 colunas.

ESQUERDA:
Cliente

Campo busca.

Card cliente:
Nome
Telefone
Email

Pagamento:
cartão
pix
dinheiro

Observações.

DIREITA:
Itens do Pedido

Tabela:

Produto
Qtd
Unidade
Preço
Subtotal

Botão:
Adicionar Produto

Resumo:

Subtotal
Desconto
Total

Botão grande:
Finalizar Pedido

Estado:
Pedido Pendente de Pagamento

---

# TELA 6 — ESTOQUE

Objetivo:
controle de entrada e saída.

Título:
Estoque

Abas:
Estoque Atual
Movimentações
Entradas
Saídas

Topo:
Pesquisa

Filtros:
Categoria
Situação

Tabela:

Produto
Categoria
Unidade
Quantidade
Validade
Status

Status:
OK
Alerta
Vencido

Linha vencida:
destacar.

Botão:

* Movimentação

Painel lateral:
Entrada
Saída

Campos:
Produto
Quantidade
Fornecedor
Data
Salvar

Rodapé:
Histórico recente.

---

# REGRAS IMPORTANTES

Criar tudo em:
Auto Layout.

Criar componentes:
Buttons
Inputs
Sidebar
Header
Cards
Table
Modal

Criar protótipo navegável:

Login → Dashboard
Dashboard → módulos

Manter consistência visual entre todas as telas.

Resultado esperado:
parecer um sistema real pronto para desenvolvimento, não wireframe.
