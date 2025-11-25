import Produto from "../models/Product.js";
import {
  STORAGE_KEYS,
  getCollection,
  saveCollection,
  nextId,
} from "../storage/localStorageService.js";

function listProdutos() {
  return getCollection(STORAGE_KEYS.produtos).map((produto) => new Produto(produto));
}

function getProdutoById(id) {
  return listProdutos().find((produto) => produto.id === Number(id));
}

function validateProdutoPayload(payload) {
  const required = ["nome", "unidade", "preco", "quantidade", "minimo", "maximo", "categoriaId"];
  const missing = required.filter((field) => payload[field] === undefined || payload[field] === null || `${payload[field]}`.trim() === "");
  if (missing.length) {
    throw new Error("Preencha todos os campos do produto.");
  }

  const preco = Number(payload.preco);
  const quantidade = Number(payload.quantidade);
  if (preco < 0 || Number.isNaN(preco)) {
    throw new Error("O preço deve ser um número positivo.");
  }
  if (quantidade < 0 || Number.isNaN(quantidade)) {
    throw new Error("A quantidade deve ser um número positivo.");
  }

  const minimo = Number(payload.minimo);
  const maximo = Number(payload.maximo);
  if (minimo > maximo) {
    throw new Error("O mínimo não pode ser maior que o máximo.");
  }

  const categorias = getCollection(STORAGE_KEYS.categorias);
  const existsCategoria = categorias.some(
    (categoria) => Number(categoria.id) === Number(payload.categoriaId),
  );
  if (!existsCategoria) {
    throw new Error("Categoria inválida.");
  }
}

function createProduto(payload) {
  validateProdutoPayload(payload);
  const produtos = getCollection(STORAGE_KEYS.produtos);
  const produto = new Produto({
    ...payload,
    id: nextId(STORAGE_KEYS.produtos),
  });
  produtos.push(produto);
  saveCollection(STORAGE_KEYS.produtos, produtos);
  return produto;
}

function updateProduto(id, payload) {
  validateProdutoPayload(payload);
  const produtos = getCollection(STORAGE_KEYS.produtos);
  const index = produtos.findIndex((produto) => Number(produto.id) === Number(id));
  if (index === -1) throw new Error("Produto não encontrado.");
  produtos[index] = { ...produtos[index], ...payload, id: Number(id) };
  saveCollection(STORAGE_KEYS.produtos, produtos);
  return new Produto(produtos[index]);
}

function deleteProduto(id) {
  const produtos = getCollection(STORAGE_KEYS.produtos);
  const filtered = produtos.filter((produto) => Number(produto.id) !== Number(id));
  saveCollection(STORAGE_KEYS.produtos, filtered);

  const movimentacoes = getCollection(STORAGE_KEYS.movimentacoes);
  const restantes = movimentacoes.filter(
    (movimentacao) => Number(movimentacao.produtoId) !== Number(id),
  );
  saveCollection(STORAGE_KEYS.movimentacoes, restantes);
}

function filterProdutos({ nome = "", categoriaId = "todos" } = {}) {
  return listProdutos().filter((produto) => {
    const matchNome = produto.nome.toLowerCase().includes(nome.toLowerCase());
    const matchCategoria =
      categoriaId === "todos" || produto.categoriaId === Number(categoriaId);
    return matchNome && matchCategoria;
  });
}

function ajustarQuantidade(id, delta) {
  const produtos = getCollection(STORAGE_KEYS.produtos);
  const index = produtos.findIndex((produto) => Number(produto.id) === Number(id));
  if (index === -1) throw new Error("Produto não encontrado.");
  const novaQuantidade = Number(produtos[index].quantidade) + Number(delta);
  if (novaQuantidade < 0) {
    throw new Error("Quantidade insuficiente para realizar a operação.");
  }
  produtos[index].quantidade = novaQuantidade;
  saveCollection(STORAGE_KEYS.produtos, produtos);
  return new Produto(produtos[index]);
}

export {
  listProdutos,
  getProdutoById,
  filterProdutos,
  createProduto,
  updateProduto,
  deleteProduto,
  ajustarQuantidade,
};

