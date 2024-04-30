// Import necessary libraries and components
import * as React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import axios from "axios";
import { useState, useEffect } from "react";

// Define a decorator function for password validation
const withPasswordValidation = (WrappedComponent) => {
  return class extends React.Component {
    validatePassword = (password) => {
      // Add your password validation logic here
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const isLongEnough = password.length >= 8;

      return hasUppercase && hasLowercase && hasNumber && hasSpecialChar && isLongEnough;
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          validatePassword={this.validatePassword}
        />
      );
    }
  };
};

// Decorate the ChangePassword component
const ChangePasswordWithValidation = withPasswordValidation(ChangePassword);

// ChangePassword component
function ChangePassword({ validatePassword }) {
  // Define state variables for the new password and confirm password
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [currentemail, setCurrentemail] = React.useState("")
  const { data: session } = useSession();

  useEffect(() => {
    // Update currentemail once session is available
    if (session) {
      setCurrentemail(session.user.email)
    }
  }, [session]);

  // Define function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation for the new password and confirm password
    if (!password.trim() || !confirmPassword.trim()) {
      toast.error("New password and confirm password are required.");
      return;
    }

    // Use the validatePassword function provided by the decorator
    if (!validatePassword(password)) {
      toast.error(
        "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    // Check if the new password matches the confirm password
    if (password !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      // Make API call to update the password
      const response = await axios.put(
        `/api/user?data=${JSON.stringify({
          password: password,
          currentemail: currentemail, // Replace with the actual current email
        })}`
      );

      // Check the response status and display appropriate messages
      if (response.status === 200) {
        toast.success("Password changed successfully!");
      } else {
        toast.error("Error changing password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("An error occurred while changing the password.");
    }
  };

  // Render the ChangePassword form
  return (
    <div className="flex flex-col mt-20 self-start w-5/6">
      <form
        onSubmit={handleSubmit}
        className="mx-auto self-stretch flex flex-col w-1/5 mt-10 max-md:mt-10 font-Oxygen"
      >
        <div className="text-slate-900 text-4xl font-bold tracking-tighter whitespace-nowrap items-start w-1/2">
          Change Password
        </div>
        <div className="text-slate-900 text-base font-bold whitespace-nowrap mt-12">
          New Password
        </div>
        <input
          className="text-zinc-400 text-sm border p-2.5 rounded-md border-solid border-zinc-400 border-opacity-30 w-full"
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <div className="text-slate-900 text-base font-bold whitespace-nowrap mt-12">
          Confirm Password
        </div>
        <input
          className="text-zinc-400 text-sm border p-2.5 rounded-md border-solid border-zinc-400 border-opacity-30 w-full"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        ></input>

        <div className="items-start self-stretch flex grow flex-col w-full mt-8">
          <button
            type="submit"
            className="justify-center bg-indigo-600 items-center text-white item-center self-stretch flex w-full flex-col px-20 py-3 rounded-xl max-md:px-5 hover:bg-indigo-400 hover:text-black"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

// Render the decorated component
export default function ChangePasswordMain() {
  return <ChangePasswordWithValidation />;
}