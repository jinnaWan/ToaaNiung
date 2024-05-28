// UserController.js
import { NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import User from "@/models/User";
import Booking from "@/models/Booking";
import bcrypt from "bcryptjs";

class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async updateUserProfile(data) {
    const { password, name, email, currentemail } = data;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      return this.userModel.updateUserByEmail(currentemail, { password: hashedPassword });
    } else if (name && email && currentemail) {
      return this.userModel.updateUserByEmail(currentemail, { name, email });
    } else {
      throw new Error("Invalid data provided.");
    }
  }
}

class BookingService {
  constructor(bookingModel) {
    this.bookingModel = bookingModel;
  }

  async getUserBookings(email) {
    const bookings = await this.bookingModel.getAllBookings({ userEmail: email });
    return bookings.map((booking) => ({
      id: booking._id,
      tableName: booking.tableName,
      tableSize: booking.tableSize,
      numberOfPeople: booking.numberOfPeople,
      status: booking.status,
      arrivalTime: booking.arrivalTime,
    }));
  }

  async updateBookingStatus(selectedBookings) {
    if (!selectedBookings || !Array.isArray(selectedBookings)) {
      throw new Error("Invalid data format.");
    }
    return this.bookingModel.updateBookingById(selectedBookings, "Cancelled");
  }
}

class UserController {
  constructor(userService, bookingService) {
    this.userService = userService;
    this.bookingService = bookingService;
  }

  async updateUserProfile(req) {
    try {
      await mongooseConnect();
      const data = await req.json();
      const updatedUser = await this.userService.updateUserProfile(data);
      return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
      console.error("Error updating user profile:", error);
      return NextResponse.json({ message: "Error updating user profile." }, { status: 500 });
    }
  }

  async getUserBookings(req) {
    try {
      await mongooseConnect();
      const searchParams = req.nextUrl.searchParams;
      const email = searchParams.get("data").replace(/"/g, '');
      const bookings = await this.bookingService.getUserBookings(email);
      return NextResponse.json(bookings, { status: 200 });
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
      const updatedBookings = await this.bookingService.updateBookingStatus(selectedBookings);
      return NextResponse.json(updatedBookings, { status: 200 });
    } catch (error) {
      console.error("Error updating booking status:", error);
      return NextResponse.json({ message: "Error updating booking status." }, { status: 500 });
    }
  }
}

const bookingModel = new Booking();
const userModel = new User();
const userService = new UserService(userModel);
const bookingService = new BookingService(bookingModel);

export default new UserController(userService, bookingService);
