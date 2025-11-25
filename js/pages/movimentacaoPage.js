import {
  initializePage,
  populateSelect,
  showMessage,
  clearMessage,
  formatDate,
} from "../utils/pageUtils.js";
import { listProdutos } from "../services/produtoService.js";
import { registrarMovimentacao, listarMovimentacoes } from "../services/movimentacaoService.js";

function loadProdutos() {
  const select = document.getElementById("produto");
  const produtos = listProdutos();
  populateSelect(select, produtos);
  if (!produtos.length) {
    showMessage(
      document.getElementById("movimentacao-alert"),
      "Cadastre um produto antes de registrar movimentações.",
      "warning",
    );
  }
}

function renderMovimentacoes() {
  const tbody = document.querySelector("#tabela-movimentacoes tbody");
  const produtos = listProdutos();
  const produtosMap = new Map(produtos.map((produto) => [produto.id, produto.nome]));
  const movimentacoes = listarMovimentacoes().slice(0, 10);

  if (!movimentacoes.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;">Nenhuma movimentação registrada.</td>
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

function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const alertContainer = document.getElementById("movimentacao-alert");
  clearMessage(alertContainer);

  const payload = {
    produtoId: form.produtoId.value,
    tipo: form.tipo.value,
    quantidade: form.quantidade.value,
    observacao: form.observacao.value,
  };

  try {
    registrarMovimentacao(payload);
    showMessage(alertContainer, "Movimentação registrada com sucesso!", "success");
    form.reset();
    renderMovimentacoes();
  } catch (error) {
    showMessage(alertContainer, error.message, "error");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializePage();
  loadProdutos();
  renderMovimentacoes();
  document
    .getElementById("form-movimentacao")
    .addEventListener("submit", handleSubmit);
});

