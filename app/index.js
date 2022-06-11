const express = require('express');
const mongoose = require('mongoose');
var cors = require('cors')
const authRouter = require('./routes/authRoutes')
require('dotenv').config()

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors({
  origin: '*',
  methods: [
    'GET',
    'POST',
  ],
  allowedHeaders: [
    'Content-Type',
    'Authorization'
  ],
}));

app.use(express.json());
app.use('/auth', authRouter);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(PORT, () => console.log(`server started on port ${PORT}`))
  } catch(e) {
    console.log(e)
  }
}

start();