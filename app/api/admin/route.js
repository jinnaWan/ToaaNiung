import { mongooseConnect } from "@/lib/mongoose";
import { Booking } from "@/models/Booking";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
      await mongooseConnect();
  
      // Fetch bookings based on user's email
      const bookings = await Booking.find();
  
      // Filter the data to include only specific fields
      const filteredBookings = bookings.map((booking) => {
        return {
          id: booking._id,
          userEmail: booking.userEmail,
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

  export async function POST(req) {
    try {
      await mongooseConnect();
      const data = await req.json();
      const { selectedBookings } = data;
  
      if (!selectedBookings || !Array.isArray(selectedBookings)) {
        return NextResponse.json(
          { message: "Invalid data format." },
          { status: 400 }
        );
      }
  
      // Delete bookings from the database
      const deletionResults = await Promise.all(
        selectedBookings.map(async (bookingId) => {
          return await Booking.deleteOne({ _id: bookingId });
          // Use Booking.deleteMany if you need to delete multiple bookings based on a condition
        })
      );
  
      return NextResponse.json(deletionResults, { status: 200 });
    } catch (error) {
      console.error("Error deleting bookings:", error);
      return NextResponse.json(
        { message: "Error deleting bookings." },
        { status: 500 }
      );
    }
  }

  export async function PUT(req) {
    try {
      await mongooseConnect();
      const data = await req.json();
      const { bookingId, newStatus } = data;
  
      // Find the booking by ID and update its status
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        { status: newStatus },
        { new: true }
      );
  
      if (!updatedBooking) {
        return NextResponse.json(
          { message: "Booking not found." },
          { status: 404 }
        );
      }
  
      return NextResponse.json(updatedBooking, { status: 200 });
    } catch (error) {
      console.error("Error updating booking status:", error);
      return NextResponse.json(
        { message: "Error updating booking status." },
        { status: 500 }
      );
    }
  }