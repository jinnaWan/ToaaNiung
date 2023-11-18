"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";

// Import the shape images (make sure the file paths are correct)
const TableSImage =
  "https://cdn.discordapp.com/attachments/1170752491944677567/1174041799564742687/table.png?ex=656626a1&is=6553b1a1&hm=4454bf3b031e36727b6c3df1ae2e78a503f7024119b8e0b677697c8e57599b2c&";
const TableMImage =
  "https://cdn.discordapp.com/attachments/1170752491944677567/1174041875691348049/table_1.png?ex=656626b3&is=6553b1b3&hm=8a0861ea0123797747af56ec5ff9596aab19af92beb9d2667fca2cf1afd59560&";
const TableLImage =
  "https://cdn.discordapp.com/attachments/1170752491944677567/1174041875951386754/table_2.png?ex=656626b3&is=6553b1b3&hm=81958657e35ea4ce362cc85c926f72fe180da605eb8a89c9a12668be2c4c1dc9&";

const TABLE_SIZES = ["TableS", "TableM", "TableL"]; // Define the shape names

const TABLE_IMAGES = {
  TableS: TableSImage,
  TableM: TableMImage,
  TableL: TableLImage,
};

export default function CanvasComponent() {
  const canvasRef = useRef(null);
  const [objects, setObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedShape, setSelectedShape] = useState(null);
  const [tableName, setTableName] = useState("");
  const [maxPeople, setMaxPeople] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(800); // Set your default width
  const [canvasHeight, setCanvasHeight] = useState(600); // Set your default height

  const showToast = (message, type = "success") => {
    // Display a toast notification based on the type
    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    }
  };

  const handleClearAll = () => {
    // Clear all objects from the canvas
    setObjects([]);
    // Deselect the current object
    setSelectedObject(null);
    setSelectedShape(null);
    setTableName("");
    setMaxPeople(0);
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
      showToast("Error fetching data", "error");
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data only when the component is mounted
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

    // Additional state to track drag information
    const dragState = {
      isDragging: false,
      startX: 0,
      startY: 0,
    };

    const handleMouseDown = (event) => {
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
        // Start dragging if an object is clicked
        dragState.isDragging = true;
        dragState.startX = x;
        dragState.startY = y;
      }
    };

    const handleMouseMove = (event) => {
      if (dragState.isDragging) {
        const x = event.offsetX;
        const y = event.offsetY;

        // Calculate the change in position
        const deltaX = x - dragState.startX;
        const deltaY = y - dragState.startY;

        // Update the object's position
        if (selectedObject) {
          selectedObject.x += deltaX;
          selectedObject.y += deltaY;
        }

        // Update drag start position
        dragState.startX = x;
        dragState.startY = y;

        // Redraw the canvas
        drawObjects();
      }
    };

    const handleMouseUp = () => {
      // Stop dragging on mouse up
      dragState.isDragging = false;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

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
        // Select the clicked object
        setSelectedObject(clickedObject);
        setTableName(clickedObject.tableName || "");
        setMaxPeople(clickedObject.maxPeople || 0);
      } else {
        // Assuming that the radius of objects is 10, adjust it based on the size of each table
        const collisionRadius = {
          TableS: 15,
          TableM: Math.max(25, 20), // Adjust based on the larger dimension of the rectangle
          TableL: Math.max(30, 20), // Adjust based on the larger dimension of the rounded rectangle
        };

        const isOverlapping = objects.some((obj) => {
          const minDistance =
            collisionRadius[obj.shape] + collisionRadius[selectedShape];
          const distance = Math.sqrt((obj.x - x) ** 2 + (obj.y - y) ** 2);
          return distance < minDistance;
        });

        if (!isOverlapping) {
          if (selectedShape) {
            const newObject = {
              x,
              y,
              shape: selectedShape,
              tableName: "",
              maxPeople: 0,
            };
            setObjects([...objects, newObject]);
          } else {
            showToast(
              "Select a shape from the list before placing an object.",
              "error"
            );
          }
        } else {
          showToast(
            "Cannot place object on top of an existing object.",
            "error"
          );
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
        // Highlight the selected object
        const isSelected = obj === selectedObject;
        const highlightSize = isSelected ? 2 : 0;

        // Set the fill color based on the selection state
        ctx.fillStyle = isSelected ? "lightcoral" : "lightblue";

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

      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [canvasRef, objects, selectedObject, selectedShape]);

  const handleRemove = () => {
    // Remove the selected object from the objects state
    setObjects(objects.filter((obj) => obj !== selectedObject));

    // Deselect the current object
    setSelectedObject(null);
    setTableName("");
    setMaxPeople(0);
  };

  const handleSave = () => {
    if (tableName === "" || maxPeople === 0) {
      showToast(
        "Please fill out both Table Name and Max People fields.",
        "error"
      );
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
      setMaxPeople(0);
    }
  };

  const saveObjectsToDatabase = () => {
    if (isObjectListEmpty()) {
      showToast("Object list is empty. Add objects before saving.", "error");
    } else if (isObjectFieldsEmpty()) {
      showToast("Fill out Table Name and Max People for all objects.", "error");
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
          showToast("Objects saved successfully", "success");
          // Reload the page after saving the objects
          setObjects(data);
        })
        .catch((error) => {
          showToast("Error saving objects", "error");
          console.error("Error saving objects", error);
        });
    }
  };

  return (
    <div className="flex  flex-col mt-20 self-start  w-5/6 ">
      <div className="overflow-x-auto items-stretch flex flex-col mx-auto">
        <div className="flex flex-wrap w-full justify-center">
          <div className="shapes-list p-4  h-fit bg-white rounded-xl mr-10">
            <ul>
              {TABLE_SIZES.map((shape) => (
                <li
                  key={shape}
                  style={{
                    filter:
                      selectedShape === shape
                        ? "invert(200%) sepia(100%) saturate(2394%) hue-rotate(183deg) brightness(104%) contrast(101%)"
                        : "",
                  }}
                  className={` p-2 cursor-pointer  rounded-md `}
                  onClick={() => setSelectedShape(shape)}
                >
                  <Image
                    src={TABLE_IMAGES[shape]}
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
              width={canvasWidth}
              height={canvasHeight}
              style={{
                border: "2px solid #ededed",
                borderRadius: "10px",
                // backgroundColor: "#ededed", // Set canvas background color here
              }}
            />

            {/* <div>
            <label>Canvas Width:</label>
            <input
              type="range"
              min="100"
              max="1200"
              step="10"
              value={canvasWidth}
              onChange={(e) => setCanvasWidth(parseInt(e.target.value))}
            />
          </div>
          <div>
            <label>Canvas Height:</label>
            <input
              type="range"
              min="100"
              max="1200"
              step="10"
              value={canvasHeight}
              onChange={(e) => setCanvasHeight(parseInt(e.target.value))}
            />
          </div> */}
            {selectedObject && (
              <div className="object-details flex flex-wrap justify-center items-center self-center mt-10">
                <p className=" justify-center text-slate-900 text-center text-normal font-bold leading-5 ">
                  Table Name:
                </p>
                <input
                  type="text"
                  className="mx-3 text-zinc-400 text-sm w-60 h-10  appearance-none shadow text-grey-darker font-DMSans whitespace-nowrap border grow p-2.5 rounded-md border-solid border-zinc-400 border-opacity-30"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                />

                <p className=" justify-center text-slate-900 text-center text-normal font-bold leading-5 ">
                  Max People:
                </p>
                <input
                  type="number"
                  className="mx-3 mr-12 text-zinc-400 text-sm w-60 h-10  appearance-none shadow text-grey-darker font-DMSans whitespace-nowrap border grow p-2.5 rounded-md border-solid border-zinc-400 border-opacity-30"
                  value={maxPeople}
                  onChange={(e) => setMaxPeople(parseInt(e.target.value))}
                />
                <button
                  onClick={handleSave}
                  className=" mr-5 justify-center text-center leading-6 items-stretch  bg-teal-600 grow  rounded-[64px] w-30  px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Save
                </button>
                <button
                  onClick={handleRemove}
                  className=" justify-center text-center leading-6 items-stretch  bg-red-600 grow  rounded-[64px] w-30  px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Remove Object
                </button>
              </div>
            )}

            <div className="flex justify-center mt-10 mb-10">
              <div className="flex  items-stretch justify-between gap-5 max-md:flex-wrap mx-auto">
                <button
                  onClick={handleClearAll}
                  className="justify-center leading-6 items-stretch  text-center  grow rounded-[64px] w-30  bg-gray-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Clear All
                </button>

                <button
                  onClick={saveObjectsToDatabase}
                  className="justify-center leading-6 items-stretch  text-center  grow rounded-[64px] w-30  bg-teal-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Save Objects
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
