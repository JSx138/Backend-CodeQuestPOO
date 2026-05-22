import { JogadorTempo, Aluno, Sessoes, HistoricoTempoSemanal } from "../../Models/index.js"
import { Op } from "sequelize";
import { handleError } from "../../Utils/error.js"

export class JogadorTempoService {

    static diasAteReset(ultimoReset: Date): number {
        const hoje = new Date();
        const diasDecorridos = Math.floor(
            (hoje.getTime() - new Date(ultimoReset).getTime()) / (1000 * 60 * 60 * 24)
        );
        return Math.max(0, 7 - diasDecorridos);
    }

    static async getUserTempo(alunoId: number) {
        try {
            const getUser = await Aluno.findByPk(alunoId, {
                attributes: ["id", "nome", "email"]
            })

            if (!getUser) {
                throw new Error("Jogador não encontrado")
            }
            await this.resetarSemanal(alunoId)

            const getTempo = await JogadorTempo.findOne({
                where: {
                    aluno_id: alunoId
                },
                attributes: [
                    "horas_semana",
                    "max_tempo_dia",
                    "tempo_total",
                    "ultima_semana_reset"
                ],
            })

            const atividade_semana = await this.calcularAtividadeSemanal(alunoId);
            const diasAte = this.diasAteReset(getTempo?.ultima_semana_reset || new Date());

            return {
                getTempo: {
                    horas_semana: getTempo?.horas_semana || 0,
                    max_tempo_dia: getTempo?.max_tempo_dia || 0,
                    tempo_total: getTempo?.tempo_total || 0,
                    ultimoAtualizado: getTempo?.ultima_semana_reset || null,
                    diasAteReset: diasAte, 
                    atividade_semana
                },
                getUser
            }

        } catch (error) {
            throw handleError("Erro ao buscar tempo do jogador", error)
        }
    }

    private static async calcularAtividadeSemanal(alunoId: number) {
        try {
            const umaSemanaAtras = new Date();
            umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7);

            const sessoes = await Sessoes.findAll({
                where: {
                    aluno_id: alunoId,
                    created_at: {
                        [Op.gte]: umaSemanaAtras
                    }
                },
                raw: true
            });

            const atividade = [0, 0, 0, 0, 0, 0, 0];

            // agrupa por dia da semana
            sessoes.forEach(sessao => {
                const date = new Date(sessao.created_at);
                const dayOfWeek = date.getDay(); // 0=dom, 1=seg, etc

                const duracao = sessao.duracao || 0;
                atividade[dayOfWeek] += duracao;
            });

            return atividade;

        } catch (error) {
            console.error("Erro ao calcular atividade semanal:", error);
            return [0, 0, 0, 0, 0, 0, 0];
        }
    }

    static passouSemana(ultimoReset: Date): boolean {
        const hoje = new Date();
        const diasDecorridos = Math.floor(
            (hoje.getTime() - new Date(ultimoReset).getTime()) / (1000 * 60 * 60 * 24)
        );
        return diasDecorridos >= 7;
    }

    static async resetarSemanal(alunoId: number) {
        try {
            const tempo = await JogadorTempo.findOne({
                where: { aluno_id: alunoId }
            });

            if (!tempo) {
                throw new Error("Jogador não encontrado");
            }

            // Se passou 7 dias, reseta e guarda historico na tabela HistoricoTempoSemanal
            if (this.passouSemana(tempo.ultima_semana_reset)) {

                await HistoricoTempoSemanal.create({
                    aluno_id: alunoId,
                    tempo_semana: tempo.horas_semana,
                    semana_inicio: tempo.ultima_semana_reset,
                    semana_fim: new Date()
                });

                console.log(`Histórico guardado para aluno ${alunoId}: ${tempo.horas_semana} minutos`)

                await tempo.update({
                    horas_semana: 0,
                    ultima_semana_reset: new Date()
                });

                console.log(`✅ Reset semanal para aluno ${alunoId}`);

                return {
                    resetado: true,
                    message: "Semana resetada",
                    historico_guardado: {
                        tempo: tempo.horas_semana,
                        inicio: tempo.ultima_semana_reset,
                        fim: new Date()
                    }
                };
            }

            return {
                resetado: false,
                message: "Ainda não passou uma semana",
                diasAteReset: this.diasAteReset(tempo.ultima_semana_reset)
            };

        } catch (error) {
            throw handleError("Erro ao resetar semana", error);
        }
    }

    static async updateUserTempo(alunoId: number, duracaoMinutos: number) {
        try {
            const [tempo, created] = await JogadorTempo.findOrCreate({
                where: { aluno_id: alunoId },
                defaults: {
                    aluno_id: alunoId,
                    horas_semana: 0,
                    max_tempo_dia: 0,
                    tempo_total: 0
                }
            });

            if (!tempo) {
                throw new Error("Jogador não encontrado")
            }


            const agora = new Date()

            const novoTempoTotal = tempo.tempo_total + duracaoMinutos;
            const novaHorasSemana = tempo.horas_semana + duracaoMinutos

            await tempo.update({
                tempo_total: novoTempoTotal,
                horas_semana: novaHorasSemana,
                updated_at: agora
            })

            return {
                tempo_total: novoTempoTotal,
                horas_semana: novaHorasSemana,
                created
            };

        } catch (error) {
            throw handleError("Erro ao atualizar tempo do jogador", error)
        }
    }

    static async getHistoricoSemanal(alunoId: number) {
        try {
            const historico = await HistoricoTempoSemanal.findAll({
                where: {
                    aluno_id: alunoId
                },
                attributes: [
                    "tempo_semana",
                    "semana_inicio",
                    "semana_fim"
                ],
                order: [
                    ['semana_inicio', 'DESC']
                ],
                raw: true,
            })

            return historico
        } catch (error) {
            handleError("Erro ao buscar histórico semanal", error)
        }
    }
}