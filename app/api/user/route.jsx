import { NextResponse } from "next/server";
import UserController from "@/app/controllers/UserController";

const userController = new UserController();

export async function PUT(req) {
  if (req.method === "PUT") {
    return await userController.updateUserProfile(req);
  } else {
    return NextResponse.json({ message: "Method not allowed." }, { status: 405 });
  }
}

export async function GET(req) {
  if (req.method === "GET") {
    return await userController.getUserBookings(req);
  } else {
    return NextResponse.json({ message: "Method not allowed." }, { status: 405 });
  }
}

export async function POST(req) {
  if (req.method === "POST") {
    return await userController.updateBookingStatus(req);
  } else {
    return NextResponse.json({ message: "Method not allowed." }, { status: 405 });
  }
}

