import { type Request, type Response } from "express";
import { Account } from "../models/Account";
import { User } from "../models/User";
import { INITIAL_ACCOUNT_BALANCE } from "../utils/accountBalance";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { signinSchema } from "../validations/signinValidation";
import { signupSchema } from "../validations/signupValidation";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
	try {
		const result = signupSchema.safeParse(req.body);

		if (!result.success) {
			throw new ApiError(400, "All fields are required");
		}

		const existedUser = await User.findOne({ email: result.data.email });

		if (existedUser) {
			throw new ApiError(409, "User already exists");
		}

		const user = await User.create({
			username: result.data.username,
			email: result.data.email,
			firstName: result.data.firstName,
			lastName: result.data.lastName,
			password: result.data.password,
		});

		const createdUser = await User.findById(user._id).select(
			"-password -refreshToken"
		);

		if (!createdUser) {
			throw new ApiError(500, "Something went wrong while creating user");
		}

		await Account.create({
			userId: user._id,
			balance: INITIAL_ACCOUNT_BALANCE,
		});

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					createdUser,
					"User registered successfully"
				)
			);
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

const generateAccessAndRefereshTokens = async (userId: string) => {
	try {
		const user = await User.findById(userId);

		if (!user) {
			throw new ApiError(404, "User not found");
		}

		const accessToken = await user.generateAccessToken();

		const refreshToken = await user.generateRefreshToken();

		if (refreshToken) {
			user.refreshToken = refreshToken;
		}

		await user.save({ validateBeforeSave: false });

		return { accessToken, refreshToken };
	} catch (error) {
		console.log("Error: ", error);
		throw new ApiError(
			500,
			"Something went wrong while generating referesh and access token"
		);
	}
};

const loginUser = asyncHandler(async (req: Request, res: Response) => {
	try {
		const result = signinSchema.safeParse(req.body);

		if (!result.success) {
			throw new ApiError(400, "All fields are required");
		}

		const user = await User.findOne({ email: result.data.email });

		if (!user) {
			throw new ApiError(404, "User with email not found");
		}

		const isMatch = await user.isPasswordCorrect(result.data.password);

		if (!isMatch) {
			throw new ApiError(400, "Invalid credentials");
		}

		const { accessToken, refreshToken } =
			await generateAccessAndRefereshTokens(user._id.toString());

		if (!accessToken || !refreshToken) {
			throw new ApiError(500, "Failed to generate tokens");
		}

		const loggedInUser = await User.findById(user._id).select(
			"-password -refreshToken"
		);

		const options = {
			httpOnly: true,
			secure: true,
		};

		return res
			.status(200)
			.cookie("accessToken", accessToken, options)
			.cookie("refreshToken", refreshToken, options)
			.json(
				new ApiResponse(
					200,
					{
						user: loggedInUser,
						accessToken,
						refreshToken,
					},
					"User logged in successfully"
				)
			);
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json(new ApiResponse(500, null, "Internal server error"));
	}
});

const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
	return res
		.status(200)
		.json(
			new ApiResponse(200, req.user, "Current user fetched successfully")
		);
});

export { getCurrentUser, loginUser, registerUser };
