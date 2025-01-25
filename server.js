const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

mongoose.connect('mongodb://localhost:27017/cinema', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use(cors());
app.use(bodyParser.json());

const MovieSchema = new mongoose.Schema({
  title: String,
  language: String,
  genre: String,
  poster: String,
  showtimes: [{ date: String, time: String }]
});
const Movie = mongoose.model('Movie', MovieSchema);

const ReservationSchema = new mongoose.Schema({
  movieId: mongoose.Schema.Types.ObjectId,
  timeSlotId: String,
  seat: Number,
  userId: String,
  date: String,
  time: String,
});
const Reservation = mongoose.model('Reservation', ReservationSchema);

app.get('/movies', async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
});

app.get('/movie/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  res.json(movie);
});

app.post('/reserve', async (req, res) => {
  const { movieId, timeSlotId, seat, userId, date, time } = req.body;

  const reservation = new Reservation({ movieId, timeSlotId, seat, userId, date, time });
  await reservation.save();

  res.json({ success: true, message: 'تم الحجز بنجاح' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
