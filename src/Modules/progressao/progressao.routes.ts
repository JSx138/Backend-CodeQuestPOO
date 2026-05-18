import { Router } from "express"
import { getProgessoDoAlunoPorMapa, getDashboardAluno} from "./progressao.controller.js"
import verificarToken from '../../Middlewares/auth.middleware.js';

const router = Router()

router.get(
    "/",
    verificarToken,
    getProgessoDoAlunoPorMapa
);

router.get(
    "/dashboard",
    verificarToken,
    getDashboardAluno
);

export default router;
