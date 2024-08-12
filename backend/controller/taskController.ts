import { Request, Response} from "express";
import Task from "../model/task";
import handleError from "../middlewares/errorHandler";

export const getTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        const tasks = await Task.find();
        res.status(200).json({ tasks });
    } catch (error) {
        handleError(res, error);
    }
};


export const getTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            console.log("task not found!");
        } else {
            res.status(200).json({ task });
        }
    } catch (error) {
        handleError(res, error);
    }
}

export const addTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json({ task });
    } catch (error) {
        handleError(res, error);
    }
}

export const updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) {
            res.status(404).json({ message: "Task not found" });
        } else {
            res.status(200).json({ task });
        }
    } catch (error) {
        handleError(res, error);
    }
}


export const deleteTask = async (req:Request, res:Response): Promise<void> => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
        } else {
            res.status(200).json({ message: "Task deleted" });
        }
    } catch (error) {
        handleError(res, error);
    }
}
