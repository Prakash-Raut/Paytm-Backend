import { Request, Response } from "express";
import { Account } from "../models/Account";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { transferSchema } from "../validations/transferValidation";

const getBalance = asyncHandler(async (req: Request, res: Response) => {
	try {
		const account = await Account.findOne({
			userId: req.user?._id,
		});

		if (!account) {
			throw new ApiError(404, "Account not found");
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					{ balance: account.balance },
					"Balance fetched"
				)
			);
	} catch (error) {
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

const transferMoney = asyncHandler(async (req: Request, res: Response) => {
	const session = await Account.startSession();

	try {
		const result = transferSchema.safeParse(req.body);

		if (!result.success) {
			throw new ApiError(400, "Invalid recipient or amount");
		}

		const { to, amount } = result.data;

		await session.withTransaction(async () => {
			const senderAccount = await Account.findOne({
				userId: req.user?._id,
			}).session(session);

			if (!senderAccount) {
				await session.abortTransaction();
				session.endSession();

				throw new ApiError(404, "Sender account not found");
			}

			const receiverAccount = await Account.findOne({
				userId: to,
			}).session(session);

			if (!receiverAccount) {
				await session.abortTransaction();
				session.endSession();

				throw new ApiError(404, "Receiver account not found");
			}

			if (
				senderAccount.userId.toString() ===
				receiverAccount.userId.toString()
			) {
				throw new ApiError(400, "Cannot transfer to the same account");
			}

			if (senderAccount.balance < amount) {
				throw new ApiError(400, "Insufficient balance");
			}

			await Account.updateOne(
				{ userId: req.user?._id },
				{ $inc: { balance: -amount } }
			).session(session);

			await Account.updateOne(
				{ userId: to },
				{ $inc: { balance: amount } }
			).session(session);
		});

		await session.commitTransaction();

		return res
			.status(200)
			.json(new ApiResponse(200, {amount}, "Transfer successfull"));
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	} finally {
		session.endSession();
	}
});

export { getBalance, transferMoney };
