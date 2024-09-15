import { z } from "zod";

export const emailValidation = z
	.string()
	.email({ message: "Invalid email address" });

export const passwordValidation = z
	.string()
	.min(6, { message: "Password must be atleast 8 characters" })
	.max(20, { message: "Password must be atmost 20 characters" });

export const signinSchema = z.object({
	email: emailValidation,
	password: passwordValidation,
});
