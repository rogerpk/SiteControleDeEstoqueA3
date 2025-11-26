# Controle de Estoque (versão web)

Aplicação web simples e robusta, desenvolvida com **HTML, CSS e JavaScript puro**, que substitui o sistema Java Swing original. Todo o gerenciamento de produtos, categorias e movimentações é realizado no navegador e os dados são persistidos em **SQLite** (via SQL.js).

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
│   ├── services/             # Regras de negócio e persistência SQLite
│   ├── storage/              # database.js - SQLite wrapper + schema
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

## 💾 Persistência de dados (SQLite)

O sistema utiliza **SQLite no navegador** via [SQL.js](https://github.com/sql-js/sql.js):

✅ **Banco de dados real** com SQL completo  
✅ **Extremamente leve** (~500KB)  
✅ **Sem servidor** - tudo roda no navegador  
✅ **Persistência automática** - o banco é salvo em localStorage  
✅ **Relações e integridade** - chaves estrangeiras e índices  
✅ **Performance superior** ao localStorage simples  

### Vantagens do SQLite
- Queries SQL completas (JOINs, agregações, filtros)
- Integridade referencial automática
- Transações atômicas
- Suporte a milhares de registros sem perda de performance

Na primeira execução, o sistema cria o banco e insere dados de exemplo (produtos, categorias).

**Para resetar:** abra o console do navegador e execute:
```javascript
localStorage.removeItem('estoque_db');
location.reload();
```

## 🔁 Migração da lógica Java → JavaScript

- **DAOs / JDBC / MySQL** foram substituídos por **SQLite no navegador** via SQL.js.
- **JFrame / JTable / JOptionPane** viraram páginas HTML com tabelas e alertas simples.
- **Regras de negócio** (validações, cálculo de estoque, verificação de limites) foram mantidas e reimplementadas nos serviços JavaScript.
- O fluxo de usuário original (cadastro, movimentação, relatórios) foi preservado e distribuído nas novas páginas.

## ✅ Requisitos atendidos

- Sem frameworks front-end ou bibliotecas CSS.
- Código modular e documentado para manutenção simples.
- Aplicação funciona integralmente no navegador.

---

Desenvolvido para fins acadêmicos. Sinta-se à vontade para adaptar e evoluir o projeto. 💙

