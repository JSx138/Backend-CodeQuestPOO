import pool from '../../Config/db';
import { handleError } from '../../Utils/error';
import { calcularXpGanho, calcularNivel } from '../../Utils/xpSystem';
import { ConcluirDesafioDTO, ConcluirDesafioResponse, DesempenhoXP } from '../../Utils/types';

export class DesafiosService {

    static async getDesempenho(alunoId: number): Promise<DesempenhoXP> {
        try {
            const result = await pool.query(
                'SELECT xp FROM progresso_aluno WHERE aluno_id = $1',
                [alunoId]
            );

            if (!result.rows.length) return { xp: 0, progressao: calcularNivel(0) };

            const xp = result.rows[0].xp;
            const progressao = calcularNivel(xp);

            return { xp, progressao };
        } catch (error) {
            throw handleError('Erro ao buscar desempenho', error);
        }
    }

    static async concluirDesafio(
        alunoId: number,
        desafioId: number,
        dados: ConcluirDesafioDTO
    ): Promise<ConcluirDesafioResponse> {
        try {
            const {
                respostas_certas = 0,
                respostas_erradas = 0,
                ajudas_usadas = 0,
                tempo_desafio = 0,
                score = 0,
                tipo_erro_id = null,
                tipo_feedback_id = null,
                feedback_ia = null,
            } = dados;

            const desafioResult = await pool.query(
                `SELECT d.*, 
                 n.id as nivel_id, 
                 n.total_desafios, 
                 n.xp_recompensa,
                 n.mapa_id
                FROM desafios d
                JOIN niveis n ON d.nivel_id = n.id
                WHERE d.id = $1`,
                [desafioId]
            );

            const desafio = desafioResult.rows[0];
            if (!desafio) throw new Error('Desafio não encontrado');

            const registoResult = await pool.query(
                'SELECT tentativas FROM desempenho_desafio WHERE aluno_id = $1 AND desafio_id = $2',
                [alunoId, desafioId]
            );

            const primeiraVez = registoResult.rows.length === 0;

            if (primeiraVez) {
                await pool.query(
                    `INSERT INTO desempenho_desafio 
           (aluno_id, desafio_id, respostas_certas, respostas_erradas, tentativas, ajudas_usadas, tempo_desafio, score, tipo_erro_id, tipo_feedback_id, feedback_ia)
           VALUES ($1,$2,$3,$4,1,$5,$6,$7,$8,$9,$10)`,
                    [alunoId, desafioId, respostas_certas, respostas_erradas, ajudas_usadas, tempo_desafio, score, tipo_erro_id, tipo_feedback_id, feedback_ia]
                );
            } else {
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

            const xpDesafio = calcularXpGanho(desafio.xp_recompensa, primeiraVez);

            let xpNivel = 0;
            let nivelCompleto = false;

            if (primeiraVez) {
                const concluidosResult = await pool.query(
                    `SELECT COUNT(DISTINCT dd.desafio_id) as total
           FROM desempenho_desafio dd
           JOIN desafios d ON dd.desafio_id = d.id
           WHERE dd.aluno_id = $1 AND d.nivel_id = $2`,
                    [alunoId, desafio.nivel_id]
                );

                const totalConcluidos = parseInt(concluidosResult.rows[0].total);

                if (totalConcluidos >= desafio.total_desafios) {
                    xpNivel = desafio.xp_recompensa;
                    nivelCompleto = true;
                }
            }

            const xpTotal = xpDesafio + xpNivel;
            await pool.query(
                'UPDATE progresso_aluno SET xp = xp + $1 WHERE aluno_id = $2',
                [xpTotal, alunoId]
            );

            const progressoResult = await pool.query(
                'SELECT xp FROM progresso_aluno WHERE aluno_id = $1',
                [alunoId]
            );
            const progressao = calcularNivel(progressoResult.rows[0].xp);

            let proximoNivel = null;

            if (nivelCompleto) {
                const proximoNivelResult = await pool.query(
                    `SELECT n.id, n.nivel, n.xp_recompensa,
           json_agg(
             json_build_object(
               'id', d.id,
               'titulo', d.nome,
               'descricao', d.descricao,
               'xp_recompensa', d.xp_recompensa,
               'ordem', d.ordem
             ) ORDER BY d.ordem
           ) as desafios
           FROM niveis n
           LEFT JOIN desafios d ON d.nivel_id = n.id
           WHERE n.mapa_id = $1
           AND n.nivel = (SELECT nivel + 1 FROM niveis WHERE id = $2)
           GROUP BY n.id, n.nivel, n.xp_recompensa`,
                    [desafio.mapa_id, desafio.nivel_id]
                );

                proximoNivel = proximoNivelResult.rows[0] ?? null;
            }

            const nivelMaximo = nivelCompleto && !proximoNivel;

            let streak = 0;

            if (respostas_erradas === 0) {
                await pool.query(
                    'UPDATE progresso_aluno SET streak = streak + 1 WHERE aluno_id = $1',
                    [alunoId]
                )
                const streakResult = await pool.query(
                    'SELECT streak FROM progresso_aluno WHERE aluno_id = $1',
                    [alunoId]
                )
                streak = streakResult.rows[0].streak
            } else {
                await pool.query(
                    'UPDATE progresso_aluno SET streak = 0 WHERE aluno_id = $1',
                    [alunoId]
                )
                const streakResult = await pool.query(
                    'SELECT streak FROM progresso_aluno WHERE aluno_id = $1',
                    [alunoId]
                )
                streak = streakResult.rows[0].streak
            }

            return {
                sucesso: true,
                primeiraVez,
                xpGanho: { desafio: xpDesafio, nivelBonus: xpNivel, total: xpTotal },
                nivelCompleto,
                nivelMaximo,
                proximoNivel,
                progressao,
                novoStreak: streak,
            };

        } catch (error) {
            throw handleError('Erro ao concluir desafio', error);
        }
    }
}