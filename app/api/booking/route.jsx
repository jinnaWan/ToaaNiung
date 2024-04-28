import { mongooseConnect } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { Booking } from "@/models/Booking";
import { User } from "@/models/User";

export async function GET(req) {
  try {
    await mongooseConnect();

    // Get the selected datetime from the query parameters
    const searchParams = req.nextUrl.searchParams;
    const datetime = searchParams.get("datetime");

    console.log("Received datetime:", datetime);

    // Calculate the end time by adding 2 hours to the selected datetime
    const endTime = new Date(new Date(datetime).getTime() + 2 * 60 * 60 * 1000);

    console.log("End time:", endTime);

    // Find bookings where the ranges intersect and the status is not "Cancelled" or "Completed"
    const bookedTables = await Booking.find({
      status: { $nin: ["Cancelled", "Completed"] }, // Ignore "Cancelled" and "Completed" bookings
      $or: [
        // Case 1: Booking starts before the given end time and ends after the given datetime
        {
          arrivalTime: { $lt: endTime },
          departureTime: { $gt: new Date(datetime) },
        },
        // Case 2: Booking starts before or at the given datetime and ends after the given datetime
        {
          arrivalTime: { $lte: new Date(datetime) },
          departureTime: { $gt: new Date(datetime) },
        },
        // Case 3: Booking starts before the given end time and ends at or after the given end time
        {
          arrivalTime: { $lt: endTime },
          departureTime: { $gte: endTime },
        },
      ],
    });
    

    console.log("Found:", bookedTables);

    // Extract table names from bookedTables
    const bookedTableNames = bookedTables.map((booking) => booking.tableName);

    if (bookedTableNames.length === 0) {
      return NextResponse.json({ bookedTableNames: [] });
    }

    // Send the list of booked table names as the response
    return NextResponse.json({ bookedTableNames });
  } catch (error) {
    console.error("Error fetching booked tables", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await mongooseConnect();

    const { arrivalTime, userEmail, tableName, tableSize, numberOfPeople } =
      await req.json();

    // Fetch user data based on userEmail
    const user = await User.findOne({ email: userEmail });
    if (!user || user.status === "Banned") {
      return NextResponse.json(
        { error: "User not found or banned" },
        { status: 400 }
      );
    }

    // Convert the received arrivalTime to a Date object and ensure it's in UTC
    const parsedArrivalTime = new Date(arrivalTime + "Z"); // Adding 'Z' sets the time to UTC

    // Calculate departureTime as arrivalTime + 2 hours
    const departureTime = new Date(
      parsedArrivalTime.getTime() + 2 * 60 * 60 * 1000
    );

    // Create a new booking with the calculated departureTime
    await Booking.create({
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
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
