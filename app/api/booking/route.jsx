import { mongooseConnect } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { Booking } from "@/models/Booking";

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

    // Find bookings where the ranges intersect
    const bookedTables = await Booking.find({
      $or: [
        {
          arrivalTime: { $lte: datetime },
          departureTime: { $gte: datetime },
        },
        {
          arrivalTime: { $lte: endTime },
          departureTime: { $gte: endTime },
        },
        {
          arrivalTime: { $gte: datetime },
          departureTime: { $lte: endTime },
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

// export async function PUT(req) {
//   try {
//     await mongooseConnect();

//   } catch (error) {

//   }
// }
