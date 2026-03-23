import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /mapas → retorna todos os mapas ordenados por 'ordem'
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, nome, descricao, ordem FROM mapas ORDER BY ordem'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('[Mapas GET] ❌ Erro:', err);
        res.status(500).json({ error: err.message });
    }
});

export default router;