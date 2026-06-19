import { Request, Response } from "express";
import { MentoresService } from "./mentores.service.js";

export const getAllMentores = async (req: Request, res: Response) => {
    try {
        const mentores = await MentoresService.getAll();
        res.json(mentores);
    } catch (error) {
        console.error("ERRO ", error);
        return res.status(500).json({
            message: "Erro ao buscar mentores"
        });
    }
};

export const getMentorById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new Error("ID inválido");
        }

        const mentor = await MentoresService.getById(Number(id));
        res.json(mentor);

    } catch (error) {
        console.error("ERRO ", error);
        return res.status(500).json({
            message: "Erro ao buscar mentor por ID"
        });
    }
};

export const getMentorAluno = async (req: Request, res: Response) => {
    try {
        const alunoId = Number(req.alunoId!);

        if (!alunoId) {
            throw new Error("ID do aluno inválido");
        }

        const mentor = await MentoresService.getMentorAluno(Number(alunoId));
        res.json(mentor);

    } catch (error) {
        console.error("ERRO ", error);
        return res.status(500).json({
            message: "Erro ao buscar mentor do aluno"
        });
    }
};

export const getMentorReaction = async (req: Request, res: Response) => {
    try {
        const { mentorId } = req.params;

        if (!mentorId) {
            throw new Error("ID do mentor inválido");
        }

        const mentorReaction = await MentoresService.getMentorReaction(Number(mentorId));
        res.json(mentorReaction);

    } catch (error) {
        console.error("ERRO ", error);
        return res.status(500).json({
            message: "Erro ao buscar reações do mentor"
        });
    }
};

export const escolherHeroi = async (req: Request, res: Response) => {
    try {
        const { mentorId } = req.params;
        const alunoId = Number(req.alunoId!);

        if (!mentorId || !alunoId) {
            throw new Error("ID do mentor ou aluno inválido");
        }

        const heroiEscolhido = await MentoresService.escolherHeroi(Number(mentorId), alunoId);
        res.json(heroiEscolhido);

    } catch (error) {
        console.error("ERRO ", error);
        return res.status(500).json({
            message: "Erro ao escolher mentor"
        });
    }
}

export const trocarMentor = async (req: Request, res: Response) => {
    try {
        const novoMentorId = Number(req.params.novoMentorId);
        const alunoId = Number(req.alunoId!);

        if (
            !Number.isInteger(novoMentorId) ||
            !Number.isInteger(alunoId)
        ) {
            return res.status(400).json({
                message: "IDs inválidos"
            });
        }

        const mentorTrocado = await MentoresService.trocarMentor(
            novoMentorId,
            alunoId
        );

        return res.status(200).json(mentorTrocado);

    } catch (error: any) {
        console.error(error);

        return res.status(500).json({
            message: error.message || "Erro ao trocar mentor"
        });
    }
};