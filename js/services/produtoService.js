import db from '../storage/database.js';

const produtoService = {
  async listar() {
    await db.init();
    return db.query(`
      SELECT 
        p.*,
        c.nome as categoria_nome
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      ORDER BY p.nome
    `);
  },

  async buscarPorId(id) {
    await db.init();
    const results = db.query(`
      SELECT 
        p.*,
        c.nome as categoria_nome
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.id = ?
    `, [id]);
    return results[0] || null;
  },

  async criar(produto) {
    await db.init();
    
    // Validações
    if (!produto.nome || produto.preco === undefined || produto.quantidade === undefined) {
      throw new Error('Nome, preço e quantidade são obrigatórios');
    }

    if (produto.preco < 0) {
      throw new Error('Preço não pode ser negativo');
    }

    if (produto.minimo > produto.maximo) {
      throw new Error('Mínimo não pode ser maior que máximo');
    }

    const result = db.execute(`
      INSERT INTO produtos (nome, unidade, preco, quantidade, minimo, maximo, categoria_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      produto.nome,
      produto.unidade,
      produto.preco,
      produto.quantidade,
      produto.minimo,
      produto.maximo,
      produto.categoria_id
    ]);

    return await this.buscarPorId(result.lastId);
  },

  async atualizar(id, produto) {
    await db.init();
    
    // Validações
    if (!produto.nome || produto.preco === undefined || produto.quantidade === undefined) {
      throw new Error('Nome, preço e quantidade são obrigatórios');
    }

    if (produto.preco < 0) {
      throw new Error('Preço não pode ser negativo');
    }

    if (produto.minimo > produto.maximo) {
      throw new Error('Mínimo não pode ser maior que máximo');
    }

    db.execute(`
      UPDATE produtos 
      SET nome = ?, unidade = ?, preco = ?, quantidade = ?, minimo = ?, maximo = ?, categoria_id = ?
      WHERE id = ?
    `, [
      produto.nome,
      produto.unidade,
      produto.preco,
      produto.quantidade,
      produto.minimo,
      produto.maximo,
      produto.categoria_id,
      id
    ]);

    return await this.buscarPorId(id);
  },

  async deletar(id) {
    await db.init();
    
    // Deletar movimentações associadas primeiro
    db.execute('DELETE FROM movimentacoes WHERE produto_id = ?', [id]);
    db.execute('DELETE FROM produtos WHERE id = ?', [id]);
    
    return true;
  },

  async filtrar(filtros = {}) {
    await db.init();
    
    let sql = `
      SELECT 
        p.*,
        c.nome as categoria_nome
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (filtros.nome) {
      sql += ' AND p.nome LIKE ?';
      params.push(`%${filtros.nome}%`);
    }

    if (filtros.categoria_id) {
      sql += ' AND p.categoria_id = ?';
      params.push(filtros.categoria_id);
    }

    sql += ' ORDER BY p.nome';

    return db.query(sql, params);
  },

  async verificarEstoque(produto) {
    if (produto.quantidade < produto.minimo) {
      return {
        status: 'baixo',
        mensagem: `Estoque BAIXO: ${produto.nome} está com ${produto.quantidade} unidades (mínimo: ${produto.minimo})`
      };
    }

    if (produto.quantidade > produto.maximo) {
      return {
        status: 'alto',
        mensagem: `Estoque ALTO: ${produto.nome} está com ${produto.quantidade} unidades (máximo: ${produto.maximo})`
      };
    }

    return {
      status: 'ok',
      mensagem: `Estoque OK: ${produto.nome} está com ${produto.quantidade} unidades`
    };
  },

  async listarForaDoRange() {
    await db.init();
    return db.query(`
      SELECT 
        p.*,
        c.nome as categoria_nome,
        CASE 
          WHEN p.quantidade < p.minimo THEN 'baixo'
          WHEN p.quantidade > p.maximo THEN 'alto'
        END as status
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.quantidade < p.minimo OR p.quantidade > p.maximo
      ORDER BY p.nome
    `);
  },

  async relatorioBalanco() {
    await db.init();
    return db.query(`
      SELECT 
        p.*,
        c.nome as categoria_nome,
        (p.quantidade * p.preco) as valor_total
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      ORDER BY p.nome
    `);
  },

  async relatorioPorCategoria() {
    await db.init();
    return db.query(`
      SELECT 
        c.nome as categoria,
        COUNT(p.id) as quantidade
      FROM categorias c
      LEFT JOIN produtos p ON c.id = p.categoria_id
      GROUP BY c.id, c.nome
      ORDER BY c.nome
    `);
  },

  async reajustarPreco(id, percentual) {
    await db.init();
    
    const produto = await this.buscarPorId(id);
    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    const novoPreco = produto.preco * (1 + percentual / 100);
    
    if (novoPreco < 0) {
      throw new Error('O novo preço não pode ser negativo');
    }

    db.execute('UPDATE produtos SET preco = ? WHERE id = ?', [novoPreco, id]);
    
    return await this.buscarPorId(id);
  }
};

export default produtoService;
