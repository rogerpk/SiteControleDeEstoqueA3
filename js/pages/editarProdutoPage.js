import {
  initializePage,
  populateSelect,
  showMessage,
  clearMessage,
} from "../utils/pageUtils.js";
import { listCategorias } from "../services/categoriaService.js";
import { getProdutoById, updateProduto } from "../services/produtoService.js";

function getProdutoIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function loadCategorias(selectedId) {
  const select = document.getElementById("categoria");
  const categorias = listCategorias();
  populateSelect(select, categorias);
  select.value = selectedId ?? "";
}

function preencherFormulario(produto) {
  document.getElementById("produto-id").value = produto.id;
  document.getElementById("nome").value = produto.nome;
  document.getElementById("unidade").value = produto.unidade;
  document.getElementById("preco").value = produto.preco;
  document.getElementById("quantidade").value = produto.quantidade;
  document.getElementById("minimo").value = produto.minimo;
  document.getElementById("maximo").value = produto.maximo;
  loadCategorias(produto.categoriaId);
  document.getElementById("form-produto").hidden = false;
}

function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const alertContainer = document.getElementById("produto-alert");
  clearMessage(alertContainer);

  const data = {
    nome: form.nome.value,
    unidade: form.unidade.value,
    preco: form.preco.value,
    quantidade: form.quantidade.value,
    minimo: form.minimo.value,
    maximo: form.maximo.value,
    categoriaId: form.categoriaId.value,
  };

  try {
    updateProduto(form["produto-id"].value, data);
    showMessage(alertContainer, "Produto atualizado com sucesso!", "success");
    setTimeout(() => {
      window.location.href = "produtos.html";
    }, 800);
  } catch (error) {
    showMessage(alertContainer, error.message, "error");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializePage();
  const produtoId = getProdutoIdFromUrl();
  const alertContainer = document.getElementById("produto-alert");

  if (!produtoId) {
    showMessage(alertContainer, "ID do produto não informado.", "error");
    return;
  }

  const produto = getProdutoById(produtoId);
  if (!produto) {
    showMessage(alertContainer, "Produto não encontrado.", "error");
    return;
  }

  preencherFormulario(produto);
  document.getElementById("form-produto").addEventListener("submit", handleSubmit);
});

