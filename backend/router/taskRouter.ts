import { Router } from 'express';
import { getTasks,getTask, addTask, updateTask, deleteTask } from "../controller/taskController";

const taskRouter: Router = Router();

taskRouter.route('/tasks').get(getTasks).post(addTask);
taskRouter.route('/tasks/:id').get(getTask).patch(updateTask).delete(deleteTask);

export default taskRouter;