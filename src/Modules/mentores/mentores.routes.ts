import { Router } from "express";

import {
    getAllMentores,
    getMentorById,
    getMentorAluno,
    getMentorReaction,
    escolherHeroi,
    trocarMentor
} from "./mentores.controller.js";
import verificarToken from '../../Middlewares/auth.middleware.js';

const router = Router();

router.get(
    "/", 
    getAllMentores
);

router.get(
    "/aluno", 
    verificarToken,
    getMentorAluno
);

router.get(
    "/mentor/:mentorId", 
    getMentorReaction
);

router.get(
    "/:id", 
    getMentorById
);

router.post(
    "/escolher/:mentorId",
    verificarToken,
    escolherHeroi
);


router.patch(
    "/trocar/:novoMentorId",
    verificarToken,
    trocarMentor
);

export default router;