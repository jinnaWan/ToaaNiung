"use client";

import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

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
      router.push('/myprofile')
    } catch (error) {
      // Handle error, e.g., show an error message
      console.error("Error confirming booking", error);
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

      // Set a position for drawing the selected table
      const positionX = 100; // Set your desired X position
      const positionY = 75; // Set your desired Y position
      const highlightSize = 2; // You can adjust the highlight size

      const tableRadius = 15; // Adjust the table radius as needed
      const seatRadius = 7; // Adjust the seat radius as needed
      const spaceBetweenTableAndSeat = 15; // Adjust the space between table and seat as needed
      const seatCount = 3; // Number of seats on each side

      if (tableSize === "TableM") {
        // Draw medium table (rectangle) with seats
        const rectWidth = 50; // Adjust the width of the rectangle
        const rectHeight = 40; // Adjust the height of the rectangle

        ctx.beginPath();
        ctx.rect(
          positionX - rectWidth / 2 - highlightSize,
          positionY - rectHeight / 2 - highlightSize,
          rectWidth + 2 * highlightSize,
          rectHeight + 2 * highlightSize
        );
        ctx.fill();

        // Calculate the positions of seats
        const seatPositions = [
          {
            x: positionX - 15 - highlightSize - spaceBetweenTableAndSeat / 2,
            y: positionY - 30 - highlightSize,
          },
          {
            x: positionX + 15 + highlightSize + spaceBetweenTableAndSeat / 2,
            y: positionY - 30 - highlightSize,
          },
          {
            x: positionX - 15 - highlightSize - spaceBetweenTableAndSeat / 2,
            y: positionY + 30 + highlightSize,
          },
          {
            x: positionX + 15 + highlightSize + spaceBetweenTableAndSeat / 2,
            y: positionY + 30 + highlightSize,
          },
        ];

        // Draw seats
        seatPositions.forEach((position) => {
          drawSeat(ctx, position.x, position.y, seatRadius, highlightSize);
        });
      } else if (tableSize === "TableL") {
        // Draw large table (rounded rectangle) with seats
        const roundedRectRadius = 10; // Adjust the rounded rectangle radius as needed
        ctx.beginPath();
        ctx.moveTo(positionX - 30 - highlightSize, positionY - 20 - highlightSize);
        ctx.arcTo(
          positionX + 30 + highlightSize,
          positionY - 20 - highlightSize,
          positionX + 30 + highlightSize,
          positionY + 20 + highlightSize,
          roundedRectRadius + highlightSize
        );
        ctx.arcTo(
          positionX + 30 + highlightSize,
          positionY + 20 + highlightSize,
          positionX - 30 - highlightSize,
          positionY + 20 + highlightSize,
          roundedRectRadius + highlightSize
        );
        ctx.arcTo(
          positionX - 30 - highlightSize,
          positionY + 20 + highlightSize,
          positionX - 30 - highlightSize,
          positionY - 20 - highlightSize,
          roundedRectRadius + highlightSize
        );
        ctx.arcTo(
          positionX - 30 - highlightSize,
          positionY - 20 - highlightSize,
          positionX + 30 + highlightSize,
          positionY - 20 - highlightSize,
          roundedRectRadius + highlightSize
        );
        ctx.closePath();
        ctx.fill();

        // Calculate the angle between each seat
        const angleIncrement = (2 * Math.PI) / (2 * seatCount);

        // Draw seats on the top
        for (let i = 0; i < seatCount; i++) {
          const angle = i * angleIncrement;
          const seatX =
            positionX -
            Math.cos(angle) * (30 + spaceBetweenTableAndSeat + highlightSize);
          const seatY =
            positionY -
            Math.sin(angle) * (20 + spaceBetweenTableAndSeat + highlightSize);
          drawSeat(ctx, seatX, seatY, seatRadius, highlightSize);
        }

        // Draw seats on the bottom
        for (let i = 0; i < seatCount; i++) {
          const angle = Math.PI + i * angleIncrement;
          const seatX =
            positionX -
            Math.cos(angle) * (30 + spaceBetweenTableAndSeat + highlightSize);
          const seatY =
            positionY -
            Math.sin(angle) * (20 + spaceBetweenTableAndSeat + highlightSize);
          drawSeat(ctx, seatX, seatY, seatRadius, highlightSize);
        }
      } else if (tableSize === "TableS") {
        // Draw small table (TableS) with seats
        ctx.beginPath();
        ctx.arc(positionX, positionY, tableRadius + highlightSize, 0, 2 * Math.PI);
        ctx.fill();

        drawSeat(
          ctx,
          positionX - tableRadius - spaceBetweenTableAndSeat,
          positionY,
          seatRadius,
          highlightSize
        );
        drawSeat(
          ctx,
          positionX + tableRadius + spaceBetweenTableAndSeat,
          positionY,
          seatRadius,
          highlightSize
        );
      }
    };

    drawSelectedTable();

  }, [tableSize, canvasRef]);


  return (
    <div>
      <h1>Confirm Booking</h1>
      <p>Username: {session?.user.name}</p>
      <p>Table Name: {tableName}</p>
      <p>Arrival Time: {formattedArrivalTime}</p>
      <p>Number of People: {numberOfPeople}</p>
      <p>Table Size: {tableSize}</p>
      <canvas
        ref={canvasRef}
        width={200} // Set your desired width
        height={150} // Set your desired height
        style={{ border: "1px solid #000", borderRadius: "10px" }}
      />
      <button onClick={handleConfirmBooking}>Confirm Booking</button>
    </div>
  );
}
