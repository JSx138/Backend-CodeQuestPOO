import { Router } from 'express';
import { getAll, criar, getMe } from './alunos.controller.js';
import verificarToken from '../../Middlewares/auth.middleware.js';

const router = Router();

router.get('/', getAll);

router.get('/getMe', verificarToken, getMe)

// POST /api/alunos
router.post('/registrar', criar);

export default router;