import express from 'express';
import { getTasks, createTask, getTaskById, updateTask, deleteTask } from '../controllers/task.controllers.js';
import {protectRoute} from '../middlewares/auth.middleware.js'; // your existing auth middleware

const router = express.Router();

// All task routes are protected — user must be logged in
router.get('/',protectRoute, getTasks);
router.post('/',protectRoute, createTask);
router.get('/:id',protectRoute, getTaskById);
router.put('/:id',protectRoute, updateTask);
router.delete('/:id',protectRoute, deleteTask);

export default router;