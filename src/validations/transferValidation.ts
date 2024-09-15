import { isValidObjectId } from "mongoose";
import { z } from "zod";

const toValidation = z.string().refine((val) => isValidObjectId(val), {
	message: "Invalid MongoDB ObjectId",
});

const amountValidation = z.number().int().positive();

export const transferSchema = z.object({
	to: toValidation,
	amount: amountValidation,
});
