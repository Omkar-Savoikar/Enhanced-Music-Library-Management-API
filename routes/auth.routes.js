import { Router } from "express";

import AuthController from "../controllers/auth.controller.js";
import AuthMiddleware from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.get("/Logout", AuthMiddleware.authenticate, AuthController.logout);

authRouter.post("/signup", AuthController.signup);

authRouter.post("/login", AuthController.login);

export default authRouter;
