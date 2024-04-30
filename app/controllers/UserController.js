import { NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import User from "@/models/User";
import Booking from "@/models/Booking";
import bcrypt from "bcryptjs";

// Controller function for updating user profile
export async function updateUserProfile(req) {
  try {
    await mongooseConnect();
    const data = await req.json();
    const { password, name, email, currentemail } = data;

    const user = new User();

    if (password) {
      return updateUserPassword(user, password, currentemail);
    } else if (name && email && currentemail) {
      return updateUserDetails(user, name, email, currentemail);
    } else {
      return NextResponse.json({ message: "Invalid data provided." }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json({ message: "Error updating user profile." }, { status: 500 });
  }
}

// Helper function to update user password
async function updateUserPassword(user, password, currentemail) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return user.updateUserByEmail(currentemail, { password: hashedPassword });
}

// Helper function to update user details (name and email)
async function updateUserDetails(user, name, email, currentemail) {
  return user.updateUserByEmail(currentemail, { name, email });
}

// Controller function for fetching and filtering bookings
export async function getUserBookings(req) {
  try {
    await mongooseConnect();
    const email = req.nextUrl.searchParams.get("data");
    console.log(email);

    const bookingModel = new Booking();
    const bookings = await bookingModel.getAllBookings({ userEmail: email });

    const filteredBookings = bookings.map((booking) => ({
      id: booking._id,
      tableName: booking.tableName,
      tableSize: booking.tableSize,
      numberOfPeople: booking.numberOfPeople,
      status: booking.status,
      arrivalTime: booking.arrivalTime,
    }));

    return NextResponse.json(filteredBookings, { status: 200 });
  } catch (error) {
    console.error("Error fetching and filtering bookings:", error);
    return NextResponse.json({ message: "Error fetching and filtering bookings." }, { status: 500 });
  }
}

// Controller function for updating booking status
export async function updateBookingStatus(req) {
  try {
    await mongooseConnect();
    const { selectedBookings } = await req.json();

    const bookingModel = new Booking();
    const updatedBookings = await bookingModel.updateBookingStatus(selectedBookings, "Cancelled");

    return NextResponse.json(updatedBookings, { status: 200 });
  } catch (error) {
    console.error("Error updating booking status:", error);
    return NextResponse.json({ message: "Error updating booking status." }, { status: 500 });
  }
}

/*
import { NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import User from "@/models/User";
import Booking from "@/models/Booking";
import bcrypt from "bcryptjs";

class UserController {
  async updateUserProfile(req) {
    try {
      await mongooseConnect();
      const data = await req.json();
      const { password, name, email, currentemail } = data;

      const user = new User();

      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const updatedUser = await user.updateUserByEmail(currentemail, { password: hashedPassword });

        return NextResponse.json(updatedUser, { status: 200 });
      } else if (name && email && currentemail) {
        const updatedUser = await user.updateUserByEmail(currentemail, { name, email });

        return NextResponse.json(updatedUser, { status: 200 });
      } else {
        return NextResponse.json({ message: "Invalid data provided." }, { status: 400 });
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      return NextResponse.json({ message: "Error updating user profile." }, { status: 500 });
    }
  }

  async getUserBookings(req) {
    try {
      await mongooseConnect();
      const searchParams = req.nextUrl.searchParams;
      const data = searchParams.get("data");
      const email = data.replace(/"/g, '');
      console.log(email);
      
      const bookingModel = new Booking();
      const bookings = await bookingModel.getAllBookings({ userEmail: email }); 

      const filteredBookings = bookings.map((booking) => ({
        id: booking._id,
        tableName: booking.tableName,
        tableSize: booking.tableSize,
        numberOfPeople: booking.numberOfPeople,
        status: booking.status,
        arrivalTime: booking.arrivalTime,
      }));

      return NextResponse.json(filteredBookings, { status: 200 });
    } catch (error) {
      console.error("Error fetching and filtering bookings:", error);
      return NextResponse.json({ message: "Error fetching and filtering bookings." }, { status: 500 });
    }
  }

  async updateBookingStatus(req) {
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

      const bookingModel = new Booking();
      const updatedBookings = await bookingModel.updateBookingById(selectedBookings, "Cancelled");

      return NextResponse.json(updatedBookings, { status: 200 });
    } catch (error) {
      console.error("Error updating booking status:", error);
      return NextResponse.json({ message: "Error updating booking status." }, { status: 500 });
    }
  }
}


export default UserController;

// Controller function for fetching and filtering bookings
export async function getUserBookings(req) {
  try {
    await mongooseConnect();
    const searchParams = req.nextUrl.searchParams;
    const data = searchParams.get("data");
    const  email = data;
    console.log(email);

    const bookingModel = new Booking();
    const bookings = await bookingModel.getAllBookings({userEmail : email});

    const filteredBookings = bookings.map((booking) => ({
      id: booking._id,
      tableName: booking.tableName,
      tableSize: booking.tableSize,
      numberOfPeople: booking.numberOfPeople,
      status: booking.status,
      arrivalTime: booking.arrivalTime,
    }));

    return NextResponse.json(filteredBookings, { status: 200 });
  } catch (error) {
    console.error("Error fetching and filtering bookings:", error);
    return NextResponse.json({ message: "Error fetching and filtering bookings." }, { status: 500 });
  }
}

// Controller function for updating booking status
export async function updateBookingStatus(req) {
  try {
    await mongooseConnect();
    const data = await req.json();
    const { selectedBookings } = data;

    const bookingModel = new Booking();
    const updatedBookings = await bookingModel.updateBookingStatus(selectedBookings, "Cancelled");

    return NextResponse.json(updatedBookings, { status: 200 });
  } catch (error) {
    console.error("Error updating booking status:", error);
    return NextResponse.json({ message: "Error updating booking status." }, { status: 500 });
  }
}
*/

