const pool = require('../db');
const bcrypt = require('bcryptjs');
 
async function criarUtilizador(userData) {
    const {
        nome, email, password,
        numero, turma, escola, ano,
        ano_letivo, avatar_id, heroi_id
    } = userData;
 
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
 
    const query = `
  INSERT INTO users
  (nome, email, password, numero, turma, escola, ano, ano_letivo, avatar_id, heroi_id, data_registo, ativo)
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW(), true)
  RETURNING id, nome, email, avatar_id;
`;
 
    const values = [
        nome, email, hashedPassword,
        numero || null,
        turma || null,
        escola || null,
        ano || null,
        ano_letivo || null,
        avatar_id || null,
        heroi_id || null
    ];
 
    const result = await pool.query(query, values);
    return result.rows[0];
}
 
module.exports = { criarUtilizador };
 
 