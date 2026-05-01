import { Router } from "express";
import { registarTempo } from "./tempo.controller"
import verificarToken from '../../Middlewares/auth.middleware';

const router = Router()

router.post(
    "/",
    verificarToken,
    registarTempo
);

export default router