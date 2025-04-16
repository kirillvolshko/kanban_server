import { Request, Response } from "express";
import columnsService from "../services/columns.service";

class ColumnsController {
  async createColumn(req: Request, res: Response) {
    try {
      const { title, board_id, position } = req.body;
      const column = await columnsService.createColumn(
        title,
        board_id,
        position
      );
      res.status(201).json(column);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async deleteColumn(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await columnsService.deleteColumn(id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async renameColumn(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title } = req.body;
      const result = await columnsService.renameColumn(id, title);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async moveColumn(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { position } = req.body;
      console.log(id, position);
      const result = await columnsService.moveColumn(id, position);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async getColumnsByBoardId(req: Request, res: Response) {
    try {
      const { board_id } = req.params;
      const columns = await columnsService.getColumnsByBoardId(board_id);
      res.json(columns);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
}

export default new ColumnsController();
