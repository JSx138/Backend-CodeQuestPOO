import { Router } from "express";
import { getMapas } from "./mapas.controller"

const router = Router()

router.get(
   "/",
   getMapas
);

export default router