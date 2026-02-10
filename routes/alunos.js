import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all alunos
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM alunos');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get aluno by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM alunos WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Aluno não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create aluno
router.post('/', async (req, res) => {
    try {
        const { utilizador_id, ano, turma, escola } = req.body;
        const result = await pool.query(
            'INSERT INTO alunos (utilizador_id, ano, turma, escola) VALUES ($1, $2, $3, $4) RETURNING *',
            [utilizador_id, ano, turma, escola]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update aluno
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { ano, turma, escola } = req.body;
        const result = await pool.query(
            'UPDATE alunos SET ano = $1, turma = $2, escola = $3 WHERE id = $4 RETURNING *',
            [ano, turma, escola, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Aluno não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete aluno
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM alunos WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Aluno não encontrado' });
        }
        res.json({ message: 'Aluno eliminado com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
