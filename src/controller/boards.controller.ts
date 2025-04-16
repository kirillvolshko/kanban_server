import { Request, Response } from "express";
import boardsService from "../services/boards.service";

class BoardsController {
  async getBoardsByUserId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const boards = await boardsService.getBoardsByUserId(id);
      res.json(boards);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async createBoard(req: Request, res: Response) {
    try {
      const { title, owner_id } = req.body;
      const board = await boardsService.createBoard(title, owner_id);
      res.status(201).json(board);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async deleteBoard(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await boardsService.deleteBoard(id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
}

export default new BoardsController();
