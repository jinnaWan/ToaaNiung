import mongoose, { Schema } from "mongoose";

// Define a class representing the User model
class User {
  constructor() {
    // Initialize the User model based on the schema
    this.User = mongoose.models.User || mongoose.model("User", this.userSchema());
  }

  // Define the schema for the User model
  userSchema() {
    return new Schema(
      {
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        password: {
          type: String,
          required: true,
        },
        isAdmin: {
          type: Boolean,
          default: false,
        },
        penalty: {
          type: Number,
          default: 0,
        },
        status: {
          type: String,
          default: "Active",
        },
      },
      { timestamps: true }
    );
  }

  // Method to create a new user
  async createUser(data) {
    try {
      const user = new this.User(data);
      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Method to get user by email
  async getUserByEmail(email) {
    try {
      const user = await this.User.findOne({ email });
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Method to update user by email
  async updateUserByEmail(email, updates) {
    try {
      const user = await this.User.findOneAndUpdate({ email }, updates, { new: true });
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Method to delete user by email
  async deleteUserByEmail(email) {
    try {
      await this.User.findOneAndDelete({ email });
    } catch (error) {
      throw error;
    }
  }

  // Method to get all users
  async getAllUsers() {
    try {
      const users = await this.User.find();
      return users;
    } catch (error) {
      throw error;
    }
  }
}

// Export the UserModel class
export default User;
