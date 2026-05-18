import { Router } from 'express';
import { getAll, criar } from './alunos.controller.js';

const router = Router();

router.get('/', getAll);

// POST /api/alunos
router.post('/registrar', criar);

export default router;