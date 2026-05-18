import {
    Aluno,
}
    from "../../Models/index.js"
import { handleError } from "../../Utils/error.js"
import transporter from "../../Config/emailTransporter.js"
import EmailServiceTemplates from "./emailTemplate.js"


export default class EmailService {

    static async buscarDadosAlunos(userId: number) {
        try {
            const aluno = await Aluno.findByPk(userId, {
                attributes: ["id", "nome", "email"]
            });

            return aluno;
        } catch (error) {
            throw handleError("Erro ao buscar dados do aluno", error);
        }
    }

    static async enviarEmail(
        to: string,
        subject: string,
        html: string
    ) {
        try {
            if (!to || !subject || !html) {
                throw new Error("Campos não fornecidos")
            }

            await transporter.sendMail({
                from: `"CodeQuestPOO" <${process.env.MAIL_USER}>`,
                to: to,
                subject: subject,
                html: html
            })

        } catch (error) {
            throw handleError("Erro ao enviar email", error)
        }
    }

    static async enviarEmailBoasVindas(email: string, userName: string) {
        try {
            const html = EmailServiceTemplates.boasVindas(userName)
            await this.enviarEmail(email, "Boas-Vindas", html)
        } catch (error) {
            throw handleError("Erro ao enviar email de boas-vindas", error)
        }
    }
}