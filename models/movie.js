import mongoose from "mongoose"

const TimeSlotSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  booked: {
    type: Number,
    default: 0,
    validate: {
      validator: function (v) {
        return v <= this.capacity 
      },
      message: "Booked seats cannot exceed capacity",
    },
  },
})

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  actors: [{ type: String, required: true }],
  releaseDate: {
    type: Date,
    required: true,
  },
  posterUrl: {
    type: String,
    required: true,
  },
  featured: {
    type: Boolean,
  },
  date: {
    type: Date,
    required: true,
  },

  bookings: [{ type: mongoose.Types.ObjectId, ref: "Booking" }],
  timeSlots: [TimeSlotSchema],
  admin: {
    type: mongoose.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
})

export default mongoose.models.Movie || mongoose.model("Movie", movieSchema)
