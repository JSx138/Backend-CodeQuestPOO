import { Request, Response } from "express";
import { LeaderBoard } from "./leaderBoard.service.js"

export const getGlobalLeaderboardBestTime = async (req: Request, res: Response) => {
    try {
        const leaderBoard = await LeaderBoard.getGlobalLeaderboardBestTime();
        res.json(leaderBoard);
    } catch (error) {
        return res.status(500).json({ 
          message: "Erro ao buscar leaderboard global por tempo" 
        });
    }
}

export const getLeaderboardByMapaNivelDesafio = async (req: Request, res: Response) => {
    try {
        const {
            mapaId,
            nivelId,
            desafioId
        } = req.params;

        if (
            !mapaId ||
            !nivelId ||
            !desafioId
        ) {
            throw new Error("IDs inválidos");
        }

        const leaderBoard = await LeaderBoard.getLeaderboardByMapaNivelDesafio(
            Number(mapaId),
            Number(nivelId),
            Number(desafioId)
        );

        res.json(leaderBoard);
    } catch (error) {
        console.error("ERRO ", error);
        return res.status(500).json({
            message: "Erro ao buscar leaderboard global por tempo"
        });
    }
}