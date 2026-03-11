import express from 'express';
import pool from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// -------------------
// Middleware JWT
// -------------------
const verificarToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        console.log("[JWT] ❌ Token não fornecido");
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'trocar_este_secret_em_producao';
        const decoded = jwt.verify(token, secret);
        console.log("[JWT] ✅ Token válido para aluno ID:", decoded.id);
        req.alunoId = decoded.id;
        next();
    } catch (err) {
        console.error("[JWT] ❌ Token inválido:", err.message);
        res.status(401).json({ error: 'Token inválido', details: err.message });
    }
};

// -------------------
// GET progresso do aluno logado
// -------------------
router.get('/', verificarToken, async (req, res) => {
    try {
        const alunoId = req.alunoId;
        console.log(`[Progresso GET] Procurando progresso para aluno ID: ${alunoId}`);

        const result = await pool.query(
            'SELECT * FROM progresso_aluno WHERE aluno_id = $1',
            [alunoId]
        );

        console.log(`[Progresso GET] Resultado da query:`, result.rows.length > 0 ? result.rows[0] : "Nenhuma linha");

        if (result.rows.length === 0) {
            console.log(`[Progresso GET] Sem registos - retornando valores padrão`);
            return res.json({
                aluno_id: alunoId,
                xp: 0,
                xp_total: 0,
                xp_proximo_nivel: 3000,
                nivel_atual: 1,
                dias_seguidos: 0,
                dicas_usadas: 0,
                desafios_completos: 0,
                acertos: 0,
                precisao: 0,
                total_erros: 0,
                coins: 0,
                streak: 0,
                mapa_atual: 1
            });
        }

        const row = result.rows[0];

        // Mapeia precisao → acertos para compatibilidade com o Dashboard
        res.json({
            ...row,
            acertos: row.precisao ?? 0
        });

    } catch (err) {
        console.error("[Progresso GET] ❌ Erro:", err);
        res.status(500).json({ error: err.message });
    }
});

// -------------------
// POST criar progresso do aluno
// -------------------
router.post('/', async (req, res) => {
    try {
        const {
            aluno_id,
            mapa_atual = 1,
            nivel_atual = 1,
            xp = 0,
            coins = 0,
            streak = 0,
            tempo_total_jogo = 0
        } = req.body;

        const result = await pool.query(
            `INSERT INTO progresso_aluno 
            (aluno_id, mapa_atual, nivel_atual, xp, coins, streak, tempo_total_jogo, ultimo_login) 
            VALUES ($1,$2,$3,$4,$5,$6,$7, NOW())
            RETURNING *`,
            [aluno_id, mapa_atual, nivel_atual, xp, coins, streak, tempo_total_jogo]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("[Progresso POST] ❌ Erro:", err);
        res.status(500).json({ error: err.message });
    }
});

// -------------------
// PUT atualizar XP do aluno logado
// -------------------
router.put('/', verificarToken, async (req, res) => {
    try {
        const alunoId = req.alunoId;
        const { xp } = req.body;

        if (xp === undefined) {
            return res.status(400).json({ error: 'XP é obrigatório' });
        }

        const result = await pool.query(
            'UPDATE progresso_aluno SET xp = $1 WHERE aluno_id = $2 RETURNING *',
            [xp, alunoId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Progresso não encontrado' });
        }

        const row = result.rows[0];
        res.json({
            ...row,
            acertos: row.precisao ?? 0
        });

    } catch (err) {
        console.error("[Progresso PUT] ❌ Erro:", err);
        res.status(500).json({ error: err.message });
    }
});
// -------------------
// PUT atualizar Coins do aluno logado
// -------------------

router.put('/coins', verificarToken, async (req, res) => {
    try {
        const alunoId = req.alunoId;
        const { coins } = req.body;

        if (coins === undefined) {
            return res.status(400).json({ error: 'Coins é obrigatório' });
        }

        const result = await pool.query(
            'UPDATE progresso_aluno SET coins = $1 WHERE aluno_id = $2 RETURNING *',
            [coins, alunoId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Progresso não encontrado' });
        }

        const row = result.rows[0];
        res.json({
            ...row,
            acertos: row.precisao ?? 0
        });

    } catch (err) {
        console.error("[Progresso PUT Coins] ❌ Erro:", err);
        res.status(500).json({ error: err.message });
    }
});

// -------------------
// GET ranking de XP
// -------------------
// Atualizar coins após completar um desafio
const atualizarCoins = async (novasCoins) => {
    const response = await fetch('/api/progresso/coins', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ coins: novasCoins })
    });
    return await response.json();
};
router.get('/ranking', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT a.id, a.nome, p.xp, p.xp_total, p.nivel_atual 
            FROM progresso_aluno p 
            JOIN alunos a ON p.aluno_id = a.id 
            ORDER BY p.xp_total DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error("[Progresso Ranking] ❌ Erro:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;