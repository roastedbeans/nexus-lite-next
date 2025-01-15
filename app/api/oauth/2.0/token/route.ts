import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
export async function POST(req: NextRequest, res: NextResponse) {
	const {
		grant_type, // client_credential (IA-001), password (IA-002)
		client_id, // Client identification value issued when registering MyData service on the comprehensive portal
		client_secret,
		scope,
	} = await req.json();

	// Integrated Authentication - 101
	// Issuance of access tokens using credentials for integrated authentication APIs
	// previously issued by each certification agency
	// the intermediary agency calls this API to issue access tokens on behalf of the agency.
	if (!grant_type || !client_id || !client_secret || !scope) {
		return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
	}

	if (grant_type !== 'client_credential' || grant_type !== 'password') {
		return NextResponse.json({ error: 'Invalid grant type' }, { status: 400 });
	}

	if (client_id !== process.env.NEXUSLITE_CLIENT_ID || client_secret !== process.env.NEXUSLITE_CLIENT_SECRET) {
		return NextResponse.json({ error: 'Invalid client credentials' }, { status: 401 });
	}

	if (scope !== 'ca') {
		return NextResponse.json({ error: 'Invalid scope' }, { status: 400 });
	}

	const access_token = uuidv4();
	const token_type = 'Bearer';
	const expires_at = Date.now() + 3600;

	return NextResponse.json({ access_token, token_type, expires_at, scope }, { status: 200 });
}
