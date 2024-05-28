import { mongooseConnect } from "@/lib/mongoose";
import { Map } from "@/models/Tablemap";
import { NextResponse } from "next/server";

class MapHandler {
  async getAll() {
    await mongooseConnect();
    const result = await Map.find();
    return result;
  }

  async create(data) {
    try {
      await mongooseConnect();
      console.log("Received data:", data);

      await Map.deleteMany({});
      await Map.create({ data: data });

      return { message: "Data created successfully" };
    } catch (error) {
      console.error("Error creating data", error);
      throw new Error("Error creating data");
    }
  }

  async deleteAll() {
    await mongooseConnect();
    await Map.deleteMany({});
    return true;
  }
}

export { MapHandler };
