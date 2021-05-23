const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_DB_URL, {
    useCreateIndex: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
  });
  console.log(`Connected to database on ${conn.connection.host}`);
};

module.exports = connectDB;
