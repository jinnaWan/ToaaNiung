import { NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import Booking from "@/models/Booking";
import User from "@/models/User";

// Controller function for fetching available tables
export async function getAvailableTables(req) {
  try {
    await mongooseConnect();

    const searchParams = req.nextUrl.searchParams;
    const datetime = searchParams.get("datetime");
    console.log(datetime);

    const endTime = new Date(new Date(datetime).getTime() + 2 * 60 * 60 * 1000);

    const bookingModel = new Booking();
    const bookedTables = await bookingModel.getAllBookings({
      $or: [
        {
          arrivalTime: { $lt: endTime },
          departureTime: { $gt: datetime },
        },
        {
          arrivalTime: { $lte: datetime },
          departureTime: { $gt: datetime },
        },
        {
          arrivalTime: { $lt: endTime },
          departureTime: { $gte: endTime },
        },
      ],
    });
    console.log("BookingTable:",bookedTables);

    const bookedTableNames = bookedTables.map((booking) => booking.tableName);

    if (bookedTableNames.length === 0) {
      return NextResponse.json({ bookedTableNames: [] });
    }

    return NextResponse.json({ bookedTableNames });
  } catch (error) {
    console.error("Error fetching booked tables", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Controller function for creating a new booking
export async function createBooking(req) {
  try {
    await mongooseConnect();

    const { arrivalTime, userEmail, tableName, tableSize, numberOfPeople } = await req.json();

    const UserModel = new User();
    const user = await UserModel.getUserByEmail(userEmail);
    console.log(user);
    if (!user || user.status === "Banned") {
      return NextResponse.json({ error: "User not found or banned" }, { status: 400 });
    }

    const parsedArrivalTime = new Date(arrivalTime + "Z");

    const departureTime = new Date(parsedArrivalTime.getTime() + 2 * 60 * 60 * 1000);

    
    const bookingModel = new Booking();
    await bookingModel.createBooking({
      arrivalTime: parsedArrivalTime,
      departureTime,
      userEmail,
      tableName,
      tableSize,
      numberOfPeople,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating booking", error);
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}
