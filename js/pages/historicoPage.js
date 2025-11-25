import {
  initializePage,
  populateSelect,
  formatDate,
} from "../utils/pageUtils.js";
import { listProdutos } from "../services/produtoService.js";
import { listarMovimentacoes } from "../services/movimentacaoService.js";

const filtros = {
  produtoId: "todos",
  tipo: "todos",
};

function loadProdutos() {
  const select = document.getElementById("filtro-produto");
  const produtos = listProdutos();
  populateSelect(select, produtos, { includeAll: true });
}

function renderTabela() {
  const tbody = document.querySelector("#tabela-historico tbody");
  const produtos = listProdutos();
  const produtosMap = new Map(produtos.map((produto) => [produto.id, produto.nome]));
  const movimentacoes = listarMovimentacoes().filter((movimentacao) => {
    const matchProduto =
      filtros.produtoId === "todos" || movimentacao.produtoId === Number(filtros.produtoId);
    const matchTipo = filtros.tipo === "todos" || movimentacao.tipo === filtros.tipo;
    return matchProduto && matchTipo;
  });

  if (!movimentacoes.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;">Nenhuma movimentação encontrada.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = movimentacoes
    .map(
      (movimentacao) => `
      <tr>
        <td>${formatDate(movimentacao.data)}</td>
        <td>${produtosMap.get(movimentacao.produtoId) ?? "-"}</td>
        <td>${movimentacao.tipo === "entrada" ? "Entrada" : "Saída"}</td>
        <td>${movimentacao.quantidade}</td>
        <td>${movimentacao.observacao || "-"}</td>
      </tr>
    `,
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  initializePage();
  loadProdutos();
  renderTabela();

  document.getElementById("btn-filtrar").addEventListener("click", () => {
    filtros.produtoId = document.getElementById("filtro-produto").value;
    filtros.tipo = document.getElementById("filtro-tipo").value;
    renderTabela();
  });
});

