import { Request, Response } from "express";
import { Excel } from "./excel.service.js";
import { handleError } from "../../Utils/error.js";

export async function baixarRelatorioDesempenho(req: Request, res: Response) {
  try {
    const alunoId = Number(req.alunoId!);

    if (!alunoId || Number.isNaN(alunoId)) {
      return res.status(400).json({
        message: "ID do aluno inválido",
      });
    }

    const buffer = await Excel.gerarRelatorioDesempenhoExcel(alunoId);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="relatorio-desempenho-aluno-${alunoId}.xlsx"`
    );

    return res.send(buffer);
  } catch (error) {
    const err = handleError("Erro ao baixar relatório de desempenho", error);

    return res.status(500).json({
      message: err.message || "Erro ao gerar relatório Excel",
    });
  }
}