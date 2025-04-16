import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.middleware";
import routerUser from "./routes/user.routes";

import boardsRoutes from "./routes/boards.routes";
import columnsRoutes from "./routes/columns.routes";
import prisma from "./lib/prisma";
import tasksRoutes from "./routes/tasks.routes";

dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use("/api", routerUser);
app.use("/api", boardsRoutes);
app.use("/api", columnsRoutes);
app.use("/api", tasksRoutes);
app.use(errorMiddleware);
async function startApp() {
  try {
    app.listen(PORT, () => console.log("START SERVER " + PORT));
    await prisma.$connect();
  } catch (e) {
    console.log(e);
  }
}
startApp();
