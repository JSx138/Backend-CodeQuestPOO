import pool from '../../Config/db';
import { handleError } from '../../Utils/error';

export class TempoService {

    static async registarTempo(alunoId: number, tempo: number): Promise<void> {
        try {

            if (!tempo || tempo <= 0 || tempo > 86400) {
                throw new Error('Tempo inválido');
            }

            await pool.query(
                `UPDATE progresso_aluno 
                SET tempo_total_jogo = tempo_total_jogo + $1 
                WHERE aluno_id = $2`,
                [tempo, alunoId]
            );

        } catch (error) {
            throw handleError('Erro ao registar tempo', error);
        }
    }
}