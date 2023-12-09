"use client";

import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Header from "@/app/components/Random/header";

export default function ConfirmBooking() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const data = searchParams.get("data");
  const parsedData = JSON.parse(data || "{}"); // Default to an empty object if 'data' is null or undefined

  // Destructure properties from parsed data
  const { tableName, arrivalTime, numberOfPeople, tableSize } = parsedData;

  // Format the arrivalTime using the Date object
  const formattedArrivalTime = new Date(arrivalTime).toLocaleString();

  const handleConfirmBooking = async () => {
    try {
      // Send a POST request to the bookings API
      await axios.post("/api/booking", {
        arrivalTime,
        userEmail: session?.user.email, // Assuming you have user email in the session
        tableName,
        tableSize,
        numberOfPeople,
      });

      // Handle success, e.g., show a confirmation message
      console.log("Booking confirmed!");
      toast.success("Booking confirmed!");
      router.push("/findtable");
    } catch (error) {
      // Handle error, e.g., show an error message
      console.error("Error confirming booking", error);
      toast.error("Error confirming booking");
    }
  };

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawSeat = (ctx, x, y, radius, highlightSize) => {
      ctx.beginPath();
      ctx.arc(x, y, radius + highlightSize, 0, 2 * Math.PI);
      ctx.fill();
    };

    const drawSelectedTable = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "lightgrey";

      // Set canvas center coordinates
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Calculate the size ratio for tables (adjust this ratio as needed)
      const tableSizeRatio = 4;

      const tableRadius = 15 * tableSizeRatio; // Adjusted table radius
      const seatRadius = 7 * tableSizeRatio; // Adjusted seat radius
      const spaceBetweenTableAndSeat = 15 * tableSizeRatio; // Adjusted space between table and seat
      const seatCount = 3; // Number of seats on each side

      // ... (rest of the code remains the same)

      // Update the drawing positions to center the tables within the canvas
      const positionX = centerX; // Center X
      const positionY = centerY; // Center Y

      // Adjusted table sizes based on the scale factor
      const adjustedTableRadius = 15 * tableSizeRatio;
      const adjustedSeatRadius = 7 * tableSizeRatio;
      const adjustedSpaceBetweenTableAndSeat = 15 * tableSizeRatio;

      if (tableSize === "TableM") {
        // Draw medium table (rectangle) with seats
        const rectWidth = 50 * tableSizeRatio; // Adjusted width of the rectangle
        const rectHeight = 40 * tableSizeRatio; // Adjusted height of the rectangle

        // Calculate position for drawing the rectangle
        const rectX = centerX - rectWidth / 2;
        const rectY = centerY - rectHeight / 2;

        ctx.beginPath();
        ctx.rect(rectX, rectY, rectWidth, rectHeight);
        ctx.fill();

        // Calculate the positions of seats
        const seatPositions = [
          {
            x: centerX - 15 * tableSizeRatio - spaceBetweenTableAndSeat / 2,
            y: centerY - 30 * tableSizeRatio,
          },
          {
            x: centerX + 15 * tableSizeRatio + spaceBetweenTableAndSeat / 2,
            y: centerY - 30 * tableSizeRatio,
          },
          {
            x: centerX - 15 * tableSizeRatio - spaceBetweenTableAndSeat / 2,
            y: centerY + 30 * tableSizeRatio,
          },
          {
            x: centerX + 15 * tableSizeRatio + spaceBetweenTableAndSeat / 2,
            y: centerY + 30 * tableSizeRatio,
          },
        ];

        // Draw seats
        seatPositions.forEach((position) => {
          drawSeat(ctx, position.x, position.y, adjustedSeatRadius, 0);
        });
      } else if (tableSize === "TableL") {
        // Draw large table (rounded rectangle) with seats
        const roundedRectRadius = 10 * tableSizeRatio; // Adjusted rounded rectangle radius
        const tableWidth = 60 * tableSizeRatio; // Adjusted width of the table
        const tableHeight = 40 * tableSizeRatio; // Adjusted height of the table

        // Calculate the positions for drawing the rounded rectangle
        const rectX = centerX - tableWidth / 2;
        const rectY = centerY - tableHeight / 2;

        ctx.beginPath();
        ctx.moveTo(rectX + roundedRectRadius, rectY);
        ctx.arcTo(
          rectX + tableWidth,
          rectY,
          rectX + tableWidth,
          rectY + tableHeight,
          roundedRectRadius
        );
        ctx.arcTo(
          rectX + tableWidth,
          rectY + tableHeight,
          rectX,
          rectY + tableHeight,
          roundedRectRadius
        );
        ctx.arcTo(rectX, rectY + tableHeight, rectX, rectY, roundedRectRadius);
        ctx.arcTo(rectX, rectY, rectX + tableWidth, rectY, roundedRectRadius);
        ctx.closePath();
        ctx.fill();

        // Calculate the angle between each seat
        const angleIncrement = (Math.PI * 2) / seatCount;

        // Draw seats on the top
        for (let i = 0; i < seatCount; i++) {
          const angle = i * angleIncrement;
          const seatX =
            centerX -
            Math.cos(angle) * (30 * tableSizeRatio + spaceBetweenTableAndSeat);
          const seatY =
            centerY -
            Math.sin(angle) * (20 * tableSizeRatio + spaceBetweenTableAndSeat);
          drawSeat(ctx, seatX, seatY, adjustedSeatRadius, 0);
        }

        // Draw seats on the bottom
        for (let i = 0; i < seatCount; i++) {
          const angle = Math.PI + i * angleIncrement;
          const seatX =
            centerX -
            Math.cos(angle) * (30 * tableSizeRatio + spaceBetweenTableAndSeat);
          const seatY =
            centerY -
            Math.sin(angle) * (20 * tableSizeRatio + spaceBetweenTableAndSeat);
          drawSeat(ctx, seatX, seatY, adjustedSeatRadius, 0);
        }
      } else if (tableSize === "TableS") {
        // Draw small table (TableS) with seats
        ctx.beginPath();
        ctx.arc(positionX, positionY, tableRadius + 0, 0, 2 * Math.PI);
        ctx.fill();

        drawSeat(
          ctx,
          positionX - tableRadius - spaceBetweenTableAndSeat,
          positionY,
          seatRadius,
          0
        );
        drawSeat(
          ctx,
          positionX + tableRadius + spaceBetweenTableAndSeat,
          positionY,
          seatRadius,
          0
        );
      }
    };

    drawSelectedTable();
  }, [tableSize, canvasRef]);

  const handleBackToFindTable = () => {
    router.push('/findtable');
  };

  return (
    <div className="bg-neutral-50 flex flex-wrap flex-col items-center justify-center">
      <Header />

      <main className="flex flex-wrap place-items-center bg-white pt-8 w-full justify-center font-DMSans">
        <div className="items-center flex flex-col">
          <div className="text-black text-4xl font-bold leading-[70px] whitespace-nowrap max-md:max-w-full max-md:text-4xl max-md:leading-[56px] mt-10">
            Confirm table reservation
          </div>
          <div className="self-stretch w-full mt-20 max-md:max-w-full max-md:mt-10">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
              <div className="flex flex-col items-stretch w-[64%] max-md:w-full max-md:ml-0">
                <canvas
                  ref={canvasRef}
                  width={550} // Set your desired width
                  height={417} // Set your desired height
                  style={{ border: "2px solid #ededed", borderRadius: "10px" }}
                  className="aspect-[1.78] object-contain object-center w-full self-stretch max-md:max-w-full max-md:mt-10"
                />
              </div>
              <div className="flex flex-col items-stretch w-[36%] ml-5 max-md:w-full max-md:ml-0">
                <div className="items-stretch flex flex-col my-auto max-md:max-w-full max-md:mt-10">
                  <div className="items-stretch flex flex-col max-md:max-w-full">
                    <div className="items-stretch flex flex-col px-5 max-md:max-w-full">
                      <div className="text-black text-3xl font-medium leading-10 -mr-5 mt-1 max-md:max-w-full">
                        {session?.user.name}
                      </div>
                    </div>
                    <div className="items-stretch flex flex-col mt-6 px-5 max-md:max-w-full">
                      <div className="text-neutral-600 text-base leading-5 -mr-5 max-md:max-w-full">
                        Booking details
                      </div>
                      <div className="items-stretch flex w-48 max-w-full gap-2 mt-4 self-start">
                        <div className="text-cyan-700 text-base font-bold leading-5">
                          Table Name:
                        </div>
                        <div className="text-cyan-700 text-base leading-5 whitespace-nowrap">
                          {tableName}
                        </div>
                      </div>
                      <div className="items-stretch flex w-48 max-w-full gap-2 mt-4 self-start">
                        <div className="text-cyan-700 text-base font-bold leading-5">
                          Table Size:
                        </div>
                        <div className="text-cyan-700 text-base leading-5 whitespace-nowrap">
                          {tableSize === "TableL"
                            ? "Large"
                            : tableSize === "TableM"
                            ? "Medium"
                            : "Small"}
                        </div>
                      </div>

                      <div className="items-stretch flex w-48 max-w-full gap-2 mt-4 self-start">
                        <div className="text-cyan-700 text-base font-bold leading-5">
                          ArrivalTime:
                        </div>
                        <div className="text-cyan-700 text-base leading-5 whitespace-nowrap">
                          {formattedArrivalTime}
                        </div>
                      </div>

                      <div className="items-stretch flex w-48 max-w-full gap-2 mt-4 self-start">
                        <div className="text-cyan-700 text-base font-bold leading-5">
                          Number of People:
                        </div>
                        <div className="text-cyan-700 text-base leading-5 whitespace-nowrap">
                          {numberOfPeople}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                  <button
                    onClick={handleConfirmBooking}
                    className="text-white text-lg font-bold leading-6 whitespace-nowrap items-stretch bg-teal-500 self-center w-[241px] max-w-full mt-16 px-5 py-4 rounded-[64px] max-md:mt-10 mb-28  hover:bg-teal-600"
                  >
                    Confirm booking
                  </button>
                  <button
                    onClick={handleBackToFindTable}
                    className="text-white text-lg font-bold leading-6 whitespace-nowrap items-stretch bg-gray-400 self-center w-[150px] ml-5 max-w-full mt-16 px-5 py-4 rounded-[64px] max-md:mt-10 mb-28  hover:bg-gray-500"
                  >
                    Back
                  </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
