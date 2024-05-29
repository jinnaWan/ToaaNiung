// UserController.js
import { NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import BookingService from "../services/BookingService";
import UserService from "../services/UserService";
import User from "@/models/User";
import Booking from "@/models/Booking";

class UserController {
  constructor(userService, bookingService) {
    this.userService = userService;
    this.bookingService = bookingService;
  }

  async updateUserProfile(req) {
    try {
      await mongooseConnect();
      const searchParams = req.nextUrl.searchParams;
      const data = searchParams.get("data");
      const parsedData = JSON.parse(data || "{}");
      const updatedUser = await this.userService.updateUserProfile(parsedData);
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
