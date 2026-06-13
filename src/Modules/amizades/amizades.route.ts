import { Router } from "express";
import verificarToken from "../../Middlewares/auth.middleware.js";
import {
  aceitarPedido,
  enviarPedido,
  estadosAmizade,
  listarAmigos,
  pedidosRecebidos,
  rejeitarPedido,
  removerAmigo,
} from "./amizades.controller.js";

const router = Router();

router.get("/", verificarToken, listarAmigos);
router.get("/pedidos", verificarToken, pedidosRecebidos);
router.get("/estados", verificarToken, estadosAmizade);

router.post("/", verificarToken, enviarPedido);

router.patch("/:id/aceitar", verificarToken, aceitarPedido);
router.patch("/:id/rejeitar", verificarToken, rejeitarPedido);

router.delete("/:amigoId", verificarToken, removerAmigo);

export default router;