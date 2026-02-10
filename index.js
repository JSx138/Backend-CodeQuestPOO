import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import alunosRouter from './routes/alunos.js';
import pool from './db.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.get('/', (req, res) => {
    res.send('Server is running!')
});


app.use('/api/alunos', alunosRouter);

// Verificar conexão com o banco
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT NOW()');
        res.json({ status: 'OK', db: 'Conectado' });
    } catch (err) {
        res.status(500).json({ status: 'ERRO', db: 'Desconectado', erro: err.message });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server at http://localhost:${PORT}`)
});

process.on('uncaughtException', (err) => {
    console.error('Erro:', err);
});