// routes/desafios.js
import express from 'express';
import pool from '../db.js';
import jwt from 'jsonwebtoken';
import { calcularXpGanho, calcularNivel } from '../utils/xpSystem.js';

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
// GET desempenho do aluno
// -------------------
router.get('/', verificarToken, async (req, res) => {
    const alunoId = req.alunoId;

    try {
        // busca XP do aluno
        const result = await pool.query(
            'SELECT xp FROM progresso_aluno WHERE aluno_id = $1',
            [alunoId]
        );

        if (!result.rows.length) {
            return res.json({ xp: 0 });
        }

        const xp = result.rows[0].xp;

        // calcula nível
        const progressao = calcularNivel(xp);

        res.json({
            xp,
            progressao
        });

    } catch (err) {
        console.error('[GET Desempenho] ❌', err);
        res.status(500).json({ error: err.message });
    }
});
// -------------------
// POST concluir desafio
// -------------------
router.post('/concluir/:desafioId', verificarToken, async (req, res) => {
    const alunoId = req.alunoId;
    const { desafioId } = req.params;

    // Dados que o frontend envia no body
    const {
        respostas_certas = 0,
        respostas_erradas = 0,
        ajudas_usadas = 0,
        tempo_desafio = 0,
        score = 0,
        tipo_erro_id = null,
        tipo_feedback_id,
        feedback_ia = null,
    } = req.body;

    try {
        // 1. Busca o desafio + dados do nível ao qual pertence
        const desafioResult = await pool.query(
            `SELECT d.*, 
                    n.id as nivel_id, 
                    n.total_desafios, 
                    n.xp_recompensa
             FROM desafios d
             JOIN niveis n ON d.nivel_id = n.id
             WHERE d.id = $1`,
            [desafioId]
        );

        const desafio = desafioResult.rows[0];
        if (!desafio) return res.status(404).json({ error: 'Desafio não encontrado' });

        // 2. Verifica se já existe registo deste desafio para este aluno
        const registoResult = await pool.query(
            'SELECT tentativas FROM desempenho_desafio WHERE aluno_id = $1 AND desafio_id = $2',
            [alunoId, desafioId]
        );

        const jaExiste = registoResult.rows.length > 0;
        const primeiraVez = !jaExiste;

        // 3. Cria ou atualiza o registo na desempenho_desafio
        if (!jaExiste) {
            // Primeira vez → INSERT
            await pool.query(
                `INSERT INTO desempenho_desafio 
                    (aluno_id, desafio_id, respostas_certas, respostas_erradas, tentativas, ajudas_usadas, tempo_desafio, score, tipo_erro_id, tipo_feedback_id, feedback_ia)
                 VALUES ($1, $2, $3, $4, 1, $5, $6, $7, $8, $9, $10)`,
                [alunoId, desafioId, respostas_certas, respostas_erradas, ajudas_usadas, tempo_desafio, score, tipo_erro_id, tipo_feedback_id, feedback_ia]
            );
        } else {
            // Repetição → UPDATE (incrementa tentativas e atualiza os dados)
            await pool.query(
                `UPDATE desempenho_desafio SET
                    tentativas = tentativas + 1,
                    respostas_certas = $3,
                    respostas_erradas = $4,
                    ajudas_usadas = $5,
                    tempo_desafio = $6,
                    score = $7,
                    tipo_erro_id = $8,
                    tipo_feedback_id = $9,
                    feedback_ia = $10,
                    data_execucao = CURRENT_TIMESTAMP
                 WHERE aluno_id = $1 AND desafio_id = $2`,
                [alunoId, desafioId, respostas_certas, respostas_erradas, ajudas_usadas, tempo_desafio, score, tipo_erro_id, tipo_feedback_id, feedback_ia]
            );
        }

        // 4. Calcula XP ganho pelo desafio
        const xpDesafio = calcularXpGanho(desafio.xp_recompensa, primeiraVez);

        // 5. Verifica se completou o nível inteiro (só conta na primeira vez)
        let xpNivel = 0;
        let nivelCompleto = false;

        if (primeiraVez) {
            const concluidosResult = await pool.query(
                `SELECT COUNT(*) as total
                 FROM desempenho_desafio dd
                 JOIN desafios d ON dd.desafio_id = d.id
                 WHERE dd.aluno_id = $1 AND d.nivel_id = $2`,
                [alunoId, desafio.nivel_id]
            );

            const totalConcluidos = parseInt(concluidosResult.rows[0].total);

            if (totalConcluidos === desafio.total_desafios) {
                xpNivel = desafio.xp_recompensa;
                nivelCompleto = true;
            }
        }

        // 6. Atualiza XP total na progresso_aluno
        const xpTotal = xpDesafio + xpNivel;

        await pool.query(
            'UPDATE progresso_aluno SET xp = xp + $1 WHERE aluno_id = $2',
            [xpTotal, alunoId]
        );

        // 7. Busca XP atualizado e calcula nível do herói
        const progressoResult = await pool.query(
            'SELECT xp FROM progresso_aluno WHERE aluno_id = $1',
            [alunoId]
        );

        const progressao = calcularNivel(progressoResult.rows[0].xp);

        // 8. Responde ao frontend
        res.json({
            sucesso: true,
            primeiraVez,
            xpGanho: {
                desafio: xpDesafio,
                nivelBonus: xpNivel,
                total: xpTotal,
            },
            nivelCompleto,
            progressao,
        });

    } catch (err) {
        console.error('[Desafio Concluir] ❌ Erro:', err);
        res.status(500).json({ error: err.message });
    }
    // 6. Atualiza XP total na progresso_aluno
const xpTotal = xpDesafio + xpNivel;

await pool.query(
    'UPDATE progresso_aluno SET xp = xp + $1 WHERE aluno_id = $2',
    [xpTotal, alunoId]
);

// ✅ NOVO — Lógica de avanço de nível e mapa
if (primeiraVez) {

    // Busca progresso atual do aluno
    const progressoAtual = await pool.query(
        'SELECT mapa_atual, nivel_atual FROM progresso_aluno WHERE aluno_id = $1',
        [alunoId]
    );
    const { mapa_atual, nivel_atual } = progressoAtual.rows[0];

    // Conta quantos desafios do nível atual o aluno já completou
    const desafiosNivelResult = await pool.query(
        `SELECT COUNT(*) as total
         FROM desempenho_desafio dd
         JOIN desafios d ON dd.desafio_id = d.id
         WHERE dd.aluno_id = $1 AND d.nivel_id = $2`,
        [alunoId, desafio.nivel_id]
    );
    const desafiosFeitos = parseInt(desafiosNivelResult.rows[0].total);

    // Completou todos os desafios deste nível?
    if (desafiosFeitos >= desafio.total_desafios) {

        // Verifica se existe próximo nível no mesmo mapa
        const proximoNivelResult = await pool.query(
            `SELECT id FROM niveis 
             WHERE mapa_id = $1 AND nivel = $2`,
            [desafio.mapa_id, nivel_atual + 1]
        );

        if (proximoNivelResult.rows.length > 0) {
            // ✅ Avança para o próximo nível
            await pool.query(
                'UPDATE progresso_aluno SET nivel_atual = nivel_atual + 1 WHERE aluno_id = $1',
                [alunoId]
            );
            console.log(`✅ Aluno ${alunoId} avançou para nível ${nivel_atual + 1}`);

        } else {
            // Verifica se existe próximo mapa
            const proximoMapaResult = await pool.query(
                `SELECT id FROM mapas WHERE ordem = (
                    SELECT ordem + 1 FROM mapas WHERE id = $1
                )`,
                [mapa_atual]
            );

            if (proximoMapaResult.rows.length > 0) {
                const proximoMapaId = proximoMapaResult.rows[0].id;

                // ✅ Avança para o próximo mapa, nível 1
                await pool.query(
                    'UPDATE progresso_aluno SET mapa_atual = $1, nivel_atual = 1 WHERE aluno_id = $2',
                    [proximoMapaId, alunoId]
                );
                console.log(`✅ Aluno ${alunoId} avançou para mapa ${proximoMapaId}`);

            } else {
                console.log(`🏆 Aluno ${alunoId} completou o jogo!`);
            }
        }
    }
}
});

export default router;
