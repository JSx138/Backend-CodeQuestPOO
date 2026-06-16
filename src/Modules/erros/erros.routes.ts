import { Router } from "express";
import { getErrosPorAluno } from "./erros.controller.js"
import verificarToken from '../../Middlewares/auth.middleware.js';

const router = Router()

router.get(
    "/",
    verificarToken,
    getErrosPorAluno
);

export default router