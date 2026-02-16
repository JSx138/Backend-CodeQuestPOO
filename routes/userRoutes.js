const express = require('express');
const router = express.Router();
const { criarUsuario } = require('../services/userServices');
 
// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { nome, email, password, numero, turma, escola, ano, ano_letivo, avatar_id, heroi_id } = req.body;
 
    if (!nome || !email || !password) {
      return res.status(400).json({ message: 'Campos obrigatórios não preenchidos' });
    }
 
    const user = await criarUsuario({
      nome, email, password, numero, turma, escola, ano, ano_letivo, avatar_id, heroi_id
    });
 
    res.status(201).json({ message: 'Conta criada com sucesso', user });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      // Código de erro do Postgres para UNIQUE violation
      return res.status(400).json({ message: 'Email já cadastrado' });
    }
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
});
 
module.exports = router;
 
 