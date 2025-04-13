import { Router } from "express";
import userConroller from "../controller/user.conroller";

const routerUser = Router();

routerUser.post("/login", userConroller.login);
routerUser.post("/logout", userConroller.logout);
routerUser.post("/registration", userConroller.registration);
routerUser.get("/refresh", userConroller.refresh);

export default routerUser;
