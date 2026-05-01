import { Router } from "express";
import { getDesempenhoByAluno } from "./desempenho.controller"

const router = Router()

router.get(
    "/aluno/:aluno_id",
    getDesempenhoByAluno
);

export default router
