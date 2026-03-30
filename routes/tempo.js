import express from 'express';
import pool from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// ===============================
// Middleware JWT
// ===============================
const verificarToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token)
        return res.status(401).json({ error: 'Token não fornecido' });

    try {
        const secret = process.env.JWT_SECRET || 'trocar_este_secret_em_producao';
        const decoded = jwt.verify(token, secret);

        req.alunoId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({
            error: 'Token inválido',
            details: err.message
        });
    }
};

// ===============================
// POST /api/tempo 
// ===============================
router.post('/', async (req, res) => {
    // Verificação de token (header ou body para sendBeacon)
    let token = req.headers.authorization?.split(' ')[1];
    let body = req.body;
    if (typeof body === "string") {
        try { body = JSON.parse(body); } catch { body = {}; }
    }
    const { tempo, token: bodyToken } = body;

    if (!token) {
        token = req.body.token;
        if (token) {
            req.headers.authorization = `Bearer ${token}`;
        }
    }
    if (!token) return res.status(401).json({ error: 'Token não fornecido' });

    try {
        const secret = process.env.JWT_SECRET || 'trocar_este_secret_em_producao';
        const decoded = jwt.verify(token, secret);
        req.alunoId = decoded.id;
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido' });
    }

    try {
        const alunoId = req.alunoId;
        const { tempo } = req.body;

        if (!tempo || tempo <= 0 || tempo > 300) {
            return res.status(400).json({ error: 'Tempo inválido' });
        }

        await pool.query(
            `
            UPDATE progresso_aluno
            SET tempo_total_jogo = tempo_total_jogo + $1
            WHERE aluno_id = $2
            `,
            [tempo, alunoId]
        );

        res.json({ success: true });

    } catch (err) {
        console.error('[Tempo Jogo] ❌', err);
        res.status(500).json({ error: err.message });
    }

    const tempoHoras = tempo / 3600; 
    await pool.query(
        `UPDATE progresso_aluno
     SET tempo_total_jogo = tempo_total_jogo + $1
     WHERE aluno_id = $2`,
        [tempoHoras, alunoId]
    );
});

export default router;