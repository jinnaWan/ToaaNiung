import { NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import User from "@/models/User";
import Booking from "@/models/Booking";
import bcrypt from "bcryptjs";

class UserRepository {
  async updateUserByEmail(email, updateData) {
    return User.updateOne({ email }, { $set: updateData });
  }
}

class BookingRepository {
  async getAllBookings(query) {
    return Booking.find(query);
  }

  async updateBookingById(bookingIds, status) {
    return Booking.updateMany(
      { _id: { $in: bookingIds } },
      { $set: { status } }
    );
  }
}

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async updateUserProfile(data) {
    const { password, name, email, currentemail } = data;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      return this.userRepository.updateUserByEmail(currentemail, { password: hashedPassword });
    } else if (name && email && currentemail) {
      return this.userRepository.updateUserByEmail(currentemail, { name, email });
    } else {
      throw new Error("Invalid data provided.");
    }
  }
}

class BookingService {
  constructor(bookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  async getUserBookings(email) {
    const bookings = await this.bookingRepository.getAllBookings({ userEmail: email });
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
    return this.bookingRepository.updateBookingById(selectedBookings, "Cancelled");
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

const userRepository = new UserRepository();
const bookingRepository = new BookingRepository();
const userService = new UserService(userRepository);
const bookingService = new BookingService(bookingRepository);
const userController = new UserController(userService, bookingService);

export default userController;
