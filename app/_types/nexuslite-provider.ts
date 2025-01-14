export interface CustomProfile {
	id: string;
	email: string;
	name: string;
	image?: string;
}

export interface CustomTokens {
	access_token: string;
	token_type: string;
	expires_at: number;
	refresh_token: string;
}
