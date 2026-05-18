import { Router } from "express";
import { registarTempo } from "./tempo.controller.js"
import verificarToken from '../../Middlewares/auth.middleware.js';

const router = Router()

router.post(
    "/",
    verificarToken,
    registarTempo
);

export default router