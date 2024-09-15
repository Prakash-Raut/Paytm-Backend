import { Router } from "express";
import { getBalance, transferMoney } from "../controllers/accountController";
import { verifyJWT } from "../middlewares/authMiddleware";

const accountRouter = Router();

accountRouter.use(verifyJWT);

accountRouter.get("/balance", getBalance);

accountRouter.post("/transfer", transferMoney);

export { accountRouter };
