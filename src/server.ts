import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.middleware";
import routerUser from "./routes/user.routes";
import { PrismaClient } from "../generated/prisma";

dotenv.config();
const PORT = process.env.PORT;

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);

app.use("/api", routerUser);
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
