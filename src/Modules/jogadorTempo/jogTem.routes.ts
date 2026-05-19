import { Router } from "express"
import { getUserTempo } from "./jogTem.controller.js"
import verificarToken from "../../Middlewares/auth.middleware.js"

const router = Router()

router.get(
    "/", 
    verificarToken,
    getUserTempo
)

export default router