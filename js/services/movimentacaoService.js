import db from '../storage/database.js';
import produtoService from './produtoService.js';

const movimentacaoService = {
  async listar() {
    await db.init();
    return db.query(`
      SELECT 
        m.*,
        p.nome as produto_nome,
        p.unidade as produto_unidade
      FROM movimentacoes m
      LEFT JOIN produtos p ON m.produto_id = p.id
      ORDER BY m.data DESC
    `);
  },

  async buscarPorProduto(produtoId) {
    await db.init();
    return db.query(`
      SELECT 
        m.*,
        p.nome as produto_nome,
        p.unidade as produto_unidade
      FROM movimentacoes m
      LEFT JOIN produtos p ON m.produto_id = p.id
      WHERE m.produto_id = ?
      ORDER BY m.data DESC
    `, [produtoId]);
  },

  async registrarEntrada(produtoId, quantidade, observacao = '') {
    await db.init();
    
    if (quantidade <= 0) {
      throw new Error('Quantidade deve ser maior que zero');
    }

    // Buscar produto
    const produto = await produtoService.buscarPorId(produtoId);
    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    // Atualizar quantidade do produto
    const novaQuantidade = produto.quantidade + quantidade;
    db.execute('UPDATE produtos SET quantidade = ? WHERE id = ?', [novaQuantidade, produtoId]);

    // Registrar movimentação
    const result = db.execute(`
      INSERT INTO movimentacoes (produto_id, tipo, quantidade, observacao)
      VALUES (?, 'Entrada', ?, ?)
    `, [produtoId, quantidade, observacao]);

    // Verificar estoque
    const produtoAtualizado = await produtoService.buscarPorId(produtoId);
    const status = await produtoService.verificarEstoque(produtoAtualizado);

    return {
      movimentacao: {
        id: result.lastId,
        produto_id: produtoId,
        tipo: 'Entrada',
        quantidade,
        observacao
      },
      produto: produtoAtualizado,
      status
    };
  },

  async registrarSaida(produtoId, quantidade, observacao = '') {
    await db.init();
    
    if (quantidade <= 0) {
      throw new Error('Quantidade deve ser maior que zero');
    }

    // Buscar produto
    const produto = await produtoService.buscarPorId(produtoId);
    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    // Verificar se há estoque suficiente
    if (produto.quantidade < quantidade) {
      throw new Error(`Estoque insuficiente. Disponível: ${produto.quantidade} ${produto.unidade}`);
    }

    // Atualizar quantidade do produto
    const novaQuantidade = produto.quantidade - quantidade;
    db.execute('UPDATE produtos SET quantidade = ? WHERE id = ?', [novaQuantidade, produtoId]);

    // Registrar movimentação
    const result = db.execute(`
      INSERT INTO movimentacoes (produto_id, tipo, quantidade, observacao)
      VALUES (?, 'Saída', ?, ?)
    `, [produtoId, quantidade, observacao]);

    // Verificar estoque
    const produtoAtualizado = await produtoService.buscarPorId(produtoId);
    const status = await produtoService.verificarEstoque(produtoAtualizado);

    return {
      movimentacao: {
        id: result.lastId,
        produto_id: produtoId,
        tipo: 'Saída',
        quantidade,
        observacao
      },
      produto: produtoAtualizado,
      status
    };
  },

  async deletar(id) {
    await db.init();
    
    // Buscar movimentação antes de deletar
    const mov = db.query('SELECT * FROM movimentacoes WHERE id = ?', [id]);
    if (!mov || mov.length === 0) {
      throw new Error('Movimentação não encontrada');
    }

    const movimentacao = mov[0];

    // Reverter a quantidade no produto
    const produto = await produtoService.buscarPorId(movimentacao.produto_id);
    if (produto) {
      const ajuste = movimentacao.tipo === 'Entrada' 
        ? -movimentacao.quantidade 
        : movimentacao.quantidade;
      
      const novaQuantidade = produto.quantidade + ajuste;
      db.execute('UPDATE produtos SET quantidade = ? WHERE id = ?', [
        novaQuantidade,
        movimentacao.produto_id
      ]);
    }

    // Deletar movimentação
    db.execute('DELETE FROM movimentacoes WHERE id = ?', [id]);
    
    return true;
  }
};

export default movimentacaoService;
