import { Router } from "express";
import { requireAdmin } from "./admin.middleware.js";
import {
  getAlunoDetalhes,
  getAlunoEstatisticas,
  getAlunos,
  getConteudo,
  getDashboard,
  updateAlunoAtivo,
} from "./admin.controller.js";

const router = Router();

router.use(requireAdmin);

router.get("/dashboard", getDashboard);
router.get("/alunos", getAlunos);
router.get("/alunos/:id", getAlunoDetalhes);
router.get("/alunos/:id/estatisticas", getAlunoEstatisticas);
router.patch("/alunos/:id/ativo", updateAlunoAtivo);
router.get("/conteudo", getConteudo);

export default router;