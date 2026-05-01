import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './Config/db';

import authRouter from './Modules/auth/auth.routes'
import alunosRouter from './Modules/alunos/alunos.routes';
import desafios from './Modules/desafio/desafio.routes'
import desempenhoRouter from './Modules/desempenho/desempenho.routes';
import levelRouter from './Modules/niveis/niveis.routes';
import mapas from './Modules/mapas/mapas.routes';
import progressoRoutes from './Modules/progressao/progressao.routes';
import tempoRouter from './Modules/tempo/tempo.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.text({ type: 'text/plain' }));

app.get('/', (_req: Request, res: Response) => {
  res.send('Server is running!');
});

app.use('/api/alunos', alunosRouter);
app.use('/api/auth', authRouter);
app.use('/api/progresso', progressoRoutes);
app.use('/api/mapas', mapas);
app.use('/api/tempo', tempoRouter);
app.use('/api/niveis', levelRouter);
app.use('/api/desafios', desafios);
app.use('/api/desempenho', desempenhoRouter);

app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ status: 'OK', db: 'Conectado' });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ status: 'ERRO', db: 'Desconectado', erro: error.message });
  }
});

app.get('/api/teste', (_req: Request, res: Response) => {
  res.send('teste ok');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor no http://localhost:${PORT}`);
});