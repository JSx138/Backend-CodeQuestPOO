import { Router } from "express";
import { registarTempo, mostrarTempo } from "./tempo.controller.js"
import verificarToken from '../../Middlewares/auth.middleware.js';

const router = Router()

router.get(
    "/",
    verificarToken,
    mostrarTempo
);

router.post(
    "/RegistarTempo",
    verificarToken,
    registarTempo
);

export default router