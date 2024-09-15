declare;
{
	namespace Express {
		export interface Request {
			user?: {
				_id: string;
				username: string;
				email: string;
				firstName: string;
				lastName: string;
				password: string;
				refreshToken: string;
			};
		}
	}
}
