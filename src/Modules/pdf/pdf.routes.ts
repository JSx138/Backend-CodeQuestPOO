import { Router } from "express";
import { gerarPdf } from "./pdf.controller.js";
import verificarToken from '../../Middlewares/auth.middleware.js';

const router = Router();

router.get(
    "/:id", 
    verificarToken,
    gerarPdf
);

export default router;