import {
    Aluno,
    Avatar,
    TempoNivel,
    ProgressoAluno,
    Mapa,
    Nivel
} from "../../Models/index.js";
import puppeteer from "puppeteer";
import { handleError } from "../../Utils/error.js";

export class Pdf {
    static async getUser(alunoId: number) {
        try {
            const aluno = await Aluno.findOne({
                where: { id: alunoId },
                attributes: [
                    "id",
                    "nome",
                    "email",
                    "numero",
                    "turma",
                    "escola",
                    "ano",
                    "ano_letivo",
                    "data_registo"
                ],
                include: [

                    {
                        model: ProgressoAluno,
                        as: "progresso",
                        attributes: ["mapa_atual", "nivel_atual", "xp", "tempo_total_jogo"]
                    },
                    {
                        model: Avatar,
                        as: "avatar",
                        attributes: ["nome", "caminho_imagem"]
                    },
                    {
                        model: TempoNivel,
                        as: "temposNiveis",
                        attributes: ["tempo_total", "tempo_primeira_conclusao", "melhor_tempo", "tentativas"],
                        include: [{
                            model: Nivel,
                            as: "nivel",
                            attributes: ["nivel", "nome", "descricao"],
                            include: [{
                                model: Mapa,
                                as: "mapa",
                                attributes: ["nome"]
                            }]
                        }]
                    }

                ]
            })
            return { aluno }
        } catch (error) {
            throw handleError('Erro ao buscar aluno', error)
        }
    }

