import { Router } from "express";
import { getDesempenhoByAluno, getDesempenhoDoCodigo } from "./desempenho.controller.js"
import verificarToken from '../../Middlewares/auth.middleware.js';

const router = Router()

router.get(
    "/codigo",
    verificarToken,
    getDesempenhoDoCodigo
);

router.get(
    "/aluno/:aluno_id",
    getDesempenhoByAluno
);

export default router
