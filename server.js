const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const connectDB = require('./config/connectDB');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './config/config.env' });
// Routes
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');

// connect to DB
connectDB();

const app = express();
//Body parser
app.use(express.json());

// Cookies parser
app.use(cookieParser());

const PORT = process.env.PORT;

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// File upload
app.use(fileupload());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

app.use(errorHandler);

app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.green
      .italic
  )
);
