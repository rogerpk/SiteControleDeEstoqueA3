import { initializePage, formatCurrency } from "../utils/pageUtils.js";
import { listProdutos } from "../services/produtoService.js";
import { listCategorias } from "../services/categoriaService.js";
import { listarMovimentacoes } from "../services/movimentacaoService.js";

function renderCards() {
  const container = document.getElementById("dashboard-cards");
  if (!container) return;

  const produtos = listProdutos();
  const categorias = listCategorias();
  const movimentacoes = listarMovimentacoes();

  const valorTotal = produtos.reduce(
    (total, produto) => total + produto.preco * produto.quantidade,
    0,
  );

  const cards = [
    {
      title: "Produtos ativos",
      value: produtos.length,
      detail: "Itens catalogados",
    },
    {
      title: "Categorias",
      value: categorias.length,
      detail: "Grupos disponíveis",
    },
    {
      title: "Movimentações",
      value: movimentacoes.length,
      detail: "Entradas e saídas registradas",
    },
    {
      title: "Valor em estoque",
      value: formatCurrency(valorTotal),
      detail: "Somatório do estoque atual",
    },
  ];

  container.innerHTML = cards
    .map(
      (card) => `
      <div class="card">
        <p class="muted">${card.title}</p>
        <h2>${card.value}</h2>
        <p>${card.detail}</p>
      </div>
    `,
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  initializePage();
  renderCards();
});

