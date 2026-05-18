import { Request, Response } from "express";
import { ProgressoService } from "./progressao.service.js"
import { AuthRequest } from '../../Middlewares/auth.middleware.js';

export const getProgessoDoAlunoPorMapa = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const alunoId = req.alunoId!

        if (isNaN(alunoId)) {
            res.status(400).json({ message: "alunoId inválido" });
            return;
        }

        const progresso = await ProgressoService.getProgressoPorMapas(alunoId)
        res.json(progresso)

    } catch (error) {
        console.error("[ProgressoController] getProgessoDoAlunoPorMapa:", error);
        res.status(500).json({ message: "Erro ao obter progresso" });
    }
}

export const getDashboardAluno = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const alunoId = req.alunoId!

        if (isNaN(alunoId)) {
            res.status(400).json({ message: "alunoId inválido" });
            return;
        }

        const dashboardAluno = await ProgressoService.getDashboard(alunoId)
        res.json(dashboardAluno)
        
    } catch (error) {
        console.error("[ProgressoController] getDashboardAluno:", error);
        res.status(500).json({ message: "Erro ao obter dashboard" });
    }

}