import { initializePage, formatCurrency } from "../utils/pageUtils.js";
import { listProdutos } from "../services/produtoService.js";
import { listCategorias } from "../services/categoriaService.js";

function renderListaPrecos(produtos, categoriasMap) {
  const tbody = document.querySelector("#relatorio-precos tbody");
  if (!produtos.length) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Sem produtos cadastrados.</td></tr>`;
    return;
  }
  tbody.innerHTML = produtos
    .map(
      (produto) => `
      <tr>
        <td>${produto.nome}</td>
        <td>${categoriasMap.get(produto.categoriaId) ?? "-"}</td>
        <td>${produto.unidade}</td>
        <td>${formatCurrency(produto.preco)}</td>
      </tr>
    `,
    )
    .join("");
}

function renderBalanco(produtos) {
  const tbody = document.querySelector("#relatorio-balanco tbody");
  if (!produtos.length) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Sem dados.</td></tr>`;
    return;
  }

  let total = 0;
  tbody.innerHTML = produtos
    .map((produto) => {
      const valor = produto.quantidade * produto.preco;
      total += valor;
      return `
        <tr>
          <td>${produto.nome}</td>
          <td>${produto.quantidade}</td>
          <td>${formatCurrency(produto.preco)}</td>
          <td>${formatCurrency(valor)}</td>
        </tr>
      `;
    })
    .join("");

  document.getElementById("balanco-total").textContent = `Total em estoque: ${formatCurrency(total)}`;
}

function renderIntervalo(produtos) {
  const tbody = document.querySelector("#relatorio-intervalo tbody");
  const foraDoIntervalo = produtos.filter(
    (produto) => produto.quantidade < produto.minimo || produto.quantidade > produto.maximo,
  );

  if (!foraDoIntervalo.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Todos os produtos estão dentro do intervalo.</td></tr>`;
    return;
  }

  tbody.innerHTML = foraDoIntervalo
    .map(
      (produto) => `
      <tr>
        <td>${produto.nome}</td>
        <td>${produto.quantidade}</td>
        <td>${produto.minimo}</td>
        <td>${produto.maximo}</td>
        <td>${produto.quantidade < produto.minimo ? "Abaixo do mínimo" : "Acima do máximo"}</td>
      </tr>
    `,
    )
    .join("");
}

function renderCategoriasResumo(produtos, categoriasMap) {
  const tbody = document.querySelector("#relatorio-categorias tbody");
  if (!produtos.length) {
    tbody.innerHTML = `<tr><td colspan="2" style="text-align:center;">Sem dados.</td></tr>`;
    return;
  }

  const contagem = produtos.reduce((acc, produto) => {
    const key = produto.categoriaId;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  tbody.innerHTML = Object.entries(contagem)
    .map(([categoriaId, quantidade]) => `
      <tr>
        <td>${categoriasMap.get(Number(categoriaId)) ?? "Sem categoria"}</td>
        <td>${quantidade}</td>
      </tr>
    `)
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  initializePage();
  const produtos = listProdutos();
  const categorias = listCategorias();
  const categoriasMap = new Map(categorias.map((categoria) => [categoria.id, categoria.nome]));

  renderListaPrecos(produtos, categoriasMap);
  renderBalanco(produtos);
  renderIntervalo(produtos);
  renderCategoriasResumo(produtos, categoriasMap);
});

