import mongoose, { Schema } from "mongoose";

// Define a class representing the Booking model
class Booking {
  constructor() {
    // Initialize the Booking model based on the schema
    this.Booking = mongoose.models.Booking || mongoose.model("Booking", this.bookingSchema());
  }

  // Define the schema for the Booking model
  bookingSchema() {
    return new Schema(
      {
        arrivalTime: {
          type: Date,
          required: true,
        },
        departureTime: {
          type: Date,
          required: true,
        },
        userEmail: {
          type: String,
          required: true,
        },
        tableName: {
          type: String,
          required: true,
        },
        tableSize: {
          type: String,
          required: true,
        },
        numberOfPeople: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          default: "In Progress",
          enum: ["In Progress", "Completed", "Cancelled"], // Add other possible statuses as needed
        },
      },
      { timestamps: true }
    );
  }

  // Method to create a new booking
  async createBooking(data) {
    try {
      const booking = new this.Booking(data);
      await booking.save();
      return booking;
    } catch (error) {
      throw error;
    }
  }

  // Method to get all bookings
  async getAllBookings() {
    try {
      const bookings = await this.Booking.find();
      return bookings;
    } catch (error) {
      throw error;
    }
  }

  // Method to find a booking by ID
  async getBookingById(id) {
    try {
      const booking = await this.Booking.findById(id);
      return booking;
    } catch (error) {
      throw error;
    }
  }

  // Method to update a booking by ID
  async updateBookingById(id, updates) {
    try {
      const booking = await this.Booking.findByIdAndUpdate(id, updates, { new: true });
      return booking;
    } catch (error) {
      throw error;
    }
  }

  // Method to delete a booking by ID
  async deleteBookingById(id) {
    try {
      await this.Booking.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
}

// Export the BookingModel class
export default Booking;
