import express from 'express';
import pool from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// POST /api/auth/login
// Body: { email, password }
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email e password são obrigatórios' });
    }

    // Procura o utilizador na tabela `alunos`
    const result = await pool.query(
      'SELECT * FROM alunos WHERE email = $1 LIMIT 1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const user = result.rows[0];

    // Suporta colunas `password` ou `senha`
    const stored = user.password ?? user.senha ?? null;

    if (!stored || stored !== password) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verifica se existe um registo de progresso, caso contrário cria
    const progressoCheck = await pool.query(
      'SELECT 1 FROM progresso_aluno WHERE aluno_id = $1',
      [user.id] // Certifica-te que a coluna na tabela `alunos` é mesmo `id`
    );

    if (progressoCheck.rows.length === 0) {
      await pool.query(
        `INSERT INTO progresso_aluno 
         (aluno_id, xp, nivel_atual, coins, streak, tempo_total_jogo, mapa_atual, ultimo_login)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [user.id, 0, 1, 0, 0, 0, 1]
      );
    }

    const payload = { id: user.id, email: user.email };
    const secret = process.env.JWT_SECRET || 'trocar_este_secret_em_producao';
    const token = jwt.sign(payload, secret, { expiresIn: '12h' });

    // Não devolvemos a password ao cliente
    delete user.password;
    delete user.senha;

    res.json({ token, user });
  } catch (err) {
    console.error('Erro /api/auth/login:', err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

export default router;