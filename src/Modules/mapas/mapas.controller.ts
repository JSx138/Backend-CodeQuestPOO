import { Request, Response } from "express";
import { MapasService } from "./mapas.service"

export const getMapas = async (req: Request, res: Response): Promise<void> => {
    try {
        const mapas = await MapasService.getAll()

        res.json(mapas)
    } catch (error) {
        console.error("[MapasController] getMapas:", error);
        res.status(500).json({ message: "Erro ao obter mapas" });
    }
}