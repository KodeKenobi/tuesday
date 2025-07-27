import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: "If an account with that email exists, a password reset link has been sent." },
        { status: 200 }
      );
    }

    // Generate a secure random token
    const token = crypto.randomBytes(32).toString("hex");
    
    // Set expiration to 1 hour from now
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Create password reset record
    await db.passwordReset.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    // In a real application, you would send an email here
    // For now, we'll just return the token in the response
    // In production, you would send an email with a link like:
    // `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`
    
    console.log("Password reset token for", email, ":", token);
    console.log("Reset URL:", `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`);

    return NextResponse.json({
      message: "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 