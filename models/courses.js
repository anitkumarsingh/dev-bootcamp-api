const mongoose = require('mongoose');

const coursesSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add course title']
  },
  description: {
    type: String,
    required: [true, 'Please add course description']
  },
  weeks: {
    type: Number,
    required: [true, 'Please add number of weeks']
  },
  tuition: {
    type: Number,
    required: [true, 'Please add tuition fee']
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add minimum skills required for the course'],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  scholarhipsAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  }
});

module.exports = mongoose.model('Courses', coursesSchema);
