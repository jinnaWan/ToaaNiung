import * as React from "react";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ChangePassword from "./changepassword";
import axios from "axios";
import {
  UserProfileUpdater,
  UserExistenceChecker,
} from "./userProfileUtils";


// Define a Facade class for handling user profile updates
// class UserProfileFacade {
//   static async updateUserProfile(data) {
//     try {
//       const response = await axios.put(`/api/user?data=${JSON.stringify(data)}`);
//       console.log(response);

//       if (response.status === 200) {
//         toast.success("Profile updated successfully!");
//       } else {
//         toast.error("Error updating profile.");
//       }
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       toast.error("An error occurred while updating the profile.");
//     }
//   }

//   static async checkUserExists(email, currentEmail) {
//     try {
//       const resUserExists = await fetch("api/register", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email }),
//       });

//       const { exists } = await resUserExists.json();

//       if (exists === 1 && email !== currentEmail) {
//         toast.error("Email already exists.");
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.error("Error checking user existence:", error);
//       toast.error("An error occurred while checking user existence.");
//       return false;
//     }
//   }
// }

export default function EditProfile() {
  const { data: session, update } = useSession();
  const isAdmin = session?.user.isAdmin;
  const router = useRouter();
  const [showChangePassword, setShowChangePassword] = React.useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    currentemail: "", // Initialize with an empty string
  });

  useEffect(() => {
    // Update currentemail once session is available
    if (session) {
      setData((prevData) => ({
        ...prevData,
        currentemail: session.user.email,
      }));
    }
  }, [session]);

  const updateSession = async () => {
    try {
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.name, // Update with the new name
          email: data.email, // Update with the new email
        },
      });
      //   toast.success("Session updated successfully!");
    } catch (error) {
      console.error("Error updating session:", error);
      //   toast.error("An error occurred while updating the session.");
    }
  };

  const handleShowChangePassword = () => {
    setShowChangePassword(true);
  };

  const handleCancelChangePassword = () => {
    setShowChangePassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simple validation for name and email
    if (!data.name.trim() || !data.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }
  
    // Use the concrete implementations of the interfaces
    const userExistenceChecker = new UserExistenceChecker();
    const emailExists = await userExistenceChecker.checkUserExists(
      data.email,
      data.currentemail
    );
    if (emailExists) {
      return;
    }
  
    const userProfileUpdater = new UserProfileUpdater();
    await userProfileUpdater.updateUserProfile(data);
    updateSession(); // Update the session on the client side
  };

  return (
    <>
      {showChangePassword ? (
        <ChangePassword onCancel={handleCancelChangePassword} />
      ) : (
        <div className="flex  flex-col mt-20 self-start  w-5/6 ">
          <form
            onSubmit={handleSubmit}
            className="mx-auto  self-stretch flex flex-col w-1/5 mt-10 max-md:mt-10 font-Oxygen"
          >
            <div className="text-slate-900 text-4xl font-bold tracking-tighter whitespace-nowrap items-start w-1/2">
              Edit your profile
            </div>
            <div className="text-slate-900 text-base font-bold whitespace-nowrap mt-12 ">
              Name
            </div>
            <input
              className="text-zinc-400 text-sm border  p-2.5 rounded-md border-solid border-zinc-400 border-opacity-30 w-full"
              onChange={(e) => setData({ ...data, name: e.target.value })}
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="New Name"
            ></input>
            <div className="text-slate-900 text-base font-bold whitespace-nowrap mt-12">
              Email
            </div>
            <input
              className="text-zinc-400 text-sm border  p-2.5 rounded-md border-solid border-zinc-400 border-opacity-30 w-full"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              onChange={(e) => setData({ ...data, email: e.target.value })}
              placeholder="New Email"
            ></input>

            <div className="items-start self-stretch flex grow flex-col w-full mt-8">
              <button
                type="submit"
                className="justify-center bg-indigo-600  items-center text-white item-center self-stretch flex w-full flex-col px-20 py-3 rounded-xl max-md:px-5 hover:bg-indigo-400 hover:text-black "
              >
                Continue
              </button>
            </div>

            <div className="text-slate-900 text-base font-bold whitespace-nowrap mt-12">
              Password
            </div>
            <a
              onClick={handleShowChangePassword}
              className="text-indigo-600 text-sm mt-5"
            >
              Change my password
            </a>
          </form>
        </div>
      )}
    </>
  );
}