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

export default function AllBookings() {
  const { data: session } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [isCancellationMode, setIsCancellationMode] = useState(true);
  const [loading, setLoading] = useState(true); // State to track loading
  // Define state for sorting
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHeader, setSearchHeader] = useState(""); // State to track the selected header for filtering
  const [filteredBookings, setFilteredBookings] = useState([]);

  const handleSearchChange = (e) => {
    if (!searchHeader) {
      toast.error('Please select a search option');
      return;
    }
  
    const searchTerm = e.target.value.toLowerCase();
  
    setSearchTerm(searchTerm);
    if (searchHeader) {
      const filteredResults = bookings.filter((booking) =>
        booking[searchHeader].toString().toLowerCase().includes(searchTerm)
      );
      setFilteredBookings(filteredResults);
    } else {
      // If searchHeader is not selected, apply search to sortedBookings
      const filteredResults = sortedBookings.filter((booking) =>
        Object.values(booking).some(
          (value) => value.toString().toLowerCase().indexOf(searchTerm) > -1
        )
      );
      setFilteredBookings(filteredResults);
    }
  };
  

  const handleHeaderSelect = (selectedHeader) => {
    setSearchHeader(selectedHeader);
    setSearchTerm("");
    // Reset to original bookings if search header is cleared
    if (!selectedHeader) {
      setBookings(sortedBookings);
    }
  };

  // Function to handle header click for sorting
  const handleHeaderClick = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Function to perform actual sorting based on sortConfig
  const sortedBookings = React.useMemo(() => {
    const sortableBookings = [...bookings];
    if (sortConfig.key) {
      sortableBookings.sort((a, b) => {
        let comparison = 0;
        if (a[sortConfig.key] > b[sortConfig.key]) {
          comparison = 1;
        } else if (a[sortConfig.key] < b[sortConfig.key]) {
          comparison = -1;
        }
        return sortConfig.direction === "ascending" ? comparison : -comparison;
      });
    }
    return sortableBookings;
  }, [bookings, sortConfig]);

  // Use useEffect to update filteredBookings when sortConfig or bookings change
  useEffect(() => {
    if (searchTerm && searchHeader) {
      const filteredResults = bookings.filter((booking) =>
        booking[searchHeader].toString().toLowerCase().includes(searchTerm)
      );
      setFilteredBookings(filteredResults);
    } else {
      // Update filteredBookings with sortedBookings
      setFilteredBookings(sortedBookings);
    }
  }, [searchTerm, searchHeader, bookings, sortedBookings]);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await axios.put(`/api/admin`, {
        bookingId: bookingId,
        newStatus: newStatus,
      });

      if (response.status === 200) {
        toast.success("Booking status updated successfully");
        // You might want to refresh the bookings after updating the status
        // Implement a function to refresh bookings or refetch the bookings here
        // Update the state directly to trigger a component rerender
        setBookings((prevBookings) => {
          const updatedBookings = prevBookings.map((booking) => {
            if (booking.id === bookingId) {
              return { ...booking, status: newStatus }; // Update the status of the specific booking
            }
            return booking;
          });
          return updatedBookings;
        });
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("Error updating booking status");
    }
  };

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const response = await axios.get("/api/admin");

        setBookings(response.data);
        setLoading(false); // Update loading state after fetching
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
      const response = await axios.post("/api/admin", {
        selectedBookings, // Sending selectedBookings data to the server
      });

      if (response.status === 200) {
        toast.success("Booking deleted successfully");
        // Filter out the deleted bookings from the state
        setBookings((prevBookings) =>
          prevBookings.filter(
            (booking) => !selectedBookings.includes(booking.id)
          )
        );
      }
      // Optionally, perform any additional actions after successful POST request
    } catch (error) {
      console.error("Error confirming booking deletation:", error);
      // Handle errors here
      toast.error("Error deleting booking");
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

  const formatThailandTime = (date) => {
    if (!(date instanceof Date)) {
      date = new Date(date); // Convert to Date object if not already
    }

    const thailandTime = new Date(date.getTime() - 7 * 60 * 60 * 1000);

    return thailandTime.toLocaleString();
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

          {bookings.length > 0 &&
            !loading &&
            (!isCancellationMode ? (
              <button
                href="#"
                className="text-white text-xs font-bold rounded shadow-md bg-sky-500 hover:bg-sky-400 my-auto px-3 py-2"
                onClick={handleBack}
              >
                Back
              </button>
            ) : (
              <button
                href="#"
                className="text-white text-xs font-bold rounded shadow-md bg-red-500 hover:bg-red-400 my-auto px-3 py-2"
                onClick={handleCancelReservation}
              >
                Delete reservation
              </button>
            ))}
        </div>
        <div className="justify-between items-stretch flex w-full gap-5 max-md:max-w-full max-md:flex-wrap">
          {/* insert your search code here */}
          <div className="items-stretch flex gap-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="border rounded px-2 py-1 focus:outline-none"
            />
            <select
              value={searchHeader}
              onChange={(e) => handleHeaderSelect(e.target.value)}
              className="border rounded px-2 py-1 focus:outline-none"
            >
              <option value="">Select header</option>
              {bookings.length > 0 &&
                Object.keys(bookings[0]).map((header, index) => {
                  if (header !== "id") {
                    return (
                      <option key={index} value={header}>
                        {header}
                      </option>
                    );
                  }
                  return null; // Exclude "id" from options
                })}
            </select>
          </div>
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
                <th className="text-zinc-800  text-sm px-6 pb-4"></th>
              )}
              {bookings.length > 0 &&
                Object.keys(bookings[0]).map((header, index) => {
                  if (header !== "id") {
                    return (
                      <th
                        key={index}
                        className="text-zinc-800  text-sm px-6 pb-4"
                        onClick={() => handleHeaderClick(header)} // Handle header click
                      >
                        <div className="flex items-center justify-center gap-2">
                          <div className="text-stone-500 text-xs font-medium opacity-70">
                            {header}
                          </div>
                          {/* Rotate the image based on sortConfig */}
                          <img
                            loading="lazy"
                            src={headerIconSrc}
                            className={`aspect-[1.2] object-contain object-center w-1.5 opacity-70 overflow-hidden self-start shrink-0 max-w-full my-auto transform ${
                              sortConfig.key === header
                                ? sortConfig.direction === "ascending"
                                  ? "rotate-180"
                                  : "rotate-0"
                                : ""
                            }`}
                            alt="Sort Icon"
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
            {filteredBookings.map((booking, rowIndex) => (
              <tr
                key={rowIndex}
                className="bg-white h-12 border border-b-8 border-neutral-50"
              >
                {!isCancellationMode ? (
                  <td className="text-center text-zinc-800 text-sm px-6">
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
                    <td className="text-center text-zinc-800 text-sm px-6"></td>
                  )
                )}
                {Object.entries(booking).map(([key, value], colIndex) => {
                  if (key !== "id") {
                    return (
                      <td
                        key={colIndex}
                        className={`text-center text-zinc-800 text-sm px-10 ${
                          colIndex !== 0 ? "" : ""
                        }`}
                      >
                        {key === "arrivalTime" ? (
                          // Apply the Thailand time zone offset
                          formatThailandTime(value) // Format the arrival time to Thailand time
                        ) : key === "status" ? (
                          // Inside the component where the status is displayed
                          <select
                            value={value}
                            onChange={(e) =>
                              handleStatusChange(booking.id, e.target.value)
                            }
                            className="rounded-full text-white text-sm px-3 py-1 font-medium"
                            style={{
                              backgroundColor:
                                getStatusStyle(value).backgroundColor,
                            }}
                          >
                            {["In Progress", "Completed", "Cancelled"].map(
                              (status, index) => (
                                <option
                                  key={index}
                                  value={status}
                                  style={{
                                    backgroundColor:
                                      getStatusStyle(status).backgroundColor,
                                  }}
                                >
                                  {status}
                                </option>
                              )
                            )}
                          </select>
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
        <div className="mb-10 justify-between items-stretch flex mt-5 w-full gap-5 max-md:max-w-full max-md:flex-wrap">
          {!isCancellationMode && (
            <button
              href="#"
              className="text-white text-xs font-bold rounded shadow-md bg-red-500 hover:bg-red-400  my-auto px-3 py-2 "
              onClick={handleConfirmCancel}
            >
              Confirm Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
