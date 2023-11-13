"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function FindTable() {
  const canvasRef = useRef(null);
  const [objects, setObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [tableName, setTableName] = useState("");
  const [numberPeople, setNumberPeople] = useState(0);
  const [maxPeople, setMaxPeople] = useState(0);
  const getCurrentDateTime = () => {
    const now = new Date();
    const thailandOffset = 7 * 60; // Thailand is UTC+7
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    const thailandTime = new Date(utcTime + thailandOffset * 60000);

    const year = thailandTime.getFullYear();
    const month = `${thailandTime.getMonth() + 1}`.padStart(2, "0");
    const day = `${thailandTime.getDate()}`.padStart(2, "0");
    const hours = `${thailandTime.getHours()}`.padStart(2, "0");
    const minutes = `${thailandTime.getMinutes()}`.padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [datetime, setDatetime] = useState(getCurrentDateTime()); // Initialize with current date and time

  const router = useRouter();

  const handleNextClick = () => {
    // Check if the necessary data is available for confirmation
    if (!selectedObject || !numberPeople || !tableName || !maxPeople) {
      toast.error("Please fill in all required information before proceeding.");
      return;
    }
    router.push(
      `/confirmbooking?data=${encodeURIComponent(
        JSON.stringify({
          tableName: tableName,
          arrivalTime: datetime,
          numberOfPeople: numberPeople,
          tableSize: selectedObject.shape,
        })
      )}`
    );
  };

  const handleDatetimeChange = async (event) => {
    const selectedDatetime = new Date(event.target.value);

    // Check if the date is valid
    if (isNaN(selectedDatetime.getTime())) {
      toast.error("Invalid date and time format");
      return;
    }

    // Apply the Thailand time zone offset
    const thailandOffset = 7 * 60;
    const thailandTime = new Date(
      selectedDatetime.getTime() + thailandOffset * 60000
    );

    setDatetime(thailandTime.toISOString().slice(0, -8).toLocaleString());

    // Fetch booked tables for the selected date and time
    try {
      const response = await axios.get(
        `/api/booking?datetime=${thailandTime.toISOString()}`
      );

      console.log("Full Response:", response);
      console.log("Response data:", response.data);

      if (!response.data) {
        toast.error("Empty response received from the server.");
        return;
      }

      const bookedTableNames = response.data.bookedTableNames || [];

      setObjects((prevObjects) =>
        prevObjects.map((obj) => ({
          ...obj,
          isBooked: bookedTableNames.includes(obj.tableName),
        }))
      );

      if (bookedTableNames.length === 0) {
        // toast.success("Tables are available for booking!");
      } else {
        // toast.error("Selected date and time are fully booked.");
      }

      // Check if the selected table is booked after updating the date and time
      const isTableBooked = selectedObject && selectedObject.isBooked;
      if (isTableBooked) {
        toast.error(
          "The selected table is now booked. Please choose another table."
        );
        // Deselect the table
        setSelectedObject(null);
        setTableName("");
        setMaxPeople(0);
      }
    } catch (error) {
      console.error("Error fetching booked tables", error);
      toast.error(
        "An error occurred while fetching booked tables. Please try again."
      );
    }
  };

  const handleNumberPeopleChange = (event) => {
    const newNumberPeople = parseInt(event.target.value);

    // Check if the changed number of people exceeds maxPeople
    if (selectedObject && newNumberPeople > selectedObject.maxPeople) {
      toast.error(
        "The selected number of people exceeds the table's capacity."
      );
      // Deselect the table
      setSelectedObject(null);
      setTableName("");
      setMaxPeople(0);
    } else {
      setNumberPeople(newNumberPeople);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("api/mapping");
      if (Array.isArray(response.data) && response.data.length > 0) {
        const data = response.data[0]; // Access the first item in the array
        if (data.data) {
          const processedData = data.data.map((item) => ({
            x: item.x,
            y: item.y,
            shape: item.shape,
            tableName: item.tableName,
            maxPeople: item.maxPeople,
          }));
          setObjects(processedData);
        }
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data only when the component is mounted

    // Initialize with current datetime and check booking status
    handleDatetimeChange({ target: { value: getCurrentDateTime() } });
  }, []); // Empty dependency array for one-time execution

  const isObjectListEmpty = () => {
    return objects.length === 0;
  };

  const isObjectFieldsEmpty = () => {
    return objects.some((obj) => obj.tableName === "" || obj.maxPeople === 0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // Handle canvas click event
    const handleClick = (event) => {
      const x = event.offsetX;
      const y = event.offsetY;

      const clickedObject = objects.find((obj) => {
        if (obj.shape === "TableS") {
          const tableRadius = 15; // Adjust the table radius as needed
          const distance = Math.sqrt((obj.x - x) ** 2 + (obj.y - y) ** 2);
          return distance < tableRadius;
        } else if (obj.shape === "TableL") {
          // Calculate the rounded rectangle radius
          const roundedRectRadius = 10; // Adjust the rounded rectangle radius as needed

          // Calculate the horizontal and vertical distances from the center to the edges
          const halfWidth = 30 + roundedRectRadius; // Adjust the half-width of the TableL
          const halfHeight = 20 + roundedRectRadius; // Adjust the half-height of the TableL

          return (
            x >= obj.x - halfWidth &&
            x <= obj.x + halfWidth &&
            y >= obj.y - halfHeight &&
            y <= obj.y + halfHeight
          );
        } else if (obj.shape === "TableM") {
          const rectWidth = 50; // Adjust the width of the rectangle
          const rectHeight = 40; // Adjust the height of the rectangle

          const halfWidth = rectWidth / 2; // Adjust the half-width of the TableM
          const halfHeight = rectHeight / 2; // Adjust the half-height of the TableM

          return (
            x >= obj.x - halfWidth &&
            x <= obj.x + halfWidth &&
            y >= obj.y - halfHeight &&
            y <= obj.y + halfHeight
          );
        }
      });

      if (clickedObject) {
        // Check if the table is booked
        const isBooked = clickedObject.isBooked || false;

        // Check if the table is selectable based on maxPeople
        const isSelectable = numberPeople <= clickedObject.maxPeople;

        if (isBooked) {
          toast.error(
            "This table is already booked. Please choose another table."
          );
        } else if (!isSelectable) {
          toast.error(
            "The selected table is not suitable for the provided number of people."
          );
        } else {
          // Select the clicked object
          setSelectedObject(clickedObject);
          setTableName(clickedObject.tableName || "");
          setMaxPeople(clickedObject.maxPeople || 0);
        }
      }
    };

    canvas.addEventListener("click", handleClick);

    const drawSeat = (ctx, x, y, radius, highlightSize) => {
      ctx.beginPath();
      ctx.arc(x, y, radius + highlightSize, 0, 2 * Math.PI);
      ctx.fill();
    };

    function drawObjects() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const obj of objects) {
        const isSelected = obj === selectedObject;
        const highlightSize = isSelected ? 2 : 0;

        // Check if the table is booked
        const isBooked = obj.isBooked || false;

        // Check if the table is selectable based on maxPeople
        const isSelectable = numberPeople <= obj.maxPeople;

        // Set the fill color based on booking status and selection state
        ctx.fillStyle = isBooked
          ? "lightgrey" // Render booked tables in grey
          : isSelected
          ? "lightcoral"
          : isSelectable
          ? "lightblue"
          : "lightgrey"; // Unselectable tables are grey

        const tableSize = obj.shape;
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
            obj.x - rectWidth / 2 - highlightSize,
            obj.y - rectHeight / 2 - highlightSize,
            rectWidth + 2 * highlightSize,
            rectHeight + 2 * highlightSize
          );
          ctx.fill();

          // Calculate the positions of seats
          const seatPositions = [
            {
              x: obj.x - 15 - highlightSize - spaceBetweenTableAndSeat / 2,
              y: obj.y - 30 - highlightSize,
            },
            {
              x: obj.x + 15 + highlightSize + spaceBetweenTableAndSeat / 2,
              y: obj.y - 30 - highlightSize,
            },
            {
              x: obj.x - 15 - highlightSize - spaceBetweenTableAndSeat / 2,
              y: obj.y + 30 + highlightSize,
            },
            {
              x: obj.x + 15 + highlightSize + spaceBetweenTableAndSeat / 2,
              y: obj.y + 30 + highlightSize,
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
          ctx.moveTo(obj.x - 30 - highlightSize, obj.y - 20 - highlightSize);
          ctx.arcTo(
            obj.x + 30 + highlightSize,
            obj.y - 20 - highlightSize,
            obj.x + 30 + highlightSize,
            obj.y + 20 + highlightSize,
            roundedRectRadius + highlightSize
          );
          ctx.arcTo(
            obj.x + 30 + highlightSize,
            obj.y + 20 + highlightSize,
            obj.x - 30 - highlightSize,
            obj.y + 20 + highlightSize,
            roundedRectRadius + highlightSize
          );
          ctx.arcTo(
            obj.x - 30 - highlightSize,
            obj.y + 20 + highlightSize,
            obj.x - 30 - highlightSize,
            obj.y - 20 - highlightSize,
            roundedRectRadius + highlightSize
          );
          ctx.arcTo(
            obj.x - 30 - highlightSize,
            obj.y - 20 - highlightSize,
            obj.x + 30 + highlightSize,
            obj.y - 20 - highlightSize,
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
              obj.x -
              Math.cos(angle) * (30 + spaceBetweenTableAndSeat + highlightSize);
            const seatY =
              obj.y -
              Math.sin(angle) * (20 + spaceBetweenTableAndSeat + highlightSize);
            drawSeat(ctx, seatX, seatY, seatRadius, highlightSize);
          }

          // Draw seats on the bottom
          for (let i = 0; i < seatCount; i++) {
            const angle = Math.PI + i * angleIncrement;
            const seatX =
              obj.x -
              Math.cos(angle) * (30 + spaceBetweenTableAndSeat + highlightSize);
            const seatY =
              obj.y -
              Math.sin(angle) * (20 + spaceBetweenTableAndSeat + highlightSize);
            drawSeat(ctx, seatX, seatY, seatRadius, highlightSize);
          }
        } else if (tableSize === "TableS") {
          // Draw small table (TableS) with seats
          ctx.beginPath();
          ctx.arc(obj.x, obj.y, tableRadius + highlightSize, 0, 2 * Math.PI);
          ctx.fill();

          drawSeat(
            ctx,
            obj.x - tableRadius - spaceBetweenTableAndSeat,
            obj.y,
            seatRadius,
            highlightSize
          );
          drawSeat(
            ctx,
            obj.x + tableRadius + spaceBetweenTableAndSeat,
            obj.y,
            seatRadius,
            highlightSize
          );
        }

        ctx.fillStyle = "black";
        ctx.fillText(`(${obj.x}, ${obj.y}) - ${obj.shape}`, obj.x, obj.y - 15);
      }
    }

    drawObjects();

    return () => {
      // Remove the click event listener when the component unmounts
      canvas.removeEventListener("click", handleClick);
    };
  }, [canvasRef, objects, selectedObject, numberPeople]);

  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <div className="my-4 flex">
          <input
            className="w-60 appearance-none shadow border rounded py-3 px-2 text-grey-darker"
            type="datetime-local"
            id="meeting-time"
            name="meeting-time"
            min={getCurrentDateTime()}
            value={datetime} // Bind the value to the datetime variable
            onChange={handleDatetimeChange} // Step 3: Handle input change
          />
          <div className="mx-7 object-details">
            <p>Number of people:</p>
            <input
              type="number"
              className="border p-2 mb-2"
              value={numberPeople}
              onChange={handleNumberPeopleChange}
            />
          </div>
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Book a table
        </h1>
        <div className="mt-6 flex">
          <div className="canvas-container">
            <canvas
              ref={canvasRef}
              width={800} // Set your desired width
              height={600} // Set your desired height
              style={{ border: "1px solid #000", borderRadius: "10px" }}
            />
          </div>
        </div>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            onClick={handleNextClick}
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Next
          </a>
        </div>
      </div>
    </main>
  );
}
