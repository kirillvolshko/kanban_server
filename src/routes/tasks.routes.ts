import { Router } from "express";
import tasksController from "../controller/tasks.controller";

const tasksRoutes = Router();

tasksRoutes.post("/tasks", tasksController.createTask);
tasksRoutes.get("/columns/:column_id/tasks", tasksController.getTasksByColumn);
tasksRoutes.patch("/tasks/:id", tasksController.updateTask);
tasksRoutes.patch("/tasks/:id/move", tasksController.moveTask);
tasksRoutes.delete("/tasks/:id", tasksController.deleteTask);

export default tasksRoutes;
