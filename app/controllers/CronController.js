import { mongooseConnect } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import User from "@/models/User";
import Booking from "@/models/Booking";

class CronController {
  async updateBookingStatus(req) {
    try {
      await mongooseConnect();
      const data = await req.json();
      const { thailandTime } = data;
      console.log(thailandTime);

      const thirtyMinutesAgo = new Date(new Date(thailandTime) - 30 * 60 * 1000); // 30 minutes ago

      const bookingModel = new Booking();
      const bookingsToUpdate = await bookingModel.getAllBookings({
        status: "In Progress",
        arrivalTime: { $lte: thirtyMinutesAgo },
      });
      console.log(bookingsToUpdate);

      const bookingsByUser = this.groupBookingsByUser(bookingsToUpdate);

      await this.updateUserAndBookingStatus(bookingsByUser);

      return NextResponse.json([], { status: 200 });
    } catch (error) {
      console.error("Error receiving time status:", error);
      return NextResponse.json(
        { message: "Error receiving time status." },
        { status: 500 }
      );
    }
  }

  groupBookingsByUser(bookings) {
    return bookings.reduce((acc, booking) => {
      acc[booking.userEmail] = (acc[booking.userEmail] || 0) + 1;
      return acc;
    }, {});
  }

  async updateUserAndBookingStatus(bookingsByUser) {
    await Promise.all(
      Object.entries(bookingsByUser).map(async ([userEmail, bookingCount]) => {
        const userModel = new User();
        const user = await userModel.getUserByEmail(userEmail);

        if (user) {
          user.penalty += bookingCount;
          if (user.penalty > 3) {
            user.status = "Banned";
          }

          await user.save();
        }

        const userBookings = this.filterUserBookings(bookingsByUser, userEmail);
        await this.updateBookingStatus(userBookings);
      })
    );
  }

  async updateBookingStatus(bookings) {
    await Promise.all(
      bookings.map(async (booking) => {
        booking.status = "Cancelled";
        await booking.save();
      })
    );
  }

  filterUserBookings(bookings, userEmail) {
    return bookings.filter((booking) => booking.userEmail === userEmail);
  }
}

export { CronController };
