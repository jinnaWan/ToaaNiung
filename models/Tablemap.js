import mongoose, {model, Schema, models} from "mongoose";

const MapSchema = new Schema({
  data: [{ type: Object, required: true }],
}, {
  timestamps: true,
});

export const Map = models.Map || model('Map', MapSchema);