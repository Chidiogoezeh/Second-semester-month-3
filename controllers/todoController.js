import Todo from '../models/Todo.js';
import { logger } from '../utils/logger.js';

// 1. Fetch all todos for the user
export const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.session.userId });
        res.json(todos);
    } catch (err) {
        logger.error('Failed to fetch todos', { userId: req.session.userId, error: err.message });
        res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
};

// 2. Add a new todo
export const addTodo = async (req, res) => {
    try {
        const todo = new Todo({ 
            text: req.body.text, 
            userId: req.session.userId 
        });
        await todo.save();
        logger.info('Todo created', { userId: req.session.userId, todoId: todo._id });
        res.json(todo);
    } catch (err) {
        logger.error('Add todo failed', { userId: req.session.userId, error: err.message });
        res.status(500).json({ error: 'Could not add task' });
    }
};

// 3. Update status (e.g., pending -> completed, or restoring from trash)
export const updateTodoStatus = async (req, res) => {
    try {
        const result = await Todo.findOneAndUpdate(
            { _id: req.params.id, userId: req.session.userId },
            { status: req.body.status },
            { new: true }
        );
        
        if (!result) {
            logger.warn('Update attempted on non-existent todo', { todoId: req.params.id });
            return res.status(404).json({ error: 'Task not found' });
        }

        logger.info('Todo status updated', { todoId: req.params.id, status: req.body.status });
        res.sendStatus(200);
    } catch (err) {
        logger.error('Update status failed', { todoId: req.params.id, error: err.message });
        res.status(500).json({ error: 'Update failed' });
    }
};

// 4. Permanent Delete (Purge from Trash)
export const deleteTodo = async (req, res) => {
    try {
        const result = await Todo.deleteOne({ _id: req.params.id, userId: req.session.userId });
        
        if (result.deletedCount === 0) {
            logger.warn('Delete attempted on non-existent todo', { todoId: req.params.id });
            return res.status(404).json({ error: 'Task not found' });
        }

        logger.info('Todo purged permanently', { todoId: req.params.id });
        res.sendStatus(200);
    } catch (err) {
        logger.error('Delete failed', { todoId: req.params.id, error: err.message });
        res.status(500).json({ error: 'Permanent deletion failed' });
    }
};