import { Router } from "express";
import {
	getCurrentUser,
	loginUser,
	registerUser,
} from "../controllers/userController";
import { verifyJWT } from "../middlewares/authMiddleware";

const userRouter = Router();

userRouter.post("/signup", registerUser);

userRouter.post("/signin", loginUser);

userRouter.get("/get-current-user", verifyJWT, getCurrentUser);

export { userRouter };
