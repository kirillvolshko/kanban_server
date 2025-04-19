import prisma from "../lib/prisma";

class BoardsService {
  async getBoardsByUserId(userId: string) {
    const userExists = await prisma.users.findUnique({ where: { id: userId } });

    if (!userExists) {
      throw { status: 404, message: "User not found" };
    }

    const userBoards = await prisma.user_boards.findMany({
      where: { user_id: userId },
      include: { board: true },
    });

    return userBoards.map((ub) => ub.board);
  }
  async getUsersByBoardId(boardId: string) {
    const boardExists = await prisma.boards.findUnique({
      where: { id: boardId },
    });

    if (!boardExists) {
      throw { status: 404, message: "Board not found" };
    }

    const users = await prisma.user_boards.findMany({
      where: { board_id: boardId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return users.map((ub) => ub.user);
  }

  async createBoard(title: string, owner_id: string) {
    if (!title || !owner_id) {
      throw { status: 400, message: "Title and owner_id are required" };
    }

    const user = await prisma.users.findUnique({ where: { id: owner_id } });
    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    const board = await prisma.boards.create({
      data: { title, owner_id },
    });

    await prisma.user_boards.create({
      data: {
        user_id: owner_id,
        board_id: board.id,
      },
    });

    return board;
  }

  async deleteBoard(id: string) {
    const board = await prisma.boards.findUnique({ where: { id } });
    if (!board) {
      throw { status: 404, message: "Board not found" };
    }

    await prisma.user_boards.deleteMany({ where: { board_id: id } });

    await prisma.boards.delete({ where: { id } });

    return { message: "Board deleted" };
  }
}

export default new BoardsService();
