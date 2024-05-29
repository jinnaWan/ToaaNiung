import axios from "axios";
import toast from "react-hot-toast";

// Concrete implementations
export class UserProfileUpdater {
  async updateUserProfile(data) {
    try {
      const response = await axios.put(`/api/user?data=${JSON.stringify(data)}`);
      console.log(response);

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Error updating profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating the profile.");
    }
  }
}

export class UserExistenceChecker {
  async checkUserExists(email, currentEmail) {
    try {
      const resUserExists = await fetch("api/register", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { exists } = await resUserExists.json();

      if (exists === 1 && email !== currentEmail) {
        toast.error("Email already exists.");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking user existence:", error);
      toast.error("An error occurred while checking user existence.");
      return false;
    }
  }
}