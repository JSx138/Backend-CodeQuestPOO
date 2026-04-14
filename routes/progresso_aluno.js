// routes/progresso.js
import express from 'express';
import pool from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware JWT
const verificarToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token não fornecido' });

    try {
        const secret = process.env.JWT_SECRET || 'trocar_este_secret_em_producao';
        const decoded = jwt.verify(token, secret);
        req.alunoId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido', details: err.message });
    }
};

// -------------------
// GET progresso detalhado do aluno e mapas com progresso
// -------------------
router.get('/', verificarToken, async (req, res) => {
    try {
        const alunoId = req.alunoId;

        // 1. Busca progresso do aluno
        const progressResult = await pool.query(
            'SELECT * FROM progresso_aluno WHERE aluno_id = $1',
            [alunoId]
        );
        const progress = progressResult.rows[0] || { mapa_atual: 1, nivel_atual: 1, xp: 0 };

        // 2. Busca todos os mapas
        const mapasResult = await pool.query('SELECT id, nome, ordem FROM mapas ORDER BY ordem');
        const mapas = mapasResult.rows;

        // 3. Desafios realmente completados pelo aluno
        const desafiosCompletosPorMapa = await pool.query(
            `SELECT n.mapa_id, COUNT(DISTINCT dd.desafio_id) as total
             FROM desempenho_desafio dd
             JOIN desafios d ON dd.desafio_id = d.id
             JOIN niveis n ON d.nivel_id = n.id
             WHERE dd.aluno_id = $1
             GROUP BY n.mapa_id`,
            [alunoId]
        );

        // Transforma em mapa { mapa_id: total }
        const completosPorMapa = {};
        for (const row of desafiosCompletosPorMapa.rows) {
            completosPorMapa[row.mapa_id] = parseInt(row.total);
        }

        // 4. Total de desafios por mapa
        const totaisPorMapaResult = await pool.query(
            `SELECT mapa_id, SUM(total_desafios) as total FROM niveis GROUP BY mapa_id`
        );
        const totaisPorMapa = {};
        for (const row of totaisPorMapaResult.rows) {
            totaisPorMapa[row.mapa_id] = parseInt(row.total);
        }

        // 5. Monta a resposta
        const mapasProgresso = [];

        for (const m of mapas) {
            const totalDesafiosMapa = totaisPorMapa[m.id] || 0;
            const desafiosCompletos = completosPorMapa[m.id] || 0;
            const porcentagem = totalDesafiosMapa === 0
                ? 0
                : Math.min((desafiosCompletos / totalDesafiosMapa) * 100, 100);

            const mapaAnterior = mapasProgresso.find(mp => mp.mapa === m.id - 1);
            const desbloqueado = m.id === 1 || (mapaAnterior && mapaAnterior.porcentagem === 100);

            mapasProgresso.push({
                mapa: m.id,
                nome: m.nome,
                ordem: m.ordem,
                total_desafios: totalDesafiosMapa,
                desafios_completos: desafiosCompletos,
                porcentagem,
                desbloqueado,
            });
        }

        res.json(mapasProgresso);

    } catch (err) {
        console.error('[Progresso GET] ❌ Erro:', err);
        res.status(500).json({ error: err.message });
    }
});

// -------------------
// GET dashboard com stats gerais do aluno (XP total, nível atual, coins, streak, tempo total de jogo, etc)
// -------------------
router.get('/dashboard', verificarToken, async (req, res) => {
    try {
        const alunoId = req.alunoId;

        // 1️⃣ Busca progresso do aluno
        const progressResult = await pool.query(
            'SELECT * FROM progresso_aluno WHERE aluno_id = $1',
            [alunoId]
        );
        const progress = progressResult.rows[0];

        if (!progress) {
            return res.json({
                xp_total: 0,
                nivel_atual: 1,
                coins: 0,
                streak: 0,
                tempo_total_jogo: 0,
                desafios_completos: 0,
                total_desafios: 0,
                porcentagem_completa: 0,
            });
        }

        // 2️⃣ Busca todos os mapas e calcula totais
        const mapasResult = await pool.query('SELECT id FROM mapas ORDER BY ordem');
        const mapas = mapasResult.rows;

        let totalDesafios = 0;
        let desafiosCompletos = 0;

        for (const m of mapas) {
            // Busca todos os níveis do mapa
            const niveisResult = await pool.query(
                'SELECT id, nivel, total_desafios FROM niveis WHERE mapa_id = $1 ORDER BY nivel',
                [m.id]
            );
            const niveis = niveisResult.rows;

            for (const n of niveis) {
                totalDesafios += n.total_desafios;

                // Conta desafios completados:
                // 1️⃣ Se o aluno já passou do mapa → todos os desafios completos
                if (progress.mapa_atual > m.id) {
                    desafiosCompletos += n.total_desafios;
                }
                // 2️⃣ Se o aluno está no mapa atual → soma os níveis antes do nível atual
                else if (progress.mapa_atual === m.id) {
                    if (n.nivel < progress.nivel_atual) {
                        desafiosCompletos += n.total_desafios;
                    }
                    // ⚡ opcional: se você armazenar quantos desafios do nível atual foram feitos,
                    // você pode somar aqui para mostrar progresso parcial do nível
                }
            }
        }

        const porcentagemCompleta = totalDesafios === 0 ? 0 : Math.min((desafiosCompletos / totalDesafios) * 100, 100);

        res.json({
            xp_total: progress.xp || 0,
            nivel_atual: progress.nivel_atual || 1,
            coins: progress.coins || 0,
            streak: progress.streak || 0,
            tempo_total_jogo: progress.tempo_total_jogo || 0 || 0,
            desafios_completos: desafiosCompletos,
            total_desafios: totalDesafios,
            porcentagem_completa: porcentagemCompleta,
        });

    } catch (err) {
        console.error('[Progresso Dashboard] ❌ Erro:', err);
        res.status(500).json({ error: err.message });
    }

});

export default router;