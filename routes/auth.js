import express from 'express';
import * as authCtrl from '../controllers/authController.js';
const router = express.Router();

router.get('/login', authCtrl.renderLogin);
router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.get('/logout', authCtrl.logout);

export default router;