import express from 'express';
import levelService from "../Services/LevelService.js";

const router = express.Router();

console.log("LevelRoutes carregado");

router.get("/mapa/:mapaId", async (req, res) => {
  try {
    const { mapaId } = req.params;
    console.log("MAPA ID RECEBIDO:", mapaId);

      const niveis = await levelService.getLevelByMap(parseInt(mapaId, 10));
      console.log("NIVEIS OBTIDOS:", niveis);

    res.json(niveis);

  } catch (error) {
    console.error("ERRO LEVEL SERVICE:", error);
    res.status(500).json({ error: "Erro ao buscar níveis", detalhes: error.message });
  }
});

export default router;