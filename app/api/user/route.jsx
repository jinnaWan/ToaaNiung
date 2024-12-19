// routes.js
import UserController from "@/app/controllers/UserController";

export async function PUT(req) {
  if (req.method === "PUT") {
    return await UserController.updateUserProfile(req);
  } else {
    return NextResponse.json({ message: "Method not allowed." }, { status: 405 });
  }
}

export async function GET(req) {
  if (req.method === "GET") {
    return await UserController.getUserBookings(req);
  } else {
    return NextResponse.json({ message: "Method not allowed." }, { status: 405 });
  }
}

export async function POST(req) {
  if (req.method === "POST") {
    return await UserController.updateBookingStatus(req);
  } else {
    return NextResponse.json({ message: "Method not allowed." }, { status: 405 });
  }
}
