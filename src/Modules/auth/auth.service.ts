import { generateToken } from "../../Utils/jwt.js";
import { handleError } from "../../Utils/error.js"
import { LoginResponse } from "../../Utils/types.js"
import bcrypt from "bcryptjs";
import { Sessoes, Aluno, ProgressoAluno } from "../../Models/index.js";
import { JogadorTempoService } from "../jogadorTempo/jogTem.service.js";

export class AuthService {

    static async login(email: string, password: string): Promise<LoginResponse> {

        try {
            const user = await Aluno.findOne({
                where: { email }
            });

            if (!user) {
                throw new Error('Credenciais inválidas');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                throw new Error("Password inválida");
            }

            await ProgressoAluno.findOrCreate({
                where: { aluno_id: user.id },
                defaults: {
                    xp: 0,
                    nivel_atual: 1,
                    coins: 0,
                    streak: 0,
                    tempo_total_jogo: 0,
                    mapa_atual: 1,
                    ultimo_login: new Date()
                }
            });

            await ProgressoAluno.update(
                { ultimo_login: new Date() },
                { where: { aluno_id: user.id } }
            );

            const token = generateToken({
                id: user.id,
                email: user.email
            });

            await Sessoes.create({
                aluno_id: user.id,
                inicio: new Date(),
                fim: null,
                duracao: 0
            })

            const progresso = await ProgressoAluno.findByPk(user.id, {
                attributes: ["ultimo_dia_streak", "streak_dias"]
            })

            const hoje = new Date()
            const hojeString = hoje.toISOString().split("T")[0];

            if (progresso) {
                const ultimoDia = progresso.ultimo_dia_streak
                    ? new Date(progresso.ultimo_dia_streak)
                    : null;

                let novoStreak = progresso.streak_dias || 0

                if (ultimoDia) {
                    const ontem = new Date(ultimoDia)
                    ontem.setDate(ontem.getDate() - 1)

                    const ultimoDiaString = ultimoDia.toISOString().split("T")[0];
                    const ontemString = ontem.toISOString().split("T")[0];

                    if (ultimoDiaString === hojeString) {

                    } 
                    else if (ultimoDiaString === ontemString) {
                        novoStreak += 1
                    }
                    else {
                        novoStreak = 1
                    }
                }
                else {
                    novoStreak = 1
                }

                await ProgressoAluno.update({
                    ultimo_dia_streak: hoje,
                    streak_dias: novoStreak
                }, { where: { aluno_id: user.id } })
            }

            const userJson = user.toJSON();

            const { password: _p, ...userSemPassword } = userJson;

            return { token, user: userSemPassword as any };
        } catch (error) {
            throw handleError("Erro ao fazer login", error)
        }
    }

    static async logout(alunoId: number) {

        try {

            const sessao = await Sessoes.findOne({
                where: {
                    aluno_id: alunoId,
                    fim: null
                },
                order: [["inicio", "DESC"]]
            });

            if (!sessao) {
                throw new Error("Sessão não encontrada");
            }

            const agora = new Date();

            const duracao = Math.floor(
                (agora.getTime() - new Date(sessao.inicio).getTime())
                / 1000
                / 60
            );

            if (duracao <= 0) {
                throw new Error("Sessão inválida");
                return;
            }

            await sessao.update({
                fim: agora,
                duracao
            });

            await JogadorTempoService.updateUserTempo(alunoId, duracao);

            return {
                message: "Logout realizado com sucesso",
                duracao
            };

        } catch (error) {

            throw handleError(
                "Erro ao fazer logout",
                error
            );
        }
    }
}