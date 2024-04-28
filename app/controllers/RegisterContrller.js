import { NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// Controller function for user registration
export async function registerUser(req) {
  try {
    const { name, email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    const userModel = new User();
    await mongooseConnect();
    await userModel.createUser({ name, email, password: hashedPassword, penalty: 0, status: "Active" });

    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    console.error("An error occurred while registering the user:", error);
    return NextResponse.json({ message: "An error occurred while registering the user." }, { status: 500 });
  }
}

// Controller function for checking if a user exists
export async function checkUserExists(req) {
  try {
    await mongooseConnect();
    const { email } = await req.json();

    const userModel = new User();
    const user = await userModel.getUserByEmail(email);

    return NextResponse.json({ exists: user ? 1 : 0 });
  } catch (error) {
    console.error("An error occurred while checking user existence:", error);
    return NextResponse.json({ message: "An error occurred while checking user existence." }, { status: 500 });
  }
}
