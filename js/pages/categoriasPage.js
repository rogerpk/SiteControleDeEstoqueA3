import {
  initializePage,
  showMessage,
  clearMessage,
} from "../utils/pageUtils.js";
import {
  listCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../services/categoriaService.js";

function renderTabela() {
  const tbody = document.querySelector("#tabela-categorias tbody");
  const categorias = listCategorias();

  if (!categorias.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;">Nenhuma categoria cadastrada.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = categorias
    .map(
      (categoria) => `
      <tr data-id="${categoria.id}">
        <td>${categoria.id}</td>
        <td>${categoria.nome}</td>
        <td>${categoria.tamanho}</td>
        <td>${categoria.embalagem}</td>
        <td class="table-actions">
          <button class="btn btn-secondary" data-edit="${categoria.id}">Editar</button>
          <button class="btn btn-danger" data-delete="${categoria.id}">Excluir</button>
        </td>
      </tr>
    `,
    )
    .join("");
}

function preencherFormulario(categoria) {
  document.getElementById("categoria-id").value = categoria.id;
  document.getElementById("nome").value = categoria.nome;
  document.getElementById("tamanho").value = categoria.tamanho;
  document.getElementById("embalagem").value = categoria.embalagem;
  document.getElementById("btn-salvar").textContent = "Atualizar categoria";
}

function resetFormulario() {
  document.getElementById("form-categoria").reset();
  document.getElementById("categoria-id").value = "";
  document.getElementById("btn-salvar").textContent = "Salvar categoria";
}

function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const alertContainer = document.getElementById("categoria-alert");
  clearMessage(alertContainer);

  const payload = {
    nome: form.nome.value,
    tamanho: form.tamanho.value,
    embalagem: form.embalagem.value,
  };

  try {
    if (form["categoria-id"].value) {
      updateCategoria(form["categoria-id"].value, payload);
      showMessage(alertContainer, "Categoria atualizada com sucesso!", "success");
    } else {
      createCategoria(payload);
      showMessage(alertContainer, "Categoria criada com sucesso!", "success");
    }
    resetFormulario();
    renderTabela();
  } catch (error) {
    showMessage(alertContainer, error.message, "error");
  }
}

function handleTableClick(event) {
  const alertContainer = document.getElementById("categoria-alert");
  const editBtn = event.target.closest("button[data-edit]");
  const deleteBtn = event.target.closest("button[data-delete]");

  if (editBtn) {
    const id = editBtn.getAttribute("data-edit");
    const categoria = listCategorias().find((item) => item.id === Number(id));
    if (categoria) {
      preencherFormulario(categoria);
    }
    return;
  }

  if (deleteBtn) {
    const id = deleteBtn.getAttribute("data-delete");
    const confirmar = window.confirm("Deseja remover esta categoria?");
    if (!confirmar) return;
    try {
      deleteCategoria(id);
      showMessage(alertContainer, "Categoria excluída.", "success");
      renderTabela();
    } catch (error) {
      showMessage(alertContainer, error.message, "error");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializePage();
  renderTabela();
  document
    .getElementById("form-categoria")
    .addEventListener("submit", handleSubmit);
  document.getElementById("btn-limpar").addEventListener("click", () => {
    resetFormulario();
    clearMessage(document.getElementById("categoria-alert"));
  });
  document
    .querySelector("#tabela-categorias tbody")
    .addEventListener("click", handleTableClick);
});

