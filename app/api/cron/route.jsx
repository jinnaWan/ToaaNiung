import { mongooseConnect } from "@/lib/mongoose";
import { Booking } from "@/models/Booking";
import { NextResponse } from "next/server";
import { User } from "@/models/User";

export async function POST(req) {
  try {
    await mongooseConnect();
    const data = await req.json();
    const { thailandTime } = data;
    // console.log(thailandTime);

    // Fetch bookings that match the criteria
    const thirtyMinutesAgo = new Date(new Date(thailandTime) - 30 * 60 * 1000); // 30 minutes ago
    const bookingsToUpdate = await Booking.find({
      status: "In Progress",
      arrivalTime: { $lte: thirtyMinutesAgo }
    });

    // Update user penalties and status if necessary
    await Promise.all(
      bookingsToUpdate.map(async (booking) => {
        const user = await User.findOne({ email: booking.userEmail });

        if (user) {
          user.penalty += 1;
          if (user.penalty >= 3) {
            user.status = "Banned";
          }

          await user.save();
        }

        // Update the booking status to "Cancelled"
        booking.status = "Cancelled";
        await booking.save();
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
