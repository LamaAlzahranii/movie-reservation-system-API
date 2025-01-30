


import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import Movie from "../models/Movie.js";
export const addMovie = async (req, res, next) => {
  const extractedToken = req.headers.authorization.split(" ")[1];
  if (!extractedToken && extractedToken.trim() === "") {
    return res.status(404).json({ message: "Token Not Found" });
  }

  let adminId;

  jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
    if (err) {
      return res.status(400).json({ message: `${err.message}` });
    } else {
      adminId = decrypted.id;
      return;
    }
  });

  const { title, description, releaseDate, posterUrl, featured, actors , timeSlots } =
    req.body;
  if (
    !title &&
    title.trim() === "" &&
    !description &&
    description.trim() == "" &&
    !posterUrl &&
    posterUrl.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  let movie;
  try {
    movie = new Movie({
      description,
      releaseDate: new Date(`${releaseDate}`),
      featured,
      actors,
      timeSlots, 
      admin: adminId,
      posterUrl,
      title,
    });
    const session = await mongoose.startSession();
    const adminUser = await Admin.findById(adminId);
    session.startTransaction();
    await movie.save({ session });
    adminUser.addedMovies.push(movie);
    await adminUser.save({ session });
    await session.commitTransaction();
  } catch (err) {
    return console.log(err);
  }

  if (!movie) {
    return res.status(500).json({ message: "Request Failed" });
  }

  return res.status(201).json({ movie });
};

export const getAllMovies = async (req, res, next) => {
  let movies;

  try {
    movies = await Movie.find();
  } catch (err) {
    return console.log(err);
  }

  if (!movies) {
    return res.status(500).json({ message: "Request Failed" });
  }
  return res.status(200).json({ movies });
};

export const getMovieById = async (req, res, next) => {
  const id = req.params.id;
  let movie;
  try {
    movie = await Movie.findById(id);
  } catch (err) {
    return console.log(err);
  }

  if (!movie) {
    return res.status(404).json({ message: "Invalid Movie ID" });
  }

  return res.status(200).json({ movie });
};



export const reserveTimeSlot = async (req, res) => {
  try {
    const { movieId, slotId, numPeople } = req.body;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "الفيلم غير موجود" });
    }

    const slot = movie.timeSlots.id(slotId);
    if (!slot) {
      return res.status(404).json({ message: "الفترة الزمنية غير موجودة" });
    }

    // التحقق من التوفر
    if (slot.capacity - slot.booked < numPeople) {
      return res.status(400).json({ message: "لا يوجد سعة كافية" });
    }

    slot.booked += numPeople;
    await movie.save(); 

    return res.status(200).json({ message: "تم الحجز بنجاح", remainingCapacity: slot.capacity - slot.booked });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
};

export const checkAvailability = async (req, res) => {
  const { movieId, timeSlotId } = req.params;

  try {
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const timeSlot = movie.timeSlots.find((slot) => slot._id.toString() === timeSlotId);

    if (!timeSlot) {
      return res.status(404).json({ message: "Time slot not found" });
    }

    return res.status(200).json({ availableSeats: timeSlot.capacity - timeSlot.booked });
  } catch (err) {
    return res.status(500).json({ message: "Error checking availability" });
  }
};




