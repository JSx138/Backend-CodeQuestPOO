import { Router } from "express";
import { pedirFeedbackIA } from "./feedbackAI.controller.js";

const feedbackAIRoutes = Router();

feedbackAIRoutes.post("/", pedirFeedbackIA);

export default feedbackAIRoutes;