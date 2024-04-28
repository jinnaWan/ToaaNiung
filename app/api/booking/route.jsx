import { getAvailableTables, createBooking } from "@/app/controllers/BookingController";

export async function GET(req) {
  if (req.method === "GET") {
    return await getAvailableTables(req);
  } else {
    return NextResponse.json({ message: "Method not allowed." }, { status: 405 });
  }
}

export async function POST(req) {
  if (req.method === "POST") {
    return await createBooking(req);
  } else {
    return NextResponse.json({ message: "Method not allowed." }, { status: 405 });
  }
}
