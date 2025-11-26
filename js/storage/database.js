// Database.js - SQLite no navegador usando SQL.js
class Database {
  constructor() {
    this.db = null;
    this.SQL = null;
    this.isReady = false;
  }

  async init() {
    if (this.isReady) return;

    // Carregar SQL.js
    const config = {
      locateFile: filename => `https://cdn.jsdelivr.net/npm/sql.js@1.8.0/dist/${filename}`
    };
    
    this.SQL = await initSqlJs(config);
    
    // Tentar carregar banco existente do localStorage
    const savedDb = localStorage.getItem('estoque_db');
    if (savedDb) {
      const uint8Array = this.base64ToUint8Array(savedDb);
      this.db = new this.SQL.Database(uint8Array);
      console.log('✅ Banco de dados carregado do localStorage');
    } else {
      // Criar novo banco
      this.db = new this.SQL.Database();
      this.createSchema();
      this.seedData();
      console.log('✅ Novo banco de dados criado');
    }

    this.isReady = true;
  }

  createSchema() {
    const schema = `
      -- Tabela de Categorias
      CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        tamanho TEXT NOT NULL,
        embalagem TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Tabela de Produtos
      CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        unidade TEXT NOT NULL,
        preco REAL NOT NULL,
        quantidade INTEGER NOT NULL DEFAULT 0,
        minimo INTEGER NOT NULL,
        maximo INTEGER NOT NULL,
        categoria_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (categoria_id) REFERENCES categorias(id)
      );

      -- Tabela de Movimentações
      CREATE TABLE IF NOT EXISTS movimentacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        produto_id INTEGER NOT NULL,
        tipo TEXT NOT NULL CHECK(tipo IN ('Entrada', 'Saída')),
        quantidade INTEGER NOT NULL,
        observacao TEXT,
        data DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (produto_id) REFERENCES produtos(id)
      );

      -- Índices para performance
      CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria_id);
      CREATE INDEX IF NOT EXISTS idx_movimentacoes_produto ON movimentacoes(produto_id);
      CREATE INDEX IF NOT EXISTS idx_movimentacoes_data ON movimentacoes(data);
    `;

    this.db.run(schema);
    this.save();
  }

  seedData() {
    // Dados iniciais de exemplo
    const seed = `
      -- Categorias iniciais
      INSERT INTO categorias (nome, tamanho, embalagem) VALUES 
        ('Alimentícios', 'Médio', 'Plástico'),
        ('Refrigerante', 'Pequeno', 'Lata'),
        ('Higiene', 'Pequeno', 'Vidro');

      -- Produtos iniciais
      INSERT INTO produtos (nome, unidade, preco, quantidade, minimo, maximo, categoria_id) VALUES 
        ('Coca-Cola', 'uni', 3.50, 20, 10, 50, 2),
        ('Macarrão', 'uni', 10.00, 10, 10, 50, 1),
        ('Papel Higiênico', 'pacote', 20.00, 50, 10, 100, 3);
    `;

    this.db.run(seed);
    this.save();
  }

  // Salvar banco no localStorage
  save() {
    const data = this.db.export();
    const base64 = this.uint8ArrayToBase64(data);
    localStorage.setItem('estoque_db', base64);
  }

  // Executar query SELECT
  query(sql, params = []) {
    try {
      const stmt = this.db.prepare(sql);
      stmt.bind(params);
      
      const results = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();
      
      return results;
    } catch (error) {
      console.error('Erro na query:', error);
      throw error;
    }
  }

  // Executar query INSERT/UPDATE/DELETE
  execute(sql, params = []) {
    try {
      this.db.run(sql, params);
      this.save();
      return { success: true, lastId: this.getLastInsertId() };
    } catch (error) {
      console.error('Erro ao executar:', error);
      throw error;
    }
  }

  getLastInsertId() {
    const result = this.query('SELECT last_insert_rowid() as id');
    return result[0].id;
  }

  // Helpers para conversão Base64
  uint8ArrayToBase64(uint8Array) {
    let binary = '';
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
  }

  base64ToUint8Array(base64) {
    const binary = atob(base64);
    const len = binary.length;
    const uint8Array = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      uint8Array[i] = binary.charCodeAt(i);
    }
    return uint8Array;
  }

  // Limpar banco (útil para testes)
  async reset() {
    localStorage.removeItem('estoque_db');
    this.db.close();
    this.db = new this.SQL.Database();
    this.createSchema();
    this.seedData();
    console.log('🔄 Banco resetado');
  }
}

// Instância global do banco
const db = new Database();

export default db;

