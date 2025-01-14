import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
	const { email, password } = await req.json();

	if (!email || !password) {
		return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
	}

	// Check if the user already exists
	const existingUser = await prisma.user.findUnique({ where: { email } });
	if (existingUser) {
		return NextResponse.json({ error: 'User already exists' }, { status: 400 });
	}

	// Hash the password
	const hashedPassword = await bcrypt.hash(password, 10);

	// Create the user
	const user = await prisma.user.create({
		data: {
			email,
			password: hashedPassword,
		},
	});

	return NextResponse.json({ message: 'User created successfully', user }, { status: 201 });
}

export async function OPTIONS() {
	return NextResponse.json({}, { status: 200 });
}
