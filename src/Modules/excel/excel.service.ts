import ExcelJS from "exceljs";
import { DesempenhoService } from "../desempenho/desempenho.service.js";
import { handleError } from "../../Utils/error.js";
import { Aluno } from "../../Models/index.js";

export class Excel {

    static async gerarRelatorioDesempenho(alunoId: number) {
        try {
            const desempenho = await DesempenhoService.getDesempenhoDoCodigo(alunoId);

            const alunoInfo = await Aluno.findOne({
                where: { id: alunoId },
                attributes: ["nome", "email", "turma", "escola", "ano_letivo"],
            });

            if (!alunoInfo) {
                throw new Error("Aluno não encontrado");
            }

            return {
                alunoInfo,
                desempenho,
            };
        } catch (error) {
            throw handleError("Erro ao gerar relatório de desempenho", error);
        }
    }

    static async gerarRelatorioDesempenhoExcel(alunoId: number): Promise<Buffer> {
        try {
            const { alunoInfo, desempenho } =
                await this.gerarRelatorioDesempenho(alunoId);

            const aluno = alunoInfo.get({ plain: true }) as any;

            const workbook = new ExcelJS.Workbook();

            workbook.creator = "Sistema";
            workbook.created = new Date();

            this.criarAbaResumo(workbook, aluno, desempenho.resumo);
            this.criarAbaErros(workbook, desempenho.resumo.erros_por_tipo);
            this.criarAbaDesafios(workbook, desempenho.por_desafio);

            const buffer = await workbook.xlsx.writeBuffer();

            return Buffer.from(buffer);
        } catch (error) {
            throw handleError("Erro ao gerar Excel de desempenho", error);
        }
    }

    private static criarAbaResumo(
        workbook: ExcelJS.Workbook,
        aluno: any,
        resumo: any
    ) {
        const sheet = workbook.addWorksheet("Resumo");

        sheet.mergeCells("A1:B1");
        sheet.getCell("A1").value = "Relatório de Desempenho";
        sheet.getCell("A1").font = {
            bold: true,
            size: 16,
        };
        sheet.getCell("A1").alignment = {
            horizontal: "center",
        };

        sheet.addRow([]);

        sheet.addRow(["Aluno", aluno.nome]);
        sheet.addRow(["Email", aluno.email]);
        sheet.addRow(["Turma", aluno.turma]);
        sheet.addRow(["Escola", aluno.escola]);
        sheet.addRow(["Ano letivo", aluno.ano_letivo]);

        sheet.addRow([]);

        const header = sheet.addRow(["Indicador", "Valor"]);
        this.estilizarHeader(header);

        sheet.addRow(["Total de desafios", resumo.total_desafios]);
        sheet.addRow(["Total de respostas certas", resumo.total_certas]);
        sheet.addRow(["Total de respostas erradas", resumo.total_erradas]);
        sheet.addRow(["Total de tentativas", resumo.total_tentativas]);
        sheet.addRow(["Taxa de acerto", `${resumo.taxa_acerto}%`]);
        sheet.addRow([
            "Tipo de erro mais comum",
            resumo.tipo_erro_mais_comum?.nome ?? "Nenhum",
        ]);

        sheet.getColumn(1).width = 35;
        sheet.getColumn(2).width = 45;
    }

    private static criarAbaErros(
        workbook: ExcelJS.Workbook,
        errosPorTipo: any[]
    ) {
        const sheet = workbook.addWorksheet("Erros por Tipo");

        sheet.columns = [
            { header: "ID", key: "id", width: 10 },
            { header: "Tipo de erro", key: "nome", width: 30 },
            { header: "Descrição", key: "descricao", width: 60 },
            { header: "Quantidade", key: "count", width: 15 },
        ];

        this.estilizarHeader(sheet.getRow(1));

        if (!errosPorTipo || errosPorTipo.length === 0) {
            sheet.addRow({
                nome: "Nenhum erro encontrado",
            });

            return;
        }

        errosPorTipo.forEach((erro) => {
            sheet.addRow({
                id: erro.id,
                nome: erro.nome,
                descricao: erro.descricao ?? "",
                count: erro.count,
            });
        });
    }

    private static criarAbaDesafios(
        workbook: ExcelJS.Workbook,
        porDesafio: any[]
    ) {
        const sheet = workbook.addWorksheet("Desafios");

        sheet.columns = [
            { header: "Data execução", key: "data_execucao", width: 22 },
            { header: "Mapa", key: "mapa", width: 25 },
            { header: "Nível", key: "nivel", width: 25 },
            { header: "Número do nível", key: "numero_nivel", width: 18 },
            { header: "Desafio", key: "desafio", width: 30 },
            { header: "Ordem", key: "ordem", width: 10 },
            { header: "Certas", key: "respostas_certas", width: 12 },
            { header: "Erradas", key: "respostas_erradas", width: 12 },
            { header: "Tentativas", key: "tentativas", width: 15 },
            { header: "Score", key: "score", width: 12 },
            { header: "Tipo de erro", key: "tipo_erro", width: 25 },
            { header: "Tipo de feedback", key: "tipo_feedback", width: 25 },
            { header: "Feedback IA", key: "feedback_ia", width: 60 },
        ];

        this.estilizarHeader(sheet.getRow(1));

        if (!porDesafio || porDesafio.length === 0) {
            sheet.addRow({
                desafio: "Nenhum desempenho encontrado",
            });

            return;
        }

        porDesafio.forEach((item) => {
            sheet.addRow({
                data_execucao: item.data_execucao
                    ? new Date(item.data_execucao)
                    : "",
                mapa: item.mapa?.nome ?? "",
                nivel: item.nivel?.nome ?? "",
                numero_nivel: item.nivel?.numero ?? "",
                desafio: item.desafio?.nome ?? "",
                ordem: item.desafio?.ordem ?? "",
                respostas_certas: item.respostas_certas ?? 0,
                respostas_erradas: item.respostas_erradas ?? 0,
                tentativas: item.tentativas ?? 0,
                score: item.score ?? 0,
                tipo_erro: item.tipo_erro?.nome ?? "",
                tipo_feedback: item.tipo_feedback?.nome ?? "",
                feedback_ia: item.feedback_ia ?? "",
            });
        });

        sheet.getColumn("data_execucao").numFmt = "dd/mm/yyyy hh:mm";
    }

    private static estilizarHeader(row: ExcelJS.Row) {
        row.eachCell((cell) => {
            cell.font = {
                bold: true,
            };

            cell.alignment = {
                vertical: "middle",
                horizontal: "center",
            };

            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        });
    }
}