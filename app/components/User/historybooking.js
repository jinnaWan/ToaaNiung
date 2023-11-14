"use client";
import * as React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import axios from "axios";

const headerIconSrc =
  "https://cdn.builder.io/api/v1/image/assets/TEMP/718d45fe-4d2a-4aac-acdc-7ae839147bf1?";

// Helper function to determine status styling
const getStatusStyle = (status) => {
  switch (status) {
    case "In Progress":
      return {
        color: "white",
        backgroundColor: "#ffce3d", // Example hex value
      };
    case "Completed":
      return {
        color: "white",
        backgroundColor: "#19ba42", // Example RGB value
      };
    case "Cancelled":
      return {
        color: "white",
        backgroundColor: "#ff5319", // Example CSS color name
      };
    default:
      return {
        color: "white",
        backgroundColor: "gray", // Example CSS color name
      };
  }
};

export default function HistoryBooking() {
  const { data: session } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [isCancellationMode, setIsCancellationMode] = useState(true);

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

  const handleConfirmCancel = async () => {
    try {
      const response = await axios.post("/api/user", {
        selectedBookings, // Sending selectedBookings data to the server
      });

      if (response.status === 200) {
        toast.success("Booking canceled successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000); // Wait for 1 second before refreshing the page
      }
      // Optionally, perform any additional actions after successful POST request
    } catch (error) {
      console.error("Error confirming booking cancellation:", error);
      // Handle errors here
      toast.error("Error canceling booking");
    }
  };

  const handleCheckboxChange = (bookingId) => {
    setSelectedBookings((prevSelected) => {
      if (prevSelected.includes(bookingId)) {
        return prevSelected.filter((id) => id !== bookingId);
      } else {
        return [...prevSelected, bookingId];
      }
    });
  };

  const handleCancelReservation = () => {
    setIsCancellationMode(false);
  };

  const handleBack = () => {
    setIsCancellationMode(true);
    setSelectedBookings([]);
  };

  return (
    <div className="flex  flex-col mt-20 self-start  w-5/6 ">
      <div className="overflow-x-auto items-stretch flex flex-col mx-auto">
        <div className="justify-between items-stretch flex w-full gap-5 max-md:max-w-full max-md:flex-wrap">
          <div className="items-stretch flex grow basis-[0%] flex-col px-5">
            <div className="text-zinc-800 text-4xl font-semibold whitespace-nowrap mr-5">
              Booking history
            </div>
          </div>

          {!isCancellationMode ? (
            <button
              href="#"
              className="text-white text-xs font-bold rounded shadow-md bg-sky-500 hover:bg-sky-400  my-auto px-3 py-2 "
              onClick={handleBack}
            >
              Back
            </button>
          ) : (
            <button
              href="#"
              className="text-white text-xs font-bold rounded shadow-md bg-red-500 hover:bg-red-400   my-auto px-3 py-2 "
              onClick={handleCancelReservation}
            >
              Cancel reservation
            </button>
          )}
        </div>
        <table className="min-w-full mx-auto  mt-6 font-DMSans">
          <colgroup>
            {bookings.length > 0 &&
              Object.keys(bookings[0]).map((header, index) => (
                <col key={index} />
              ))}
          </colgroup>
          <thead>
            <tr>
              {!isCancellationMode && (
                <th className="text-zinc-800  text-sm px-8 pb-4"></th>
              )}
              {bookings.length > 0 &&
                Object.keys(bookings[0]).map((header, index) => {
                  if (header !== "id") {
                    return (
                      <th
                        key={index}
                        className="text-zinc-800  text-sm px-8 pb-4"
                      >
                        <div className="flex items-center justify-center gap-2">
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
                    );
                  }
                  return null; // Do not render the cell for "id"
                })}
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking, rowIndex) => (
              <tr
                key={rowIndex}
                className="bg-white h-12 border border-b-8 border-neutral-50"
              >
                {booking.status === "In Progress" && !isCancellationMode ? (
                  <td className="text-center text-zinc-800 text-sm px-10">
                    <input
                      type="checkbox"
                      style={{
                        transform: "scale(1.5)", // Adjust the scale as needed to make the checkbox bigger
                        marginRight: "8px", // Optional: Add space between checkbox and label
                        marginTop: "10px",
                      }}
                      onChange={() => handleCheckboxChange(booking.id)}
                      checked={selectedBookings.includes(booking.id)}
                    />
                  </td>
                ) : (
                  !isCancellationMode && (
                    <td className="text-center text-zinc-800 text-sm px-10"></td>
                  )
                )}
                {Object.entries(booking).map(([key, value], colIndex) => {
                  if (key !== "id") {
                    return (
                      <td
                        key={colIndex}
                        className={`text-center text-zinc-800 text-sm px-16 ${
                          colIndex !== 0 ? "" : ""
                        }`}
                      >
                        {key === "arrivalTime" ? (
                          new Date(value).toLocaleString()
                        ) : key === "status" ? (
                          // Inside the component where the status is displayed
                          <div
                            className={`text-${
                              getStatusStyle(value).color
                            } text-sm px-3 py-1 font-medium whitespace-nowrap`}
                            style={{
                              backgroundColor:
                                getStatusStyle(value).backgroundColor,
                                borderRadius: "33px",
                            }}
                          >
                            {value}
                          </div>
                        ) : (
                          value
                        )}
                      </td>
                    );
                  }
                  return null; // Do not render the cell for "id"
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="justify-between items-stretch flex mt-5 w-full gap-5 max-md:max-w-full max-md:flex-wrap">
          {!isCancellationMode && (
            <button
              href="#"
              className="text-white text-xs font-bold rounded shadow-md bg-red-500 hover:bg-red-400  my-auto px-3 py-2 "
              onClick={handleConfirmCancel}
            >
              Confirm Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
