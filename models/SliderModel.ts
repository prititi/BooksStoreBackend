import mongoose, { Document, Schema } from "mongoose";

export interface ISlider extends Document {
  imageUrl: string;
  transitionSpeed?: number;
  order?: number[];
  settings?: boolean;
}

const SliderSchema: Schema = new Schema({
  imageUrl: { type: String, required: true },
  transitionSpeed: { type: Number, default: 3000 },
  order: { type: [Number], default: [] },
  settings: { type: Boolean, default: false },
});

export default mongoose.model<ISlider>("Slider", SliderSchema);
