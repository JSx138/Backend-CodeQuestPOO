import { Router } from 'express';
import { login, logout } from './auth.controller.js';
import verificarToken from '../../Middlewares/auth.middleware.js';

const router = Router();

router.post(
    '/login',
    login
);

router.post(
    '/logout/:id',
    verificarToken,
    logout
);

export default router;