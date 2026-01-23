import express from 'express';
import * as todoCtrl from '../controllers/todoController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.use(protect);
router.get('/', todoCtrl.getTodos);
router.post('/', todoCtrl.addTodo);
router.patch('/:id', todoCtrl.updateTodoStatus);
router.delete('/:id', todoCtrl.deleteTodo);

export default router;