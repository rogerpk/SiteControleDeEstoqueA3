import { seedIfEmpty } from "../storage/localStorageService.js";

function initializePage() {
  seedIfEmpty();
}

function formatCurrency(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("pt-BR");
}

function showMessage(container, message, type = "success") {
  if (!container) return;
  container.textContent = message;
  container.className = `alert alert-${type}`;
  container.hidden = false;
}

function clearMessage(container) {
  if (!container) return;
  container.textContent = "";
  container.hidden = true;
}

function populateSelect(select, items, { includeAll = false } = {}) {
  if (!select) return;
  select.innerHTML = "";
  if (includeAll) {
    const option = document.createElement("option");
    option.value = "todos";
    option.textContent = "Todas";
    select.appendChild(option);
  }
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.nome;
    select.appendChild(option);
  });
}

export {
  initializePage,
  formatCurrency,
  formatDate,
  showMessage,
  clearMessage,
  populateSelect,
};

