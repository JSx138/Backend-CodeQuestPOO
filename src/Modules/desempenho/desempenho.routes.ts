import { Router } from "express";
import { getDesempenhoByAluno } from "./desempenho.controller.js"

const router = Router()

router.get(
    "/aluno/:aluno_id",
    getDesempenhoByAluno
);

export default router
