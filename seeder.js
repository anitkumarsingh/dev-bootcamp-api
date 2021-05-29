const mongoose = require('mongoose');
const fs = require('fs');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env variables
dotenv.config({ path: './config/config.env' });

// Load model
const Bootcamp = require('./models/bootcamp');

// Load bootcamp json file
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

// Connect to database
mongoose.connect(process.env.MONGO_DB_URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true
});

const dataImporter = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log('Data inserted into database'.green.inverse);
  } catch (error) {
    console.log('error', error);
  }
};

const dataDestroyer = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log('All data deleted from database'.red.inverse);
  } catch (error) {
    console.log('error', error);
  }
};

if (process.argv[2] === 'i') {
  dataImporter();
} else if (process.argv[2] === 'd') {
  dataDestroyer();
}
