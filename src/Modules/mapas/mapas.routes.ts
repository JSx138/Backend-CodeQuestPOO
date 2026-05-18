import { Router } from "express";
import { getMapas } from "./mapas.controller.js"

const router = Router()

router.get(
   "/",
   getMapas
);

export default router