import mongoose from "mongoose"
import Booking from "../models/Bookings.js"
import Movie from "../models/movie.js"
import TimeSlot from "../models/TimeSlot.js"

export const newBooking = async (req, res) => {
  const { seatNumber, timeSlot, movieId, userId } = req.body

  if (!seatNumber || !timeSlot || !movieId || !userId) {
    return res.status(400).json({ message: "Kindly fill in all the fields" })
  }

  try {
    const movieObjectId = new mongoose.Types.ObjectId(movieId)

    const movie = await Movie.findById(movieObjectId)
    if (!movie) {
      return res.status(404).json({ message: "The movie is not available" })
    }

    const slot = movie.timeSlots.find(s => s._id.toString() === timeSlot)
    if (!slot) {
      return res.status(404).json({ message: "The showtime is not available" })
    }

    const existingBooking = await Booking.findOne({
      movie: movieId,
      timeSlot: timeSlot,
      seatNumber: seatNumber,
    })

    if (existingBooking) {
      return res.status(400).json({ message: "The seat is already reserved. Please choose another seat" })
    }

    if (slot.booked >= slot.capacity) {
      return res.status(400).json({ message: "No seats available" })
    }

    slot.booked += 1
    await movie.save()

    const booking = new Booking({
      seatNumber,
      timeSlot,
      movie: movieId,
      user: userId,
      movieDate: movie.date, 
    })

    await booking.save()
    res.status(201).json({ message: "Reservation successful!" })
  } catch (err) {
    console.error("Booking error:", err)
    res.status(500).json({ message: "An error occurred during the reservation" })
  }
}

export const getBookingById = async (req, res, next) => {
  const id = req.params.id
  let booking
  try {
    booking = await Bookings.findById(id).populate("user movie timeSlot")
  } catch (err) {
    return console.log(err)
  }
  if (!booking) {
    return res.status(500).json({ message: "Unexpected Error" })
  }
  return res.status(200).json({ booking })
}


