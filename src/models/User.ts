import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Document, Model, Schema, model } from "mongoose";
import {
	JWT_EXPIRY,
	JWT_SECRET,
	REFRESH_TOKEN_EXPIRY,
	REFRESH_TOKEN_SECRET,
	SALT_ROUNDS,
} from "../config/env";

interface IUser extends Document {
	_id: string;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	password: string;
	refreshToken: string;
}

interface IUserMethods {
	isPasswordCorrect(password: string): Promise<boolean>;
	generateAccessToken(): Promise<string | undefined>;
	generateRefreshToken(): Promise<string | undefined>;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {}

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
	{
		username: {
			type: String,
			required: [true, "Username is required"],
			unique: true,
			trim: true,
			lowercase: true,
			minLength: 3,
			maxLength: 30,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			trim: true,
			lowercase: true,
			minLength: 3,
			maxLength: 30,
			match: [
				/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
				"Please use a valid email address",
			],
		},
		firstName: {
			type: String,
			required: [true, "First name is required"],
			lowercase: true,
			trim: true,
			maxLength: 30,
		},
		lastName: {
			type: String,
			required: [true, "Last name is required"],
			lowercase: true,
			trim: true,
			maxLength: 30,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minLength: 8,
		},
		refreshToken: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
	next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
	return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
	return new Promise((resolve, reject) => {
		jwt.sign(
			{ _id: this._id },
			JWT_SECRET,
			{ expiresIn: JWT_EXPIRY },
			(err, token) => {
				if (err) {
					return reject(err);
				}
				resolve(token);
			}
		);
	});
};

userSchema.methods.generateRefreshToken = function () {
	return new Promise((resolve, reject) => {
		jwt.sign(
			{ _id: this._id },
			REFRESH_TOKEN_SECRET,
			{ expiresIn: REFRESH_TOKEN_EXPIRY },
			(err, token) => {
				if (err) {
					return reject(err);
				}
				resolve(token);
			}
		);
	});
};

export const User = model<IUser, UserModel>("User", userSchema);
