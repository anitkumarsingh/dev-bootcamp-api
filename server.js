const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/connectDB');

// Routes
const bootcamps = require('./routes/bootcamps');

dotenv.config({ path: './config/config.env' });

// connect to DB
connectDB();

const app = express();
//Body parser
app.use(express.json());
const PORT = process.env.PORT;

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/bootcamps', bootcamps);

app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
