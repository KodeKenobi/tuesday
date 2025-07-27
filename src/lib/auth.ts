import bcrypt from "bcryptjs";
import { db } from "./db";
import { NextRequest } from "next/server";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function getUserById(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
  });
}

export async function getUserByEmail(email: string) {
  return db.user.findUnique({
    where: { email },
  });
}

export async function getUserFromRequest(request: NextRequest) {
  const userId = request.cookies.get("userId")?.value;
  if (!userId) return null;

  return getUserById(userId);
}
