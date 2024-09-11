import express from 'express';
import * as userController from './controllers/users/user.controller.js'
import * as classController from './controllers/class/class.controller.js'
import { authenticateJWT } from './middlewares/authentication.js';

const router = express.Router();

router.post('/user/register', userController.registerUser)
router.post('/user/login', userController.loginUser)

router.post('/class/register', authenticateJWT, classController.registerClass)

export default router;
