import express from 'express';
import { getTasks, createTask, getTaskById, updateTask, deleteTask, assignTask } from '../controllers/task.controllers.js';
import {protectRoute, requireRole} from '../middlewares/auth.middleware.js'; // your existing auth middleware

const router = express.Router();


router.use(protectRoute)

// All task routes are protected — user must be logged in
router.get('/', getTasks);
router.post('/', createTask);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/assign', requireRole('admin'), assignTask);

export default router;