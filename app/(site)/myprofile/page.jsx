"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import EditProfile from "@/app/components/User/editprofile";
import HistoryBooking from "@/app/components/User/historybooking";

export default function MyProfile() {
  const { data: session } = useSession();
  const isAdmin = session?.user.isAdmin;
  const router = useRouter();
  const [selectedMenu, setSelectedMenu] = React.useState("historybooking");

  // Function to handle user sign out
  const handleSignOut = async () => {
    try {
      const result = await signOut({ redirect: false }); // Use { redirect: false } to prevent automatic redirection
      if (!result.error) {
        // Manual redirection to the login page
        router.push("/login");
      } else {
        // Handle sign-out failure, e.g., show an error message
        toast.error("Sign-out failed.");
      }
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("An error occurred during sign-out.");
    }
  };

  // Function to render the selected component based on the menu choice
  const renderSelectedComponent = () => {
    if (selectedMenu === "historybooking") {
      return <HistoryBooking />;
    } else {
      return <EditProfile />;
    }
  };

  // Function to handle menu item clicks and update the selected menu
  const handleMenuClick = (menu) => (e) => {
    e.preventDefault(); // Prevent the default behavior (page reload)
    setSelectedMenu(menu);
  };

  const navigateToFindTable = () => {
    router.push("/findtable"); // Navigating to the '/findtable' route
  };

  const navigateToAdmin = () => {
    router.push("/admin"); // Navigating to the '/admin' route
  };

  return (
    <div className="bg-neutral-50 flex justify-items-stretch flex-wrap">
      <div className="justify-center items-center  bg-white   pl-14 pr-14 pt-8 pb-14  w-1/6">
        <div className="flex flex-col  grow basis-[0%] justify-center items-center">
          <div
            className="justify-center items-center flex w-[165px]  gap-2"
            onClick={navigateToFindTable}
          >
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/014f9ad4-f36d-414c-98c6-5777cbc9d5a8?"
              className="aspect-square object-contain object-center w-14 justify-center items-center overflow-hidden shrink-0 max-w-full my-auto"
            />
            <div className="text-zinc-800 text-center text-4xl leading-10 font-Belleza">
              TOAA
              <br />
              NIUNG
            </div>
          </div>

          <div className="justify-center items-center flex w-[165px] max-w-full flex-col mt-36 max-md:mt-10 font-DMSans font-medium">
            <div className="items-stretch flex flex-col px-2">
              <img
                loading="lazy"
                srcSet="https://cdn.discordapp.com/attachments/912258047374663680/1245373954756186192/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg?ex=66588460&is=665732e0&hm=404aceba4348d642388a4c6f072aa932c87d334f2e5ec90e6b27d339434ec5e3&"
                className="aspect-square object-contain object-center w-[95px] overflow-hidden self-center max-w-full rounded-[50%] bg-black"
              />
              <div className="text-black text-center text-2xl font-medium leading-8 mt-2.5">
                {session?.user.name}
              </div>
              <div className="text-zinc-800 text-base font-medium leading-5 self-center whitespace-nowrap">
                {session?.user.email}
              </div>
              <div
                className={`text-neutral-900 self-center text-xs leading-4 tracking-tight whitespace-nowrap justify-center items-stretch mt-1 px-1.5 rounded-3xl ${
                  isAdmin ? "bg-blue-200" : "bg-orange-300"
                }`}
              >
                {isAdmin ? "Admin" : "Guest"}
              </div>
            </div>

            <a onClick={handleMenuClick("historybooking")} href="#">
              <div className="text-zinc-800 text-base text-center font-medium leading-4 mt-14 py-2 px-1 rounded-lg hover:bg-gray-200">
                Reservation History
              </div>
            </a>

            <a onClick={handleMenuClick("settingsprofile")} href="#">
              <div className="text-zinc-800 text-base font-medium leading-4 mt-5 py-2 px-1 rounded-lg hover:bg-gray-200">
                Setting Profile
              </div>
            </a>

            {isAdmin && (
              <a onClick={navigateToAdmin} href="#">
                <div className="text-zinc-800 text-base font-medium leading-4 mt-5 py-2 px-1 rounded-lg hover:bg-gray-200">
                  Admin
                </div>
              </a>
            )}
          </div>

          <button
            onClick={handleSignOut}
            className="justify-center  items-center self-stretch flex  gap-3 mt-10 rounded-3xl hover:bg-gray-200 h-9 w-full"
          >
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/80e5d952-8074-4bbb-afd0-cbda96cffb7d?"
              className="aspect-square object-contain object-center w-4 overflow-hidden shrink-0 max-w-full"
            />
            <div className="text-red-700 text-sm leading-4 ">Log out</div>
          </button>
        </div>
      </div>
      {renderSelectedComponent()}
    </div>
  );
}
