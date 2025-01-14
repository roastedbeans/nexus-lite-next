import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
	const { email, password } = await req.json();

	if (!email || !password) {
		return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
	}

	// Find the user
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
	}

	// Check the password
	if (!user.password) {
		return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
	}

	// Generate a JWT token
	const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
		expiresIn: '1h',
	});

	return NextResponse.json({ message: 'Login successful', token }, { status: 200 });
}

export async function OPTIONS() {
	return NextResponse.json({}, { status: 200 });
}
