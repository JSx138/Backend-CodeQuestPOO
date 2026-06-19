import { Router } from "express";
import { baixarRelatorioDesempenho } from "./excel.controller.js"
import verificarToken from '../../Middlewares/auth.middleware.js';

export const router = Router();

router.get(
    "/", 
    verificarToken,
    baixarRelatorioDesempenho
);

export default router;
