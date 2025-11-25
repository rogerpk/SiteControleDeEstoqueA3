class Categoria {
  constructor({ id, nome, tamanho, embalagem }) {
    this.id = Number(id);
    this.nome = nome?.trim() ?? "";
    this.tamanho = tamanho?.trim() ?? "";
    this.embalagem = embalagem?.trim() ?? "";
  }
}

export default Categoria;

