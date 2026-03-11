import pool from './db.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkColumns() {
  try {
    // Listar colunas da tabela progresso_aluno
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'progresso_aluno'
      ORDER BY ordinal_position;
    `);
    
    console.log('Colunas da tabela progresso_aluno:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error('Erro:', err.message);
    process.exit(1);
  }
}

checkColumns();
