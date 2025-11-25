import Categoria from "../models/Category.js";
import {
  STORAGE_KEYS,
  getCollection,
  saveCollection,
  nextId,
} from "../storage/localStorageService.js";

function listCategorias() {
  const categorias = getCollection(STORAGE_KEYS.categorias).map(
    (categoria) => new Categoria(categoria),
  );
  return categorias.sort((a, b) => a.nome.localeCompare(b.nome));
}

function getCategoriaById(id) {
  return listCategorias().find((categoria) => categoria.id === Number(id));
}

function validateCategoriaPayload({ nome, tamanho, embalagem }) {
  if (!nome?.trim()) {
    throw new Error("O nome da categoria é obrigatório.");
  }
  if (!tamanho?.trim()) {
    throw new Error("O tamanho é obrigatório.");
  }
  if (!embalagem?.trim()) {
    throw new Error("A embalagem é obrigatória.");
  }
}

function createCategoria(payload) {
  validateCategoriaPayload(payload);
  const categorias = getCollection(STORAGE_KEYS.categorias);
  const categoria = new Categoria({
    ...payload,
    id: nextId(STORAGE_KEYS.categorias),
  });
  categorias.push(categoria);
  saveCollection(STORAGE_KEYS.categorias, categorias);
  return categoria;
}

function updateCategoria(id, payload) {
  validateCategoriaPayload(payload);
  const categorias = getCollection(STORAGE_KEYS.categorias);
  const index = categorias.findIndex((categoria) => Number(categoria.id) === Number(id));
  if (index === -1) throw new Error("Categoria não encontrada.");
  categorias[index] = { ...categorias[index], ...payload, id: Number(id) };
  saveCollection(STORAGE_KEYS.categorias, categorias);
  return new Categoria(categorias[index]);
}

function deleteCategoria(id) {
  const produtos = getCollection(STORAGE_KEYS.produtos);
  const possuiProdutos = produtos.some(
    (produto) => Number(produto.categoriaId) === Number(id),
  );
  if (possuiProdutos) {
    throw new Error("Não é possível remover categorias em uso por produtos.");
  }

  const categorias = getCollection(STORAGE_KEYS.categorias);
  const filtered = categorias.filter((categoria) => Number(categoria.id) !== Number(id));
  saveCollection(STORAGE_KEYS.categorias, filtered);
}

export {
  listCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
};

