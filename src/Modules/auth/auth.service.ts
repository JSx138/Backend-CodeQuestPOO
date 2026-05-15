import { generateToken } from "../../Utils/jwt";
import { handleError } from "../../Utils/error"
import { LoginResponse } from "../../Utils/types"
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

            // 2. Valida password
            if (user.password !== password) {
                throw new Error('Credenciais inválidas');
            }

            // 3. Cria progresso inicial se não existir
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

            // Atualiza último login
            await ProgressoAluno.update(
                { ultimo_login: new Date() },
                { where: { aluno_id: user.id } }
            );

            // 4. Gera token
            const token = generateToken({ id: user.id, email: user.email });

            // 5. Remove password antes de devolver
            const { password: _p, ...userSemPassword } = user;

            return { token, user: userSemPassword as any };
        } catch (error) {
            throw handleError("Erro ao fazer login", error)
        }

    }
}