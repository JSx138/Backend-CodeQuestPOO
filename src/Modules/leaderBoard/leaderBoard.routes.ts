import { Router } from "express"
import { getGlobalLeaderboardBestTime, getLeaderboardByMapaNivelDesafio } from "./leaderBoard.controller.js"

const router = Router()

router.get(
    "/", 
    getGlobalLeaderboardBestTime
)

router.get(
    "/:mapaId/:nivelId/:desafioId", 
    getLeaderboardByMapaNivelDesafio
);

export default router