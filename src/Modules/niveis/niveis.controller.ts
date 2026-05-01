import { Request, Response } from "express";
import { NiveisService } from "./niveis.service";

export const nivel = async (req: Request, res: Response): Promise<void> => {
    try {
        const mapaId = Number(req.params.mapaId)

        if (isNaN(mapaId)) {
            res.status(400).json({ message: "mapaId inválido" });
            return;
        }

        const niveis = await NiveisService.getByMapa(mapaId)

        res.json(niveis)

    } catch (error) {
        console.error("[NiveisController] getNiveisByMapa:", error);
        res.status(500).json({ message: "Erro ao obter níveis" });
    }
}