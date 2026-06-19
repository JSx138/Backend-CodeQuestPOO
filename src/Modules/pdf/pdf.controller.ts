import { Request, Response } from "express";
import { Pdf } from "./pdf.service.js";

export async function gerarPdf(req: Request, res: Response) {
    try {
        const alunoId = Number(req.alunoId!);

        if (isNaN(alunoId)) {
            return res.status(400).json({
                status: "error",
                message: "User id inválido"
            });
        }

        const pdf = await Pdf.generatePdf(alunoId);

        const pdfBuffer = Buffer.isBuffer(pdf)
            ? pdf
            : Buffer.from(pdf);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'attachment; filename="relatorio.pdf"');
        res.setHeader("Content-Length", pdfBuffer.length);

        return res.status(200).end(pdfBuffer);

    } catch (error) {
        console.error("Erro ao construir relatório", error);

        return res.status(500).json({
            status: "error",
            message: "Erro ao construir relatório"
        });
    }
}