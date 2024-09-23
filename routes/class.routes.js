import express from 'express';
import { authenticateJWT } from '../middlewares/authentication.js';
import * as classController from '../controllers/class/class.controller.js'
const router = express.Router();

router.post('/register', authenticateJWT, classController.registerClass)

export default router;