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
            email: true,
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
  async addUserToBoard(board_id: string, email: string) {
    const board = await prisma.boards.findUnique({ where: { id: board_id } });
    if (!board) {
      throw { status: 404, message: "Board not found" };
    }

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    const newUserBoard = await prisma.user_boards.create({
      data: {
        user_id: user.id,
        board_id: board_id,
      },
    });

    return newUserBoard;
  }
  async removeUserFromBoard(board_id: string, user_id: string) {
    const board = await prisma.boards.findUnique({ where: { id: board_id } });
    if (!board) {
      throw { status: 404, message: "Board not found" };
    }

    const user = await prisma.users.findUnique({ where: { id: user_id } });
    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    const relation = await prisma.user_boards.findFirst({
      where: {
        user_id,
        board_id,
      },
    });

    if (!relation) {
      throw { status: 400, message: "User is not a member of this board" };
    }

    await prisma.user_boards.delete({
      where: {
        id: relation.id,
      },
    });

    return { message: "User removed from board" };
  }
}

export default new BoardsService();
