"use client";
import * as React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import axios from "axios";

const headerIconSrc = "https://cdn.builder.io/api/v1/image/assets/TEMP/718d45fe-4d2a-4aac-acdc-7ae839147bf1?";

// Helper function to determine status styling
const getStatusStyle = (status) => {
  switch (status) {
    case "In Progress":
      return {
        textColor: "orange-500",
        bgColor: "orange-100",
      };
    case "Completed":
      return {
        textColor: "green-500",
        bgColor: "green-100",
      };
    case "Cancelled":
      return {
        textColor: "red-500",
        bgColor: "red-100",
      };
    default:
      return {
        textColor: "gray-500",
        bgColor: "gray-100",
      };
  }
};

export default function HistoryBooking() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Fetch user's booking history when the component mounts
    const fetchUserBookings = async () => {
      try {
        const response = await axios.get("/api/user", {
          params: { data: JSON.stringify({ email: session?.user?.email }) },
        });

        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching user bookings:", error);
        toast.error("Error fetching user bookings");
      }
    };

    if (session) {
      fetchUserBookings();
    }
  }, [session]);

  return (
    <div className="flex  flex-col mt-20 self-start  w-5/6 ">
      <div className="overflow-x-auto items-stretch flex flex-col mx-auto">
        <div className="justify-between items-stretch flex w-full gap-5 max-md:max-w-full max-md:flex-wrap">
          <div className="items-stretch flex grow basis-[0%] flex-col px-5">
            <div className="text-zinc-800 text-4xl font-semibold whitespace-nowrap mr-5">
              Booking history
            </div>
          </div>

          <button
            href="#"
            className="text-white text-xs font-bold  rounded  shadow-black shadow-md bg-red-500  my-auto px-3 py-2 "
          >
            Cancel reservation
          </button>
        </div>

        <table className="min-w-full mx-auto mt-10 font-DMSans">
          <thead>
            <tr>
              {bookings.length > 0 &&
                Object.keys(bookings[0]).map((header, index) => (
                  <th key={index} className="text-zinc-800  text-sm px-8">
                    <div className="flex items-center justify-end gap-2">
                      <div className="text-stone-500 text-xs font-medium opacity-70">
                        {header}
                      </div>
                      <img
                        loading="lazy"
                        src={headerIconSrc}
                        className="aspect-[1.2] object-contain object-center w-1.5 opacity-70 overflow-hidden self-start shrink-0 max-w-full my-auto"
                      />
                    </div>
                  </th>
                ))}
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking, rowIndex) => (
              <tr key={rowIndex} className="bg-white">
                {Object.entries(booking).map(([key, value], colIndex) => (
                  <td key={colIndex} className="text-center text-zinc-800 text-sm  px-16">
                    {key === "arrivalTime"
                      ? new Date(value).toLocaleString()
                      : key === "status" ? (
                          <div
                            className={`text-${getStatusStyle(value).textColor} text-sm font-medium whitespace-nowrap bg-${getStatusStyle(value).bgColor} justify-center items-center self-stretch px-5 py-1 rounded-[33px]`}
                          >
                            {value}
                          </div>
                        ) : (
                          value
                        )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
