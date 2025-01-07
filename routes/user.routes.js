import { Router } from "express";

import { ROLES } from "../config/constants.js";
import UserController from "../controllers/user.controller.js";
import AuthMiddleware from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.use(AuthMiddleware.authenticate);

userRouter.get("/", AuthMiddleware.authorize([ROLES.ADMIN]), UserController.getUsers);

userRouter.post("/add-user", AuthMiddleware.authorize([ROLES.ADMIN]), UserController.addUser);

userRouter.put("/update-password/:id", UserController.updateUser);

userRouter.delete("/:id", AuthMiddleware.authorize([ROLES.ADMIN]), UserController.deleteUser);

export default userRouter;
