# Controle de Estoque A3 (versão web)

Aplicação web simples, desenvolvida com **HTML, CSS e JavaScript puro**, que substitui o sistema Java Swing original. Todo o gerenciamento de produtos, categorias e movimentações é realizado no navegador e os dados são persistidos em `localStorage`.

## ✨ Funcionalidades

- CRUD completo de produtos com validações de mínimos/máximos.
- CRUD de categorias com bloqueio de exclusão quando houver produtos associados.
- Registro de **entradas e saídas** de estoque com histórico detalhado.
- Relatórios:
  - Lista de preços
  - Balanço físico/financeiro
  - Produtos fora do intervalo permitido
  - Quantidade de produtos por categoria
- Dashboard com indicadores rápidos.

## 🚀 Como executar

1. Faça o download ou clone este repositório.
2. Abra o arquivo `index.html` em qualquer navegador moderno.
3. Todas as demais páginas podem ser acessadas pelos links do menu superior.

> Não há dependências ou servidor — basta abrir os arquivos localmente.

## 🗂️ Estrutura

```
.
├── css/
│   └── styles.css
├── js/
│   ├── models/               # Classes Produto, Categoria e Movimentacao
│   ├── services/             # Regras de negócio e persistência
│   ├── storage/              # Wrapper para localStorage + seed
│   ├── pages/                # Scripts específicos de cada página
│   └── utils/                # Helpers (formatos, mensagens, etc.)
├── index.html                # Dashboard principal
├── produtos.html             # Lista + filtros
├── novo-produto.html
├── editar-produto.html
├── categorias.html
├── movimentacao.html
├── historico.html
└── relatorios.html
```

## 💾 Persistência de dados

- Os dados são gravados em `localStorage` usando as chaves:
  - `estoque_produtos`
  - `estoque_categorias`
  - `estoque_movimentacoes`
- Na primeira execução, o sistema cria registros de exemplo (mesmos dados do projeto original).
- Para resetar o sistema, basta limpar o `localStorage` do navegador.

## 🔁 Migração da lógica Java → JavaScript

- **DAOs / JDBC** foram substituídos por serviços JS que operam sobre arrays salvos no `localStorage`.
- **JFrame / JTable / JOptionPane** viraram páginas HTML com tabelas e alertas simples.
- **Regras de negócio** (validações, cálculo de estoque, verificação de limites) foram mantidas e reimplementadas nas classes JavaScript.
- O fluxo de usuário original (cadastro, movimentação, relatórios) foi preservado e distribuído nas novas páginas.

## ✅ Requisitos atendidos

- Sem frameworks front-end ou bibliotecas CSS.
- Código modular e documentado para manutenção simples.
- Aplicação funciona integralmente no navegador.

---

Desenvolvido para fins acadêmicos. Sinta-se à vontade para adaptar e evoluir o projeto. 💙

