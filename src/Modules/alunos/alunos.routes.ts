import { Router } from 'express';
import { getAll, criar } from './alunos.controller';

const router = Router();

// GET /api/alunos
router.get('/', getAll);

// POST /api/alunos
router.post('/', criar);

export default router;