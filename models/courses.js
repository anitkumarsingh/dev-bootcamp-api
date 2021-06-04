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
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

coursesSchema.statics.getAvarageCost = async function (bootcampId) {
  const object = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' }
      }
    }
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(object[0].averageCost / 10) * 10
    });
  } catch (error) {
    console.log(error);
  }
};
// call static method getAverageCost after save
coursesSchema.post('save', function () {
  this.constructor.getAvarageCost(this.bootcamp);
});

// call static method getAverageCost before remove
coursesSchema.pre('remove', function () {
  this.constructor.getAvarageCost(this.bootcamp);
});

module.exports = mongoose.model('Courses', coursesSchema);
