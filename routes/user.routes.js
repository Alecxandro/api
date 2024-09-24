import express from 'express';
import * as userController from '../controllers/users/user.controller.js'
import { authenticateJWT } from '../middlewares/authentication.js';

const router = express.Router();
router.get('/allusers', authenticateJWT, userController.getAllUsers)
router.get('/:id', authenticateJWT, userController.getUser)

router.post('/register', authenticateJWT, userController.registerUser)
router.post('/login', userController.loginUser)

router.delete('/delete/:id', authenticateJWT, userController.deleteUser)
export default router;