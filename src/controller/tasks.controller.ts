import { Request, Response } from "express";
import tasksService from "../services/tasks.service";
import { UpdateTaskDto } from "../types/task";

class TasksController {
  async createTask(req: Request, res: Response) {
    try {
      const task = await tasksService.createTask(req.body);
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async getTasksByColumn(req: Request, res: Response) {
    try {
      const { column_id } = req.params;
      const tasks = await tasksService.getTasksByColumnId(column_id);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async updateTask(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data: UpdateTaskDto = req.body;
      const updated = await tasksService.updateTask(id, data);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async deleteTask(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await tasksService.deleteTask(id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async moveTask(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { position, column_id } = req.body;
      const result = await tasksService.moveTask(id, position, column_id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
}

export default new TasksController();
