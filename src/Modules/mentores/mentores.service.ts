import {
    Mentores,
    Aluno
} from "../../Models/index.js";
import { handleError } from "../../Utils/error.js";

export class MentoresService {

    static async getAll() {
        try {
            return await Mentores.findAll({
                where: { ativo: true },
                attributes: [
                    "id",
                    "nome",
                    "descricao",
                    "imagem",
                    "imagem_certo",
                    "imagem_errado",
                    "imagem_duvida",
                    "reacao_padrao"
                ],
                order: [["nome", "ASC"]],
            });
        } catch (error) {
            throw handleError("Erro ao buscar mentores", error);
        }
    }

    static async getById(id: number) {
        try {
            const mentor = await Mentores.findByPk(id, {
                attributes: [
                    "id",
                    "nome",
                    "descricao",
                    "imagem",
                    "imagem_certo",
                    "imagem_errado",
                    "imagem_duvida",
                    "reacao_padrao"
                ],
            });

            if (!mentor) {
                throw new Error("Mentor não encontrado");
            }

            return mentor;
        } catch (error) {
            throw handleError("Erro ao buscar mentor por ID", error);
        }
    }

    static async getMentorAluno(alunoId: number) {
        try {
            const aluno = await Aluno.findByPk(alunoId);

            if (!aluno) {
                throw new Error("Aluno não encontrado");
            }

            if (!aluno.mentor_id) {
                throw new Error("Aluno não possui mentor associado");
            }

            const mentorDoAluno = await Mentores.findByPk(aluno.mentor_id, {
                attributes: [
                    "id",
                    "nome",
                    "descricao",
                    "imagem",
                    "imagem_certo",
                    "imagem_errado",
                    "imagem_duvida",
                    "reacao_padrao"
                ],
            });

            if (!mentorDoAluno) {
                throw new Error("Mentor do aluno não encontrado");
            }

            return mentorDoAluno;

        } catch (error) {
            throw handleError("Erro ao buscar mentor do aluno", error);
        }
    }

    static async getMentorReaction(mentorId: number) {
        try {
            const mentor = await Mentores.findByPk(mentorId, {
                attributes: [
                    "id",
                    "nome",
                    "imagem",
                    "imagem_certo",
                    "imagem_errado",
                    "imagem_duvida",
                    "reacao_padrao"
                ],
            });

            if (!mentor) {
                throw new Error("Mentor não encontrado");
            }

            return mentor;

        } catch (error) {
            throw handleError("Erro ao buscar reações do mentor", error);
        }
    }

    static async escolherHeroi(mentorId: number, alunoId: number) {
        try {
            const mentor = await Mentores.findByPk(mentorId);
            const aluno = await Aluno.findByPk(alunoId);

            if (!mentor || !aluno) {
                throw new Error("Mentor ou aluno não encontrado");
            }

            const heroiEscolhido = await Aluno.update({
                mentor_id: mentorId
            }, {
                where: {
                    id: alunoId
                }
            });

            return heroiEscolhido;

        } catch (error) {
            throw handleError("Erro ao escolher mentor", error);
        }
    }

    static async trocarMentor(novoMentorId: number, alunoId: number) {
        try {
            const mentor = await Mentores.findByPk(novoMentorId);

            if (!mentor) {
                throw new Error("Mentor não encontrado");
            }

            const aluno = await Aluno.findByPk(alunoId);

            if (!aluno) {
                throw new Error("Aluno não encontrado");
            }

            if (aluno.mentor_id === novoMentorId) {
                throw new Error("O mentor atual já é o escolhido");
            }

            await aluno.update({
                mentor_id: novoMentorId
            });

            return aluno;

        } catch (error) {
            throw handleError("Erro ao trocar mentor", error);
        }
    }
}