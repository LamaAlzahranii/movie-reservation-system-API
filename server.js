const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bodyParser = require("body-parser")
require("dotenv").config() 

const app = express()
app.use(cors())
app.use(bodyParser.json())

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err))

const MovieSchema = new mongoose.Schema({
  title: String,
  timeSlots: [
    {
      time: String,
      capacity: Number,
      bookedCount: { type: Number, default: 0 },
    },
  ],
})

const Movie = mongoose.model("Movie", MovieSchema)

app.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find()
    res.json(movies)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch movies", error: err })
  }
})

app.get("/movie/:id/availability/:timeSlotId", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
    const timeSlot = movie.timeSlots.id(req.params.timeSlotId)
    const remainingSeats = timeSlot.capacity - timeSlot.bookedCount
    res.json({ remainingSeats })
  } catch (err) {
    res.status(500).json({ message: "Failed to check availability", error: err })
  }
})

app.post("/reserve", async (req, res) => {
  const { movieId, timeSlotId, seats } = req.body

  try {
    const movie = await Movie.findById(movieId)
    const timeSlot = movie.timeSlots.id(timeSlotId)

    if (timeSlot.capacity - timeSlot.bookedCount >= seats) {
      timeSlot.bookedCount += seats
      await movie.save()
      res.json({ success: true, message: "Reservation successful" })
    } else {
      res.status(400).json({ message: "Not enough seats available" })
    }
  } catch (err) {
    res.status(500).json({ message: "Reservation failed", error: err })
  }
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
