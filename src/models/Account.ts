import { Document, Model, ObjectId, Schema, model } from "mongoose";

interface IAccount extends Document {
	userId: ObjectId;
	balance: number;
}

interface IAccountMethods {
	deposit(amount: number): Promise<void>;
	withdraw(amount: number): Promise<void>;
}

interface AccountModel extends Model<IAccount, {}, IAccountMethods> {}

const AccountSchema = new Schema<IAccount, AccountModel, IAccountMethods>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		balance: {
			type: Number,
			required: true,
			default: 0,
		},
	},
	{ timestamps: true }
);

export const Account = model<IAccount, AccountModel>("Account", AccountSchema);
