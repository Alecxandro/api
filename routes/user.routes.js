import express from 'express';
import * as userController from '../controllers/users/user.controller.js'
import { authenticateJWT } from '../middlewares/authentication.js';

const router = express.Router();

router.post('/register', authenticateJWT, userController.registerUser)
router.post('/login', userController.loginUser)

export default router;