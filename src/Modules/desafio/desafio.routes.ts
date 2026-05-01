import { Router } from 'express';
import { getDesempenho, concluirDesafio } from './desafio.controller';
import verificarToken from '../../Middlewares/auth.middleware';

const router = Router()

router.get(
    "/",
    verificarToken,
    getDesempenho
)

router.post(
    "/concluir/:desafioId",
    verificarToken,
    concluirDesafio
)

export default router