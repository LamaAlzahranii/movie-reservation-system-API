const express = require("express");
const Movie = require("../models/movie");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving movies" });
  }
});

router.get("/:movieId/timeSlots", async (req, res) => {
  const { movieId } = req.params;
  try {
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie.timeSlots);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving time slots" });
  }
});

router.get("/:movieId/timeSlots/:timeSlotId", async (req, res) => {
  const { movieId, timeSlotId } = req.params;
  try {
    const movie = await Movie.findById(movieId);
    const timeSlot = movie.timeSlots.id(timeSlotId);
    if (!timeSlot) return res.status(404).json({ message: "Time slot not found" });

    const remainingSeats = timeSlot.capacity - timeSlot.bookedCount;
    res.json({ remainingSeats });
  } catch (error) {
    res.status(500).json({ message: "Error checking availability" });
  }
});

router.post("/:movieId/timeSlots/:timeSlotId/reserve", async (req, res) => {
  const { movieId, timeSlotId } = req.params;
  const { seats } = req.body;
  
  try {
    const movie = await Movie.findById(movieId);
    const timeSlot = movie.timeSlots.id(timeSlotId);

    if (!timeSlot) return res.status(404).json({ message: "Time slot not found" });

    const remainingSeats = timeSlot.capacity - timeSlot.bookedCount;

    if (seats > remainingSeats) {
      return res.status(400).json({ message: "Not enough available seats" });
    }

    timeSlot.bookedCount += seats;
    await movie.save();

    res.json({ message: "Reservation successful" });
  } catch (error) {
    res.status(500).json({ message: "Error reserving seats" });
  }
});

module.exports = router;
