import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import alunosRouter from './routes/alunos.js';
import authRouter from './routes/auth.js';
import pool from './db.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.use('/api/alunos', alunosRouter);
app.use('/api/auth', authRouter);

app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT NOW()');
        res.json({ status: 'OK', db: 'Conectado' });
    } catch (err) {
        res.status(500).json({ status: 'ERRO', db: 'Desconectado', erro: err.message });
    }
});
app.get('/api/teste', (req, res) => {
    res.send('teste ok');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server at http://localhost:${PORT}`);
});