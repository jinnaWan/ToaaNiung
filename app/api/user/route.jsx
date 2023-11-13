import { User } from "@/models/User";
import { NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import bcrypt from "bcryptjs";
import { Booking } from "@/models/Booking";

export async function PUT(req) {
  try {
    await mongooseConnect();
    const searchParams = req.nextUrl.searchParams;
    const data = searchParams.get("data");
    const parsedData = JSON.parse(data || "{}");
    const { password, name, email, currentemail } = parsedData;

    if (password) {
      // If password is provided, generate a new password and save it to the database
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const updatedUser = await User.findOneAndUpdate(
        { email: currentemail },
        { $set: { password: hashedPassword } },
        { new: true }
      );

      return NextResponse.json(updatedUser, { status: 200 });
    } else if (name && email && currentemail) {
      // If name, email, or currentemail is provided, update the user profile
      const existingUser = await User.findOne({ email: currentemail });

      if (!existingUser) {
        return NextResponse.json({ message: "User not found." }, { status: 404 });
      }

      const updatedUser = await User.findOneAndUpdate(
        { email: currentemail },
        { $set: { name: name, email: email } },
        { new: true }
      );

      return NextResponse.json(updatedUser, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Invalid data provided." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { message: "Error updating user profile." },
      { status: 500 }
    );
  }
}

export async function GET(req) {
    try {
      await mongooseConnect();
      const searchParams = req.nextUrl.searchParams;
      const data = searchParams.get("data");
      const parsedData = JSON.parse(data || "{}");
      const { email } = parsedData;
  
      // Fetch bookings based on user's email
      const bookings = await Booking.find({ userEmail: email });
  
      // Filter the data to include only specific fields
      const filteredBookings = bookings.map((booking) => {
        return {
          tableName: booking.tableName,
          tableSize: booking.tableSize,
          numberOfPeople: booking.numberOfPeople,
          status: booking.status,
          arrivalTime: booking.arrivalTime,
        };
      });
  
      return NextResponse.json(filteredBookings, { status: 200 });
    } catch (error) {
      console.error("Error fetching and filtering bookings:", error);
      return NextResponse.json(
        { message: "Error fetching and filtering bookings." },
        { status: 500 }
      );
    }
  }
