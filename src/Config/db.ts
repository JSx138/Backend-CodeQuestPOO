import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.on('error', (err: Error) => {
  console.error('Erro na conexão com a base de dados:', err);
});

pool.connect()
  .then(client => {
    console.log("✅ Ligação à base de dados bem sucedida!");
    client.release();
  })
  .catch(err => {
    console.error("❌ Erro ao ligar à base de dados:", err.message);
  });

export default pool;