    static async buildHtml(alunoId: number) {
        try {
            const { aluno } = await this.getUser(alunoId);

            if (!aluno) {
                throw new Error('Aluno não encontrado');
            }

            const progresso = aluno.progresso || {};
            const avatar = aluno.avatar || {};
            const tempoNivel = (aluno as any).temposNiveis || [];

            const tempoTotal = Math.floor((progresso.tempo_total_jogo || 0) / 60);

            return `
            <!DOCTYPE html>
            <html lang="pt-PT">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Relatório de Progresso - ${aluno.nome}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background: #f5f5f5;
                        color: #333;
                    }
                    .container {
                        max-width: 900px;
                        margin: 0 auto;
                        padding: 40px;
                        background: #fff;
                    }
                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 3px solid #1e5a8e;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .header-info h1 {
                        font-size: 28px;
                        color: #0a2a4a;
                        margin-bottom: 5px;
                    }
                    .header-info p {
                        color: #666;
                        font-size: 13px;
                    }
                    .avatar-section {
                        text-align: center;
                    }
                    .avatar {
                        width: 100px;
                        height: 100px;
                        border-radius: 50%;
                        background: #e0e0e0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 50px;
                        margin-bottom: 10px;
                    }
                    .avatar-name {
                        font-size: 12px;
                        color: #666;
                    }

                    .grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin-bottom: 30px;
                    }
                    .grid.full { grid-template-columns: 1fr; }

                    .card {
                        background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
                        border: 1px solid #ddd;
                        border-radius: 12px;
                        padding: 20px;
                    }
                    .card h3 {
                        font-size: 13px;
                        color: #0a2a4a;
                        margin-bottom: 12px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        border-bottom: 2px solid #1e5a8e;
                        padding-bottom: 8px;
                    }
                    .card-item {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 10px;
                        font-size: 14px;
                    }
                    .card-item:last-child { margin-bottom: 0; }
                    .card-label {
                        color: #666;
                    }
                    .card-value {
                        font-weight: 600;
                        color: #1e5a8e;
                    }

                    .progress-bar {
                        width: 100%;
                        height: 8px;
                        background: #e0e0e0;
                        border-radius: 4px;
                        overflow: hidden;
                        margin-top: 8px;
                    }
                    .progress-fill {
                        height: 100%;
                        background: linear-gradient(90deg, #1e5a8e, #7ab8ff);
                        width: 75%;
                    }

                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 12px;
                    }
                    .stat-box {
                        background: #fff;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        padding: 12px;
                        text-align: center;
                    }
                    .stat-number {
                        font-size: 20px;
                        font-weight: 700;
                        color: #1e5a8e;
                        margin-bottom: 4px;
                    }
                    .stat-label {
                        font-size: 11px;
                        color: #999;
                        text-transform: uppercase;
                        letter-spacing: 0.3px;
                    }

                    .section-title {
                        font-size: 16px;
                        font-weight: 700;
                        color: #0a2a4a;
                        margin-top: 30px;
                        margin-bottom: 15px;
                        border-left: 4px solid #1e5a8e;
                        padding-left: 12px;
                    }

                    .niveis-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 30px;
                    }
                    .niveis-table th {
                        background: #1e5a8e;
                        color: #fff;
                        padding: 12px;
                        text-align: left;
                        font-size: 12px;
                        text-transform: uppercase;
                        letter-spacing: 0.3px;
                    }
                    .niveis-table td {
                        padding: 12px;
                        border-bottom: 1px solid #e0e0e0;
                        font-size: 13px;
                    }
                    .niveis-table tr:last-child td {
                        border-bottom: none;
                    }
                    .niveis-table tr:nth-child(even) {
                        background: #f9f9f9;
                    }

                    .footer {
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 1px solid #ddd;
                        text-align: center;
                        color: #999;
                        font-size: 12px;
                    }

                    .badge {
                        display: inline-block;
                        background: #e3f2fd;
                        color: #1e5a8e;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 11px;
                        font-weight: 600;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <!-- HEADER -->
                    <div class="header">
                        <div class="header-info">
                            <h1>CodeQuest - Relatório de Progresso</h1>
                            <p>Gerado em ${new Date().toLocaleDateString('pt-PT')}</p>
                        </div>
                        <div class="avatar-section">
                            <div class="avatar">🎮</div>
                            <p class="avatar-name">${avatar.nome || 'Avatar'}</p>
                        </div>
                    </div>

                    <!-- INFORMAÇÕES DO ALUNO -->
                    <div class="grid">
                        <div class="card">
                            <h3>Informações Pessoais</h3>
                            <div class="card-item">
                                <span class="card-label">Nome:</span>
                                <span class="card-value">${aluno.nome}</span>
                            </div>
                            <div class="card-item">
                                <span class="card-label">Email:</span>
                                <span class="card-value">${aluno.email}</span>
                            </div>
                            <div class="card-item">
                                <span class="card-label">Número:</span>
                                <span class="card-value">${aluno.numero || '-'}</span>
                            </div>
                            <div class="card-item">
                                <span class="card-label">Turma:</span>
                                <span class="card-value">${aluno.turma || '-'}</span>
                            </div>
                        </div>

                        <div class="card">
                            <h3>Escola</h3>
                            <div class="card-item">
                                <span class="card-label">Instituição:</span>
                                <span class="card-value">${aluno.escola || '-'}</span>
                            </div>
                            <div class="card-item">
                                <span class="card-label">Ano Letivo:</span>
                                <span class="card-value">${aluno.ano_letivo || '-'}</span>
                            </div>
                            <div class="card-item">
                                <span class="card-label">Ano Escolar:</span>
                                <span class="card-value">${aluno.ano ? aluno.ano + 'º' : '-'}</span>
                            </div>
                            <div class="card-item">
                                <span class="card-label">Membro desde:</span>
                                <span class="card-value">${new Date(aluno.data_registo).toLocaleDateString('pt-PT')}</span>
                            </div>
                        </div>
                    </div>

                    <!-- ESTATÍSTICAS PRINCIPAIS -->
                    <div class="card full">
                        <h3>Estatísticas Gerais</h3>
                        <div class="stats-grid">
                            <div class="stat-box">
                                <div class="stat-number">${progresso.xp || 0}</div>
                                <div class="stat-label">XP Total</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-number">${progresso.mapa_atual || 1}</div>
                                <div class="stat-label">Mapa Atual</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-number">${progresso.nivel_atual || 1}</div>
                                <div class="stat-label">Nível Atual</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-number">${tempoTotal}m</div>
                                <div class="stat-label">Tempo Total</div>
                            </div>
                        </div>
                    </div>

                    <!-- HISTÓRICO DE NÍVEIS -->
                    ${tempoNivel.length > 0 ? `
                        <h2 class="section-title">Histórico de Níveis Completados</h2>
                        <table class="niveis-table">
                            <thead>
                                <tr>
                                    <th>Mapa</th>
                                    <th>Nível</th>
                                    <th>Nome</th>
                                    <th>Tempo Total</th>
                                    <th>Primeira Conclusão</th>
                                    <th>Melhor Tempo</th>
                                    <th>Tentativas</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tempoNivel.map((t: any) => `
                                    <tr>
                                        <td>${t.nivel?.mapa?.nome || '-'}</td>
                                        <td><span class="badge">Nível ${t.nivel?.nivel || '-'}</span></td>
                                        <td>${t.nivel?.nome || '-'}</td>
                                        <td>${Math.floor((t.tempo_total || 0) / 60)}m</td>
                                        <td>${Math.floor((t.tempo_primeira_conclusao || 0) / 60)}m</td>
                                        <td>${Math.floor((t.melhor_tempo || 0) / 60)}m</td>
                                        <td>${t.tentativas || 1}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : '<p style="text-align: center; color: #999; margin: 20px 0;">Nenhum nível completado ainda.</p>'}

                    <!-- FOOTER -->
                    <div class="footer">
                        <p>CodeQuestPOO © 2025 - Plataforma de Aprendizagem Gamificada</p>
                        <p>Este relatório foi gerado automaticamente pelo sistema.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        } catch (error) {
            throw handleError('Erro ao construir HTML do PDF', error);
        }
    }

    static async generatePdf(alunoId: number) {
        let browser

        try {
            const html = await this.buildHtml(alunoId)

            browser = await puppeteer.launch({
                headless: true,
            })
            const page = await browser.newPage()

            await page.setContent(html, {
                waitUntil: "domcontentloaded",
            });

            const pdfBuffer = await page.pdf({
                format: "A4",
                printBackground: true,
                margin: {
                    top: "20px",
                    right: "20px",
                    bottom: "20px",
                    left: "20px",
                },
            });

            await page.close();
            await browser.close();

            return pdfBuffer;

        } catch (error) {
            if (browser) await browser.close();
            throw handleError("Erro ao gerar Pdf", error)
        }
    }

}