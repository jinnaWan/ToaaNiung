import { mongooseConnect } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User } from "@/models/User";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Include penalty and status fields in the user creation
    await mongooseConnect();
    await User.create({ name, email, password: hashedPassword, penalty: 0, status: "Active" });

    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await mongooseConnect();
    const { email } = await req.json();
    const user = await User.findOne({ email }).select("_id");
    
    // Check if user exists
    if (user) {
      return NextResponse.json({ exists: 1 }); // Return 1 if user exists
    } else {
      return NextResponse.json({ exists: 0 }); // Return 0 if user doesn't exist
    }
  } catch (error) {
    console.log(error);
  }
}

