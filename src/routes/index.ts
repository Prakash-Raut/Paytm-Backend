import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware";
import { accountRouter } from "./accountRoute";
import { userRouter } from "./userRoute";

const v1Router = Router();

v1Router.use("/users", userRouter);
v1Router.use("/accounts", verifyJWT, accountRouter);

export { v1Router };
