const STORAGE_KEYS = {
  produtos: "estoque_produtos",
  categorias: "estoque_categorias",
  movimentacoes: "estoque_movimentacoes",
};

function getCollection(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Erro ao ler localStorage", key, error);
    return [];
  }
}

function saveCollection(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function nextId(key) {
  const items = getCollection(key);
  if (!items.length) return 1;
  const ids = items.map((item) => Number(item.id) || 0);
  return Math.max(...ids) + 1;
}

function seedIfEmpty() {
  const categorias = getCollection(STORAGE_KEYS.categorias);
  if (!categorias.length) {
    const seedCategorias = [
      { id: 1, nome: "Alimentícios", tamanho: "Médio", embalagem: "Plástico" },
      { id: 2, nome: "Refrigerantes", tamanho: "Pequeno", embalagem: "Lata" },
      { id: 3, nome: "Higiene", tamanho: "Pequeno", embalagem: "Vidro" },
    ];
    saveCollection(STORAGE_KEYS.categorias, seedCategorias);
  }

  const produtos = getCollection(STORAGE_KEYS.produtos);
  if (!produtos.length) {
    const seedProdutos = [
      {
        id: 1,
        nome: "Coca-Cola",
        unidade: "uni",
        preco: 3.5,
        quantidade: 20,
        minimo: 10,
        maximo: 50,
        categoriaId: 2,
      },
      {
        id: 2,
        nome: "Macarrão",
        unidade: "uni",
        preco: 10,
        quantidade: 10,
        minimo: 10,
        maximo: 50,
        categoriaId: 1,
      },
      {
        id: 3,
        nome: "Papel higiênico",
        unidade: "pacote",
        preco: 20,
        quantidade: 50,
        minimo: 10,
        maximo: 100,
        categoriaId: 3,
      },
    ];
    saveCollection(STORAGE_KEYS.produtos, seedProdutos);
  }

  const movimentacoes = getCollection(STORAGE_KEYS.movimentacoes);
  if (!movimentacoes.length) {
    saveCollection(STORAGE_KEYS.movimentacoes, []);
  }
}

export { STORAGE_KEYS, getCollection, saveCollection, nextId, seedIfEmpty };

