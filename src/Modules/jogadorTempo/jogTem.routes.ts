import { Router } from "express"
import { getUserTempo, getHistoricoSemanal } from "./jogTem.controller.js"
import verificarToken from "../../Middlewares/auth.middleware.js"

const router = Router()

router.get(
    "/", 
    verificarToken,
    getUserTempo
)
router.get(
    "/historico", 
    verificarToken,
    getHistoricoSemanal
)

export default router