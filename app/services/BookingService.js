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

export default BookingService;