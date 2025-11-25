class Produto {
  constructor({
    id,
    nome,
    unidade,
    preco,
    quantidade,
    minimo,
    maximo,
    categoriaId,
  }) {
    this.id = Number(id);
    this.nome = nome?.trim() ?? "";
    this.unidade = unidade?.trim() ?? "";
    this.preco = Number(preco) || 0;
    this.quantidade = Number(quantidade) || 0;
    this.minimo = Number(minimo) || 0;
    this.maximo = Number(maximo) || 0;
    this.categoriaId = Number(categoriaId) || null;
  }

  verificarEstoque() {
    if (this.quantidade < this.minimo) {
      return `Quantidade abaixo do mínimo (${this.minimo}).`;
    }
    if (this.quantidade > this.maximo) {
      return `Quantidade acima do máximo (${this.maximo}).`;
    }
    return "Quantidade dentro do intervalo definido.";
  }
}

export default Produto;

