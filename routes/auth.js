import express from 'express';
import pool from '../db.js';
import jwt from 'jsonwebtoken';
 
const router = express.Router();
 
// POST /api/auth/login
// Body: { email, password }
// Nota: atualmente compararemos senha em texto simples (conforme indicado).
// Recomendo fortemente salvar senhas com bcrypt e migrar depois.
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email e password são obrigatórios' });
    }
 
    // Procura o utilizador na tabela `alunos` (conforme informado).
    const result = await pool.query('SELECT * FROM alunos WHERE email = $1 LIMIT 1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
 
    const user = result.rows[0];
 
    // Suporta colunas `password` ou `senha` — adapta conforme o esquema da BD.
    const stored = user.password ?? user.senha ?? null;
 
    // Comparação (texto simples). Se armazenar hash, substitua por bcrypt.compare.
    if (!stored || stored !== password) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
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