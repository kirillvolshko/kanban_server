import prisma from "../lib/prisma";
import { UpdateTaskDto } from "../types/task";

class TasksService {
  async createTask(data: {
    title: string;
    column_id: string;
    position: number;
    description?: string;
    start_date?: Date;
    end_date?: Date;
    priority?: string;
    assigned_to?: string;
  }) {
    const { title, column_id, position } = data;

    if (!title || !column_id || position === undefined) {
      throw {
        status: 400,
        message: "Title, column_id and position are required",
      };
    }

    const columnExists = await prisma.columns.findUnique({
      where: { id: column_id },
    });
    if (!columnExists) {
      throw { status: 404, message: "Column not found" };
    }

    return await prisma.tasks.create({ data });
  }

  async getTasksByColumnId(column_id: string) {
    if (!column_id) {
      throw { status: 400, message: "Column ID is required" };
    }

    return await prisma.tasks.findMany({
      where: { column_id },
      orderBy: { position: "asc" },
    });
  }

  async updateTask(id: string, data: UpdateTaskDto) {
    if (!id) throw { status: 400, message: "Task ID is required" };

    const task = await prisma.tasks.findUnique({ where: { id } });
    if (!task) throw { status: 404, message: "Task not found" };

    return await prisma.tasks.update({
      where: { id },
      data,
    });
  }

  async deleteTask(id: string) {
    const task = await prisma.tasks.findUnique({ where: { id } });
    if (!task) throw { status: 404, message: "Task not found" };

    await prisma.tasks.delete({ where: { id } });
    return { message: "Task deleted" };
  }

  async moveTask(id: string, newPosition: number, newColumnId?: string) {
    const current = await prisma.tasks.findUnique({ where: { id } });
    if (!current) throw { status: 404, message: "Task not found" };

    const column_id = newColumnId || current.column_id;

    const columnExists = await prisma.columns.findUnique({
      where: { id: column_id },
    });
    if (!columnExists) {
      throw { status: 404, message: "Target column not found" };
    }

    if (newPosition < 1) {
      throw { status: 400, message: "Position must be >= 1" };
    }

    const tasks = await prisma.tasks.findMany({
      where: { column_id },
      orderBy: { position: "asc" },
    });

    const withoutCurrent = tasks.filter((t) => t.id !== id);
    if (newPosition > tasks.length + 1) {
      throw { status: 400, message: "Position out of range" };
    }

    withoutCurrent.splice(newPosition - 1, 0, current);

    const updates = withoutCurrent.map((task, index) =>
      prisma.tasks.update({
        where: { id: task.id },
        data: { position: index + 1, column_id },
      })
    );

    await prisma.$transaction(updates);

    return { message: "Task moved" };
  }
}

export default new TasksService();
