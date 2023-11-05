import { mongooseConnect } from "@/lib/mongoose";
import { Map } from "@/models/Tablemap";
import { NextResponse } from "next/server";

export async function GET(req) {
  await mongooseConnect();

  const result = await Map.find(); // Use `find` without any conditions

  return NextResponse.json(result);
}

export async function POST(req) {
  try {
    const { data } = await req.json();
    await mongooseConnect();
    console.log("Received data:", data);

    // Clear all existing data
    await Map.deleteMany({});

    // Insert the new data
    await Map.create({ data: data });

    return NextResponse.json({ message: "Data created successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error creating data", error);
    return NextResponse.json(
      { message: "Error creating data" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  // Delete all data
  await mongooseConnect();
  await Map.deleteMany({});
  return NextResponse.json(true);
}
