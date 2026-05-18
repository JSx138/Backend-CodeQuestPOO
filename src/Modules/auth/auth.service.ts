import { generateToken } from "../../Utils/jwt.js";
import { handleError } from "../../Utils/error.js"
import { LoginResponse } from "../../Utils/types.js"
import bcrypt from "bcryptjs";
import Aluno from "../../Models/Aluno/aluno.js";
import ProgressoAluno from "../../Models/ProgressoAluno/progressoAluno.js";

export class AuthService {

    static async login(email: string, password: string): Promise<LoginResponse> {

        try {
            const user = await Aluno.findOne({
                where: { email }
            });

            if (!user) {
                throw new Error('Credenciais inválidas');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            if (!isPasswordValid) {
                throw new Error("Password inválida");
            }

            await ProgressoAluno.findOrCreate({
                where: { aluno_id: user.id },
                defaults: {
                    xp: 0,
                    nivel_atual: 1,
                    coins: 0,
                    streak: 0,
                    tempo_total_jogo: 0,
                    mapa_atual: 1,
                    ultimo_login: new Date()
                }
            });

            await ProgressoAluno.update(
                { ultimo_login: new Date() },
                { where: { aluno_id: user.id } }
            );

            const token = generateToken({ id: user.id, email: user.email });

            // 5. Remove password antes de devolver
            const { password: _p, ...userSemPassword } = user;

            return { token, user: userSemPassword as any };
        } catch (error) {
            throw handleError("Erro ao fazer login", error)
        }

    }
}