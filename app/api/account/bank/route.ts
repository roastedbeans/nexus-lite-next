import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	return NextResponse.json({ message: 'Bank route is working!' });
}

export async function POST(req: NextRequest) {
	return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
