import bcrypt from "bcryptjs";
import sequelize from "../Config/sequelize.js";
import { Aluno } from "../Models/index.js";

export async function run() {
  try {
    await sequelize.authenticate(); 
    const alunos = await Aluno.findAll();

    for (const aluno of alunos) {
      const password = aluno.password;

      if (password.startsWith("$2a$") || password.startsWith("$2b$")) {
        console.log(`Skip: ${aluno.email} já tem hash`);
        continue;
      }

      const hash = await bcrypt.hash(password, 10);

      await aluno.update({
        password: hash
      });

      console.log(`Migrado: ${aluno.email}`);
    }

    console.log("✅ Migração concluída com sucesso!");

  } catch (error) {
    console.error("❌ Erro na migração:", error);
  }
}

run(); 