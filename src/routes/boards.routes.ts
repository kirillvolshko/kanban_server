import { Router } from "express";
import boardsController from "../controller/boards.controller";

const boardsRoutes = Router();

boardsRoutes.get("/boards/:id", boardsController.getBoardsByUserId);
boardsRoutes.post("/boards", boardsController.createBoard);
boardsRoutes.delete("/boards/:id", boardsController.deleteBoard);

export default boardsRoutes;
