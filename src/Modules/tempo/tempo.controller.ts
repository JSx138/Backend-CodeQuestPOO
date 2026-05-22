import { Response, Request } from "express";
import { TempoService } from "./tempo.service.js"
import { AuthRequest } from '../../Middlewares/auth.middleware.js';

export const registarTempo = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const alunoId = req.alunoId!
        const tempo = Number(req.body.tempo);


        if (isNaN(alunoId) || isNaN(tempo)) {
            res.status(400).json({ message: "Campos inválido" });
            return;
        }

        const result = await TempoService.registarTempo(alunoId, tempo, req.body.nivelId)
        res.json(result)
    } catch (error) {
        console.error("[TempoController] RegistarTempo:", error);
        res.status(500).json({ message: "Erro ao obter tempo" });
    }
}

export const mostrarTempo = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const alunoId = req.alunoId!

        if (isNaN(alunoId)) {
            res.status(400).json({ message: "Campos inválido" });
            return;
        }

        const listar = await TempoService.listarTempoTotalNiveis(alunoId)
        res.json(listar)
    } catch (error) {
        console.error("[TempoController] RegistarTempo:", error);
        res.status(500).json({ message: "Erro ao obter tempo" });
    }
}