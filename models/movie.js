const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  timeSlots: [
    {
      time: { type: Date, required: true },
      capacity: { type: Number, required: true },
      bookedCount: { type: Number, default: 0 },
    },
  ],
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
