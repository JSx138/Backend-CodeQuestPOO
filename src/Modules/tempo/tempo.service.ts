import { handleError } from '../../Utils/error.js';
import TempoNivel from '../../Models/TempoNivel/tempoNivel.js';

export class TempoService {

    static async registarTempo(alunoId: number, tempo: number): Promise<void> {
        try {

            if (!tempo || tempo <= 0 || tempo > 86400) {
                throw new Error('Tempo inválido');
            }

            await TempoNivel.increment(
                { tempo_total: tempo },
                {
                    where: {
                        aluno_id: alunoId
                    }
                }
            );

        } catch (error) {
            throw handleError('Erro ao registar tempo', error);
        }
    }
}