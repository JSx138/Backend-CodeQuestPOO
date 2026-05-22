import { handleError } from '../../Utils/error.js';
import { TempoNivel, Nivel, Mapa } from '../../Models/index.js';

export class TempoService {

    static async registarTempo(
        alunoId: number,
        nivelId: number,
        tempoNivel: number,
    ): Promise<void> {

        try {

            if (!tempoNivel || tempoNivel <= 0 || tempoNivel > 86400) {
                throw new Error('Tempo inválido');
            }

            const registo = await TempoNivel.findOne({
                where: {
                    aluno_id: alunoId,
                    nivel_id: nivelId
                },
            });

            if (!registo) {

                await TempoNivel.create({
                    aluno_id: alunoId,
                    nivel_id: nivelId,
                    tempo_total: tempoNivel,
                    tempo_primeira_conclusao: tempoNivel,
                    melhor_tempo: tempoNivel,
                    tentativas: 1
                });

                return;
            }

            const melhorTempoAtual = registo.melhor_tempo ?? tempoNivel;
            const tempoTotal = registo.tempo_total ?? 0;

            const melhorTempo =
                tempoNivel < melhorTempoAtual
                    ? tempoNivel
                    : melhorTempoAtual;

            await registo.update({
                tempo_total: tempoTotal + tempoNivel,
                melhor_tempo: melhorTempo,
                tentativas: tempoTotal + 1
            });

        } catch (error) {
            throw handleError('Erro ao registar tempo', error);
        }
    }

    static async listarTempoTotalNiveis(alunoId: number) {
        try {
            const niveis = await TempoNivel.findAll({
                where: {
                    aluno_id: alunoId
                },
                attributes: [
                    "tempo_total",
                    "tempo_primeira_conclusao",
                    "melhor_tempo",
                    "tentativas"
                ],
                include: [{
                    model: Nivel,
                    as: 'nivel',
                    attributes: ["nivel", "nome", "descricao"],
                    include: [{
                        model: Mapa,
                        as: 'mapa',
                        attributes: ["nome"]
                    }]
                }]
            })
            return niveis
        } catch (error) {
            throw handleError('Erro ao listar tempo total', error);
        }
    }
}