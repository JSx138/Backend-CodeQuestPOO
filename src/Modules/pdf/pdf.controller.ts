import { Request, Response } from "express";
import { Pdf } from "./pdf.service.js";

export async function gerarPdf(req: Request, res: Response) {
    try {
        const alunoId = Number(req.alunoId!)

        if (isNaN(alunoId)) {
            return res.status(400).json({ 
                status: "error",
                message: "User id inválido" 
            });
        }

        const pdf = await Pdf.generatePdf(alunoId);
        res.setHeader("Content-Type", "application/pdf")
        res.setHeader(
            "Content-Disposition",
            "inline; filename=relatorio.pdf"
        )

        return res.status(200).send({
            status: 'success',
            message: 'PDF gerado com sucesso',
            data: { pdf }
        });
    } catch (error) {
        console.error("Erro ao construir relatório", error)
        return res.status(500).json({ 
            status: "error",
            message: "Erro ao construir relatório" 
        });
    }
}