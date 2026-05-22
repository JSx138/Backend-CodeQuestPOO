import { handleError } from '../../Utils/error.js';
import { calcularXpGanho, calcularNivel } from '../../Utils/xpSystem.js';
import { calcularCoinsGanho } from '../../Utils/coinsSystem.js';
import { ConcluirDesafioDTO, ConcluirDesafioResponse, DesempenhoXP } from '../../Utils/types.js';
import ProgressoAluno from '../../Models/ProgressoAluno/progressoAluno.js';
import Desafio from '../../Models/Desafio/desafio.js';
import Nivel from '../../Models/Nivel/nivel.js';
import DesempenhoDesafio from '../../Models/DesempenhoDesafio/desempenhoDesafio.js';
import { TempoService } from '../tempo/tempo.service.js';

export class DesafiosService {

    static async getDesempenho(alunoId: number): Promise<DesempenhoXP> {
        try {
            const progresso = await ProgressoAluno.findOne({
                where: { aluno_id: alunoId }
            });

            if (!progresso) return { xp: 0, progressao: calcularNivel(0) };

            const xp = progresso.xp;
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

            const desafio = await Desafio.findByPk(desafioId, {
                include: [{
                    model: Nivel,
                    as: 'nivel'
                }]
            });

            if (!desafio || !desafio.nivel) throw new Error('Desafio não encontrado');

            const [desempenho, created] = await DesempenhoDesafio.findOrCreate({
                where: { aluno_id: alunoId, desafio_id: desafioId },
                defaults: {
                    aluno_id: alunoId,
                    desafio_id: desafioId,
                    respostas_certas,
                    respostas_erradas,
                    tentativas: 1,
                    ajudas_usadas,
                    tempo_desafio,
                    score,
                    tipo_erro_id,
                    tipo_feedback_id,
                    feedback_ia
                }
            });

            const primeiraVez = created;

            if (!primeiraVez) {
                await desempenho.update({
                    tentativas: desempenho.tentativas + 1,
                    respostas_certas,
                    respostas_erradas,
                    ajudas_usadas,
                    tempo_desafio,
                    score,
                    tipo_erro_id,
                    tipo_feedback_id,
                    feedback_ia,
                    data_execucao: new Date()
                });
            }

            const xpDesafio = calcularXpGanho(desafio.xp_recompensa, primeiraVez);
            const coinsDesafio = calcularCoinsGanho(desafio.coins_recompensa, primeiraVez);

            let xpNivel = 0;
            let coinsNivel = 0;
            let nivelCompleto = false;

            if (primeiraVez) {
                const totalConcluidos = await DesempenhoDesafio.count({
                    include: [{
                        model: Desafio,
                        where: { nivel_id: desafio.nivel_id }
                    }],
                    where: { aluno_id: alunoId }
                });

                if (totalConcluidos >= desafio.nivel.total_desafios) {
                    xpNivel = desafio.nivel.xp_recompensa;
                    coinsNivel = desafio.nivel.coins_recompensa;
                    nivelCompleto = true;

                    const desempenhosNivel = await DesempenhoDesafio.findAll({
                        include: [{
                            model: Desafio,
                            where: {
                                nivel_id: desafio.nivel_id
                            }
                        }],
                        where: {
                            aluno_id: alunoId
                        }
                    });

                    const tempoTotalNivel = desempenhosNivel.reduce(
                        (total, desempenho) => 
                            total + (desempenho.tempo_desafio ?? 0),
                        0
                    );

                    await TempoService.registarTempo(
                        alunoId,
                        desafio.nivel_id,
                        tempoTotalNivel,
                    );
                }
            }

            const xpTotal = xpDesafio + xpNivel;
            const coinsTotal = coinsDesafio + coinsNivel;
            await ProgressoAluno.increment(
                {
                    xp: xpTotal,
                    coins: coinsTotal,
                    tempo_total_jogo: tempo_desafio
                },
                { where: { aluno_id: alunoId } }
            );

            const progresso = await ProgressoAluno.findOne({ where: { aluno_id: alunoId } });
            const progressao = calcularNivel(progresso?.xp || 0);

            let proximoNivel = null;

            if (nivelCompleto) {
                proximoNivel = await Nivel.findOne({
                    where: {
                        mapa_id: desafio.nivel.mapa_id,
                        nivel: desafio.nivel.nivel + 1
                    },
                    include: [{
                        model: Desafio,
                        as: 'desafios'
                    }]
                });
            }

            const nivelMaximo = nivelCompleto && !proximoNivel;

            let streak = 0;

            if (dados.novo_streak !== undefined) {
                await ProgressoAluno.update(
                    { streak: dados.novo_streak },
                    { where: { aluno_id: alunoId } }
                );
                streak = Number(dados.novo_streak || 0);
            }

            if (progresso && nivelCompleto) {
                const nivelAtualAluno = progresso.nivel_atual;
                const mapaAtualAluno = progresso.mapa_atual;

                const proximoNivel = await Nivel.findOne({
                    where: {
                        mapa_id: mapaAtualAluno,
                        nivel: nivelAtualAluno + 1
                    }
                });

                if (proximoNivel) {
                    await progresso.update({
                        nivel_atual: nivelAtualAluno + 1
                    });
                    await progresso.reload();
                }
                else {
                    await progresso.update({
                        mapa_atual: mapaAtualAluno + 1,
                        nivel_atual: 1
                    });
                }
            }

            return {
                sucesso: true,
                primeiraVez,
                xpGanho: { desafio: xpDesafio, nivelBonus: xpNivel, total: xpTotal },
                coinsGanho: { desafio: coinsDesafio, nivelBonus: coinsNivel, total: coinsTotal },
                nivelCompleto,
                nivelMaximo,
                proximoNivel: proximoNivel ? proximoNivel.get({ plain: true }) : null,
                progressao,
                novoStreak: streak,
            };

        } catch (error) {
            throw handleError('Erro ao concluir desafio', error);
        }
    }
}