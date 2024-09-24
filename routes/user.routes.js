import express from 'express';
import * as userController from '../controllers/users/user.controller.js'
import { authenticateJWT } from '../middlewares/authentication.js';

const router = express.Router();

router.post('/register', authenticateJWT, userController.registerUser)
router.delete('/delete/:id', authenticateJWT, userController.deleteUser)
router.get('/:id([0-9]+)', authenticateJWT, userController.getUser)
router.get('/allusers', authenticateJWT, userController.getAllUsers)
router.post('/login', userController.loginUser)

export default router;