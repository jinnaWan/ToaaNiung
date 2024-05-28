import { mongooseConnect } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import User from "@/models/User";
import Booking from "@/models/Booking";

export async function POST(req) {
  try {
    await mongooseConnect();
    const data = await req.json();
    const { thailandTime } = data;
    console.log(thailandTime);

    // Fetch bookings that match the criteria
    const thirtyMinutesAgo = new Date(new Date(thailandTime) - 30 * 60 * 1000); // 30 minutes ago
    const bookingModel = new Booking();
    const bookingsToUpdate = await bookingModel.getAllBookings({
      status: "In Progress",
      arrivalTime: { $lte: thirtyMinutesAgo }
    });
    console.log(bookingsToUpdate);

    // Group bookings by userEmail and count the number of bookings for each user
    const bookingsByUser = bookingsToUpdate.reduce((acc, booking) => {
      acc[booking.userEmail] = (acc[booking.userEmail] || 0) + 1;
      return acc;
    }, {});

    // Update user penalties and status based on the number of bookings found
    await Promise.all(
      Object.entries(bookingsByUser).map(async ([userEmail, bookingCount]) => {
        const UserModel = new User();
        const user = await UserModel.getUserByEmail(userEmail);

        if (user) {
          user.penalty += bookingCount; // Increment penalty by the number of bookings
          if (user.penalty > 3) {
            user.status = "Banned";
          }

          await user.save();
        }

        // Update the booking status to "Cancelled" for each booking
        const userBookings = bookingsToUpdate.filter(
          (booking) => booking.userEmail === userEmail
        );
        await Promise.all(
          userBookings.map(async (booking) => {
            booking.status = "Cancelled";
            await booking.save();
          })
        );
      })
    );

    return NextResponse.json([], { status: 200 });
  } catch (error) {
    console.error("Error receiving time status:", error);
    return NextResponse.json(
      { message: "Error receiving time status." },
      { status: 500 }
    );
  }
}

