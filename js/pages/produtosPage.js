import {
  initializePage,
  populateSelect,
  formatCurrency,
  showMessage,
  clearMessage,
} from "../utils/pageUtils.js";
import { listCategorias } from "../services/categoriaService.js";
import { filterProdutos, deleteProduto } from "../services/produtoService.js";

const filtros = {
  nome: "",
  categoriaId: "todos",
};

function loadCategorias() {
  const select = document.getElementById("filter-categoria");
  const categorias = listCategorias();
  populateSelect(select, categorias, { includeAll: true });
}

function badgeStatus(produto) {
  const mensagem = produto.verificarEstoque();
  if (produto.quantidade < produto.minimo) {
    return `<span class="badge badge-low">${mensagem}</span>`;
  }
  if (produto.quantidade > produto.maximo) {
    return `<span class="badge badge-high">${mensagem}</span>`;
  }
  return `<span class="badge badge-ok">${mensagem}</span>`;
}

function renderTabela() {
  const tbody = document.querySelector("#tabela-produtos tbody");
  const categorias = listCategorias();
  const categoriasMap = new Map(categorias.map((categoria) => [categoria.id, categoria.nome]));
  const produtos = filterProdutos(filtros);

  if (!produtos.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align:center;">Nenhum produto encontrado.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = produtos
    .map(
      (produto) => `
      <tr data-id="${produto.id}">
        <td>${produto.id}</td>
        <td>${produto.nome}</td>
        <td>${categoriasMap.get(produto.categoriaId) ?? "-"}</td>
        <td>${produto.unidade}</td>
        <td>${formatCurrency(produto.preco)}</td>
        <td>${produto.quantidade}</td>
        <td>${produto.minimo}</td>
        <td>${produto.maximo}</td>
        <td>${badgeStatus(produto)}</td>
        <td class="table-actions">
          <a class="btn btn-secondary" href="editar-produto.html?id=${produto.id}">Editar</a>
          <button class="btn btn-danger" data-delete="${produto.id}">Excluir</button>
        </td>
      </tr>
    `,
    )
    .join("");
}

function handleDelete(event) {
  const button = event.target.closest("button[data-delete]");
  if (!button) return;
  const id = button.getAttribute("data-delete");
  const confirmar = window.confirm("Confirma excluir este produto?");
  if (!confirmar) return;

  try {
    deleteProduto(id);
    const alertContainer = document.getElementById("produtos-alert");
    showMessage(alertContainer, "Produto removido com sucesso.", "success");
    renderTabela();
  } catch (error) {
    const alertContainer = document.getElementById("produtos-alert");
    showMessage(alertContainer, error.message, "error");
  }
}

function setupFilters() {
  const nomeInput = document.getElementById("filter-nome");
  const categoriaSelect = document.getElementById("filter-categoria");
  const btnFiltrar = document.getElementById("btn-filtrar");

  btnFiltrar.addEventListener("click", () => {
    filtros.nome = nomeInput.value;
    filtros.categoriaId = categoriaSelect.value;
    renderTabela();
  });

  nomeInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      filtros.nome = nomeInput.value;
      filtros.categoriaId = categoriaSelect.value;
      renderTabela();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializePage();
  loadCategorias();
  setupFilters();
  renderTabela();
  document.addEventListener("click", handleDelete);
  clearMessage(document.getElementById("produtos-alert"));
});

