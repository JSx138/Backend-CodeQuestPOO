import { Router } from "express";

import {
    getAllMentores,
    getMentorById,
    getMentorAluno,
    getMentorReaction
} from "./mentores.controller.js";

const router = Router();

router.get(
    "/", 
    getAllMentores
);

router.get(
    "/aluno/:alunoId", 
    getMentorAluno
);

router.get(
    "/reaction/:mentorId", 
    getMentorReaction
);

router.get(
    "/:id", 
    getMentorById
);

export default router;