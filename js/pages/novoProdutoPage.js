import {
  initializePage,
  populateSelect,
  showMessage,
  clearMessage,
} from "../utils/pageUtils.js";
import { listCategorias } from "../services/categoriaService.js";
import { createProduto } from "../services/produtoService.js";

function loadCategorias() {
  const select = document.getElementById("categoria");
  const categorias = listCategorias();
  if (!categorias.length) {
    showMessage(
      document.getElementById("produto-alert"),
      "Cadastre uma categoria antes de criar produtos.",
      "warning",
    );
  }
  populateSelect(select, categorias);
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
    createProduto(data);
    showMessage(alertContainer, "Produto cadastrado com sucesso!", "success");
    form.reset();
    setTimeout(() => {
      window.location.href = "produtos.html";
    }, 800);
  } catch (error) {
    showMessage(alertContainer, error.message, "error");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializePage();
  loadCategorias();
  document.getElementById("form-produto").addEventListener("submit", handleSubmit);
});

