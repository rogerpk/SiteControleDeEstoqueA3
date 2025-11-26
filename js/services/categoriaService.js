import db from '../storage/database.js';

const categoriaService = {
  async listar() {
    await db.init();
    return db.query('SELECT * FROM categorias ORDER BY nome');
  },

  async buscarPorId(id) {
    await db.init();
    const results = db.query('SELECT * FROM categorias WHERE id = ?', [id]);
    return results[0] || null;
  },

  async criar(categoria) {
    await db.init();
    
    // Validações
    if (!categoria.nome || !categoria.tamanho || !categoria.embalagem) {
      throw new Error('Todos os campos são obrigatórios');
    }

    const result = db.execute(
      'INSERT INTO categorias (nome, tamanho, embalagem) VALUES (?, ?, ?)',
      [categoria.nome, categoria.tamanho, categoria.embalagem]
    );

    return { ...categoria, id: result.lastId };
  },

  async atualizar(id, categoria) {
    await db.init();
    
    // Validações
    if (!categoria.nome || !categoria.tamanho || !categoria.embalagem) {
      throw new Error('Todos os campos são obrigatórios');
    }

    db.execute(
      'UPDATE categorias SET nome = ?, tamanho = ?, embalagem = ? WHERE id = ?',
      [categoria.nome, categoria.tamanho, categoria.embalagem, id]
    );

    return { id, ...categoria };
  },

  async deletar(id) {
    await db.init();
    
    // Verificar se há produtos usando esta categoria
    const produtos = db.query('SELECT COUNT(*) as total FROM produtos WHERE categoria_id = ?', [id]);
    if (produtos[0].total > 0) {
      throw new Error('Não é possível excluir categoria com produtos associados');
    }

    db.execute('DELETE FROM categorias WHERE id = ?', [id]);
    return true;
  }
};

export default categoriaService;
