"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";

// Import the shape images (make sure the file paths are correct)
import CircleImage from "../../public/circle.png";
import TriangleImage from "../../public/triangle.png";
import SquareImage from "../../public/square.png";

const SHAPES = ["Circle", "Triangle", "Square"]; // Define the shape names

const SHAPE_IMAGES = {
  Circle: CircleImage,
  Triangle: TriangleImage,
  Square: SquareImage,
};

export default function CanvasComponent() {
  const canvasRef = useRef(null);
  const [objects, setObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedShape, setSelectedShape] = useState(null);
  const [warning, setWarning] = useState("");
  const [tableName, setTableName] = useState("");
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
        setTableName(clickedObject.tableName || "");
        setMaxPeople(clickedObject.maxPeople || "");
      } else {
        // Check if the click position overlaps with any existing objects
        const isOverlapping = objects.some((obj) => {
          const distance = Math.sqrt((obj.x - x) ** 2 + (obj.y - y) ** 2);
          return distance < 20; // Assuming the radius of objects is 10
        });

        if (!isOverlapping) {
          if (selectedShape) {
            const newObject = {
              x,
              y,
              shape: selectedShape,
              tableName: "",
              maxPeople: "",
            };
            setObjects([...objects, newObject]);
          } else {
            setWarning(
              "Select a shape from the list before placing an object."
            );
            setTimeout(() => setWarning(""), 3000); // Clear the warning after 3 seconds
          }
        } else {
          // Show a warning message
          setWarning("Cannot place object on top of an existing object.");
          setTimeout(() => setWarning(""), 3000); // Clear the warning after 3 seconds
        }
      }
    };

    canvas.addEventListener("click", handleClick);

    // Draw objects on the canvas
    function drawObjects() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const obj of objects) {
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

  const handleRemove = () => {
    // Remove the selected object from the objects state
    setObjects(objects.filter((obj) => obj !== selectedObject));

    // Deselect the current object
    setSelectedObject(null);
    setTableName("");
    setMaxPeople("");
  };

  const handleSave = () => {
    if (tableName === "" || maxPeople === "") {
      setWarning("Please fill out both Table Name and Max People fields.");
      setTimeout(() => setWarning(""), 3000);
      return;
    }

    if (selectedObject) {
      // Edit the selected object
      selectedObject.tableName = tableName;
      selectedObject.maxPeople = maxPeople;
      setSelectedObject(null);
    } else {
      setSelectedObject(null);
      setSelectedShape(null);
      setTableName("");
      setMaxPeople("");
    }
  };

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
    <div className="flex">
      <div className="shapes-list p-4">
        <ul>
          {SHAPES.map((shape) => (
            <li
              key={shape}
              className={`mb-4 p-2 cursor-pointer ${
                selectedShape === shape ? "bg-blue-200" : "bg-gray-200"
              }`}
              onClick={() => setSelectedShape(shape)}
            >
              <Image
                src={SHAPE_IMAGES[shape]}
                alt={shape}
                width={40}
                height={40}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          style={{ border: "1px solid #000" }}
        />
        {selectedObject && (
          <div className="object-details">
            <p>Table Name:</p>
            <input
              type="text"
              className="border p-2 mb-2"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
            />
            <p>Max People:</p>
            <input
              type="text"
              className="border p-2 mb-2"
              value={maxPeople}
              onChange={(e) => setMaxPeople(e.target.value)}
            />
            <button
              onClick={handleSave}
              className="m-2 p-2 bg-green-500 text-white"
            >
              Save
            </button>
            <button
              onClick={handleRemove}
              className="m-2 p-2 bg-red-500 text-white"
            >
              Remove Object
            </button>
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
  );
}
