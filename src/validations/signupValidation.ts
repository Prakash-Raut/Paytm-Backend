import { z } from "zod";

export const usernameValidation = z
	.string()
	.min(3, { message: "Username must be atleast 3 characters" })
	.max(20, { message: "Username must be atmost 20 characters" });

export const emailValidation = z
	.string()
	.email({ message: "Invalid email address" });

export const passwordValidation = z
	.string()
	.min(6, { message: "Password must be atleast 8 characters" })
	.max(20, { message: "Password must be atmost 20 characters" });

export const firstNameValidation = z
	.string()
	.min(3, { message: "First name must be atleast 3 characters" })
	.max(20, { message: "First name must be atmost 20 characters" });

export const lastNameValidation = z
	.string()
	.min(3, { message: "Last name must be atleast 3 characters" })
	.max(20, { message: "Last name must be atmost 20 characters" });

export const signupSchema = z.object({
	username: usernameValidation,
	email: emailValidation,
	password: passwordValidation,
	firstName: firstNameValidation,
	lastName: lastNameValidation,
});
