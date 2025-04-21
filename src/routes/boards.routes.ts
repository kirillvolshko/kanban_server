import { Router } from "express";
import boardsController from "../controller/boards.controller";

const boardsRoutes = Router();

boardsRoutes.get("/boards/:id", boardsController.getBoardsByUserId);
boardsRoutes.post("/boards", boardsController.createBoard);
boardsRoutes.delete("/boards/:id", boardsController.deleteBoard);
boardsRoutes.get("/boards/:id/users", boardsController.getUsersByBoardId);
boardsRoutes.post("/boards/add-user", boardsController.addUserToBoard);
boardsRoutes.delete("/boards/user", boardsController.removeUserFromBoard);
export default boardsRoutes;
