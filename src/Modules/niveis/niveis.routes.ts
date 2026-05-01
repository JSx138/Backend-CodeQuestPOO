import { Router } from "express";
import { nivel } from "./niveis.controller"

const router = Router()

router.get(
    "/mapa/:mapaId",
    nivel
);

export default router