import express from 'express';
import * as authCtrl from '../controllers/authController.js';
const router = express.Router();

router.get('/login', authCtrl.renderLogin);
router.post('/login', authCtrl.login);

router.get('/register', authCtrl.renderRegister);
router.post('/register', authCtrl.register);

router.get('/logout', authCtrl.logout);

export default router;