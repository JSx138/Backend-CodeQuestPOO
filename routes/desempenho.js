import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get("/aluno/:aluno_id", async (req, res) => {
    const { aluno_id } = req.params

    try {

        const resultado = await pool.query(
            `SELECT * FROM desempenho_desafio 
       WHERE aluno_id = $1 
       ORDER BY data_execucao DESC`,
            [aluno_id]
        )

        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensagem: "Nenhum desempenho encontrado para esse aluno" })
        }

        res.status(200).json({
            aluno_id: parseInt(aluno_id),
            total_registos: resultado.rows.length,
            desempenhos: resultado.rows
        })

    } catch (error) {
        console.error("Erro ao ir buscar o desempenho do aluno: ", error)
        res.status(500).json({ error: "Erro interno do servidor " })
    }
})

export default router;