import Movimentacao from "../models/Movimentacao.js";
import {
  STORAGE_KEYS,
  getCollection,
  saveCollection,
  nextId,
} from "../storage/localStorageService.js";
import { ajustarQuantidade, getProdutoById } from "./produtoService.js";

function listarMovimentacoes() {
  return getCollection(STORAGE_KEYS.movimentacoes)
    .map((movimentacao) => new Movimentacao(movimentacao))
    .sort((a, b) => new Date(b.data) - new Date(a.data));
}

function listarMovimentacoesPorProduto(produtoId) {
  return listarMovimentacoes().filter(
    (movimentacao) => movimentacao.produtoId === Number(produtoId),
  );
}

function validarMovimentacao({ produtoId, tipo, quantidade }) {
  if (!produtoId) throw new Error("Selecione um produto.");
  if (!["entrada", "saida"].includes(tipo)) {
    throw new Error("Tipo de movimentação inválido.");
  }
  const quantidadeNumero = Number(quantidade);
  if (Number.isNaN(quantidadeNumero) || quantidadeNumero <= 0) {
    throw new Error("A quantidade deve ser maior que zero.");
  }
  const produto = getProdutoById(produtoId);
  if (!produto) throw new Error("Produto não encontrado.");
}

function registrarMovimentacao({ produtoId, tipo, quantidade, observacao }) {
  validarMovimentacao({ produtoId, tipo, quantidade });
  const quantidadeNumero = Number(quantidade);
  const delta = tipo === "entrada" ? quantidadeNumero : -quantidadeNumero;
  const produtoAtualizado = ajustarQuantidade(produtoId, delta);

  const movimentacoes = getCollection(STORAGE_KEYS.movimentacoes);
  const movimentacao = new Movimentacao({
    id: nextId(STORAGE_KEYS.movimentacoes),
    produtoId,
    tipo,
    quantidade: quantidadeNumero,
    observacao,
    data: new Date().toISOString(),
  });

  movimentacoes.push(movimentacao);
  saveCollection(STORAGE_KEYS.movimentacoes, movimentacoes);

  return { movimentacao, produtoAtualizado };
}

export { listarMovimentacoes, listarMovimentacoesPorProduto, registrarMovimentacao };

