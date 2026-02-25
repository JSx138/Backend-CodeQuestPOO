import express from 'express';
import pool from '../db.js';

const router = express.Router();

// -------------------
// GET all alunos
// -------------------
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alunos ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------
// POST create aluno
// -------------------
router.post('/', async (req, res) => {
  try {
    const {
      nome, email, password, numero, turma, escola, ano,
      ano_letivo, avatar_id, heroi_id
    } = req.body;

    const result = await pool.query(
      `INSERT INTO alunos 
      (nome,email,password,numero,turma,escola,ano,ano_letivo,avatar_id,heroi_id) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [nome,email,password,numero,turma,escola,ano,ano_letivo,avatar_id,heroi_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;