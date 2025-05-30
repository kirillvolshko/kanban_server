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
  async getUsersByBoardId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const users = await boardsService.getUsersByBoardId(id);
      res.json(users);
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
  async addUserToBoard(req: Request, res: Response) {
    try {
      const { board_id, email } = req.body;
      const result = await boardsService.addUserToBoard(board_id, email);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error });
    }
  }
  async removeUserFromBoard(req: Request, res: Response) {
    try {
      const { board_id, user_id } = req.body;
      const result = await boardsService.removeUserFromBoard(board_id, user_id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}

export default new BoardsController();
