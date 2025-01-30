import mongoose from "mongoose"
import Booking from "../models/Bookings.js"
import Movie from "../models/Movie.js"
import TimeSlot from "../models/TimeSlot.js" 

export const newBooking = async (req, res) => {
  const { seatNumber, date, timeSlot, movieId, userId } = req.body;

  if (!seatNumber || !date || !timeSlot || !movieId || !userId) {
    return res.status(400).json({ message: "الرجاء ملء جميع الحقول" });
  }

  try {
    const movieObjectId = new mongoose.Types.ObjectId(movieId);

    const movie = await Movie.findById(movieObjectId);
    if (!movie) {
      return res.status(404).json({ message: "الفيلم غير موجود" });
    }

    const slot = movie.timeSlots.find((s) => s._id.toString() === timeSlot);
    if (!slot) {
      return res.status(404).json({ message: "وقت العرض غير متاح" });
    }

    // التحقق من إذا كان المقعد قد تم حجزه بالفعل
    const existingBooking = await Booking.findOne({
      movie: movieId,
      timeSlot: timeSlot,
      seatNumber: seatNumber,
    });

    if (existingBooking) {
      return res.status(400).json({ message: "المقعد محجوز بالفعل. اختر مقعد آخر" });
    }

    if (slot.booked >= slot.capacity) {
      return res.status(400).json({ message: "لا يوجد مقاعد متاحة" });
    }

    slot.booked += 1;
    await movie.save();

    const booking = new Booking({
      seatNumber,
      date,
      timeSlot,
      movie: movieId,
      user: userId,
    });

    await booking.save();
    res.status(201).json({ message: "تم الحجز بنجاح!" });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "حدث خطأ أثناء الحجز" });
  }
};


export const getBookingById = async (req, res, next) => {
  const id = req.params.id
  let booking
  try {
    booking = await Bookings.findById(id).populate("user movie timeSlot") // إضافة timeSlot للـ populate
  } catch (err) {
    return console.log(err)
  }
  if (!booking) {
    return res.status(500).json({ message: "Unexpected Error" })
  }
  return res.status(200).json({ booking })
}

export const deleteBooking = async (req, res, next) => {
  const id = req.params.id
  let booking
  try {
    booking = await Bookings.findByIdAndRemove(id).populate("user movie timeSlot") 
    const session = await mongoose.startSession()
    session.startTransaction()
    await booking.user.bookings.pull(booking)
    await booking.movie.bookings.pull(booking)
    await booking.movie.save({ session })
    await booking.user.save({ session })

    const timeSlot = await TimeSlot.findById(booking.timeSlot)
    timeSlot.availableSeats += booking.seatNumber 
    await timeSlot.save({ session })

    session.commitTransaction()
  } catch (err) {
    return console.log(err)
  }

  if (!booking) {
    return res.status(500).json({ message: "Unable to Delete" })
  }

  return res.status(200).json({ message: "Successfully Deleted" })
}
