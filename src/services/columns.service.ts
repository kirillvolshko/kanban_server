import prisma from "../lib/prisma";

class ColumnsService {
  async createColumn(title: string, board_id: string, position: number) {
    if (!title || !board_id || position === undefined) {
      throw {
        status: 400,
        message: "title, board_id, and position are required",
      };
    }

    const board = await prisma.boards.findUnique({ where: { id: board_id } });
    if (!board) {
      throw { status: 404, message: "Board not found" };
    }

    const column = await prisma.columns.create({
      data: { title, board_id, position },
    });

    return column;
  }

  async deleteColumn(id: string) {
    const column = await prisma.columns.findUnique({ where: { id } });
    if (!column) {
      throw { status: 404, message: "Column not found" };
    }

    await prisma.columns.delete({ where: { id } });
    return { message: "Column deleted" };
  }

  async renameColumn(id: string, newTitle: string) {
    if (!newTitle) {
      throw { status: 400, message: "Title is required" };
    }

    const column = await prisma.columns.update({
      where: { id },
      data: { title: newTitle },
    });

    return column;
  }

  async moveColumn(id: string, newPosition: number) {
    const current = await prisma.columns.findUnique({ where: { id } });
    if (!current) throw { status: 404, message: "Column not found" };

    const boardColumns = await prisma.columns.findMany({
      where: { board_id: current.board_id },
      orderBy: { position: "asc" },
    });

    const withoutCurrent = boardColumns.filter((col) => col.id !== id);

    withoutCurrent.splice(newPosition - 1, 0, current);

    const updates = withoutCurrent.map((col, index) =>
      prisma.columns.update({
        where: { id: col.id },
        data: { position: index + 1 },
      })
    );

    await prisma.$transaction(updates);

    return { message: "Column moved" };
  }

  async getColumnsByBoardId(board_id: string) {
    const columns = await prisma.columns.findMany({
      where: { board_id },
      orderBy: { position: "asc" },
    });

    return columns;
  }
}

export default new ColumnsService();
