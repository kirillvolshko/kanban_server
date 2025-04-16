import { Request, Response } from "express";
import UserService from "../services/user.service";

class UserController {
  async registration(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const user = await UserService.registration(name, email, password);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await UserService.login(email, password);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async logout(req: Request, res: Response) {
    const result = await UserService.logout();
    res.json(result);
  }

  async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body;
    const result = await UserService.refresh(refreshToken);
    res.json(result);
  }
}

export default new UserController();
