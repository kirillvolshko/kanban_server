import { Router } from "express";
import columnsController from "../controller/columns.controller";

const columnsRoutes = Router();

columnsRoutes.post("/columns", columnsController.createColumn);
columnsRoutes.delete("/columns/:id", columnsController.deleteColumn);
columnsRoutes.patch("/column/:id/rename", columnsController.renameColumn);
columnsRoutes.patch("/column/:id/move", columnsController.moveColumn);
columnsRoutes.get(
  "/boards/:board_id/columns",
  columnsController.getColumnsByBoardId
);

export default columnsRoutes;
