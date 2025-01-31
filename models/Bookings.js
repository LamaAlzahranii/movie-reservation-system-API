import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  timeSlot: {
    type: mongoose.Types.ObjectId,
    ref: "TimeSlot",
    required: true,
  },
  seatNumber: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  movieDate: {
    type: Date,
    required: true
  }
})

export default mongoose.model("Booking", bookingSchema)
