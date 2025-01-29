import express from "express";
import {
  addMovie,
  getAllMovies,
  getMovieById,
  checkAvailability
} from "../controllers/movie-controller.js";

const movieRouter = express.Router();
movieRouter.get("/", getAllMovies);
movieRouter.get("/:id", getMovieById);
movieRouter.post("/", addMovie);
movieRouter.get("/:movieId/check-availability/:slotId", checkAvailability)


export default movieRouter;