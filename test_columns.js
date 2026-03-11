import pool from './db.js';

try {
  const result = await pool.query(`
    SELECT * FROM information_schema.columns 
    WHERE table_name = 'progresso_aluno'
    ORDER BY ordinal_position;
  `);
  
  console.log('===== COLUNAS ENCONTRADAS =====');
  result.rows.forEach(col => {
    console.log(col.column_name);
  });
  console.log('===============================');
  
  process.exit(0);
} catch (err) {
  console.error('ERRO:', err.message);
  process.exit(1);
}
