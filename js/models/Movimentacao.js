class Movimentacao {
  constructor({ id, produtoId, tipo, quantidade, observacao, data }) {
    this.id = Number(id);
    this.produtoId = Number(produtoId);
    this.tipo = tipo;
    this.quantidade = Number(quantidade) || 0;
    this.observacao = observacao?.trim() ?? "";
    this.data = data ?? new Date().toISOString();
  }
}

export default Movimentacao;

