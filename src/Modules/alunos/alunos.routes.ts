import { Router } from 'express';
import { getAll, criar, getMe, getAlunoById, atualizarOnline} from './alunos.controller.js';
import verificarToken from '../../Middlewares/auth.middleware.js';


const router = Router();

router.patch(
    '/online',
    verificarToken,
    atualizarOnline
);

router.get(
    '/', 
    getAll
);

router.get(
    '/getMe', 
    verificarToken, 
    getMe
)

router.get(
    '/:id', 
    getAlunoById
)

// POST /api/alunos
router.post(
    '/registrar', 
    criar
);

export default router;