import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("TimeSlot", timeSlotSchema);
