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

export default UserService;