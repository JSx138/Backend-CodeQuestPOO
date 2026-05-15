import { Response, Request } from "express";
import { TempoService } from "./tempo.service"
import { AuthRequest } from '../../Middlewares/auth.middleware';

export const registarTempo = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const alunoId = req.alunoId!
        const tempo = Number(req.body.tempo);


        if (isNaN(alunoId) || isNaN(tempo)) {
            res.status(400).json({ message: "Campos inválido" });
            return;
        }

        const result = await TempoService.registarTempo(alunoId, tempo)

        res.json(result)
    } catch (error) {
        console.error("[TempoController] RegistarTempo:", error);
        res.status(500).json({ message: "Erro ao obter tempo" });
    }

}