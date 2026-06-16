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
        const { alunoId } = req.params;

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