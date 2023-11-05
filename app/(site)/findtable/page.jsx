"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

// Import the shape images (make sure the file paths are correct)
import CircleImage from "@/public/circle.png";
import TriangleImage from "@/public/triangle.png";
import SquareImage from "@/public/square.png";

const SHAPES = ["Circle", "Triangle", "Square"]; // Define the shape names

const SHAPE_IMAGES = {
  Circle: CircleImage,
  Triangle: TriangleImage,
  Square: SquareImage,
};

export default function FindTable() {
  const canvasRef = useRef(null);
  const [objects, setObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedShape, setSelectedShape] = useState(null);
  const [warning, setWarning] = useState("");
  const [numberPeople, setNumberPeople] = useState("");
  const [maxPeople, setMaxPeople] = useState("");

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
  }, []); // Empty dependency array for one-time execution

  const isObjectListEmpty = () => {
    return objects.length === 0;
  };

  const isObjectFieldsEmpty = () => {
    return objects.some((obj) => obj.tableName === "" || obj.maxPeople === "");
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // Handle canvas click event
    const handleClick = (event) => {
      const x = event.offsetX;
      const y = event.offsetY;

      // Check if any existing object was clicked (for selection)
      const clickedObject = objects.find((obj) => {
        const distance = Math.sqrt((obj.x - x) ** 2 + (obj.y - y) ** 2);
        return distance < 10; // Assuming the radius of objects is 10
      });

      if (clickedObject) {
        // Select the clicked object
        setSelectedObject(clickedObject);
      }
    };

    canvas.addEventListener("click", handleClick);

    // Draw objects on the canvas
    function drawObjects() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const obj of objects) {
        console.log("Drawing object", obj);
        ctx.fillStyle = "blue";
        ctx.beginPath();
        if (obj.shape === "Triangle") {
          // Draw a triangle
          ctx.moveTo(obj.x, obj.y - 10);
          ctx.lineTo(obj.x - 10, obj.y + 10);
          ctx.lineTo(obj.x + 10, obj.y + 10);
        } else if (obj.shape === "Square") {
          // Draw a square
          ctx.rect(obj.x - 10, obj.y - 10, 20, 20);
        } else {
          // Default to drawing a circle
          ctx.arc(obj.x, obj.y, 10, 0, 2 * Math.PI);
        }
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = "black";
        ctx.fillText(`(${obj.x}, ${obj.y}) - ${obj.shape}`, obj.x, obj.y - 15);

        // Highlight the selected object
        if (obj === selectedObject) {
          ctx.strokeStyle = "red";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(obj.x, obj.y, 12, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.closePath();
        }
      }
    }

    drawObjects();

    return () => {
      // Remove the click event listener when the component unmounts
      canvas.removeEventListener("click", handleClick);
    };
  }, [canvasRef, objects, selectedObject, selectedShape]);

  const saveObjectsToDatabase = () => {
    if (isObjectListEmpty()) {
      setWarning("Object list is empty. Add objects before saving.");
      setTimeout(() => setWarning(""), 3000);
    } else if (isObjectFieldsEmpty()) {
      setWarning("Fill out Table Name and Max People for all objects.");
      setTimeout(() => setWarning(""), 3000);
    } else {
      // Extract the relevant data from the objects
      const data = objects.map((obj) => ({
        x: obj.x,
        y: obj.y,
        shape: obj.shape,
        tableName: obj.tableName,
        maxPeople: obj.maxPeople,
      }));

      axios
        .post("api/mapping", { data: data }) // Send data as an object with a "data" property
        .then((response) => {
          console.log("Objects saved successfully", response.data);
          // Reload the page after saving the objects
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error saving objects", error);
        });
    }
  };

  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <div className="my-4">
          <Datetime className="w-60 appearance-none shadow border rounded py-3 px-2 text-grey-darker"/>
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Page not found
        </h1>
        <div className="mt-6 flex">
          <div className="canvas-container">
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              style={{ border: "1px solid #000" }}
            />
            {selectedObject && (
              <div className="object-details">
                <p>Number of people:</p>
                <input
                  type="text"
                  className="border p-2 mb-2"
                  value={numberPeople}
                  onChange={(e) => setNumberPeople(e.target.value)}
                />
              </div>
            )}
            <button
              onClick={saveObjectsToDatabase}
              className="m-2 p-2 bg-blue-500 text-white"
            >
              Save Objects
            </button>
            {warning && <div className="warning">{warning}</div>}
          </div>
        </div>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="#"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Go back home
          </a>
          <a href="#" className="text-sm font-semibold text-gray-900">
            Contact support <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </main>
  );
}
