const mongoose = require('mongoose')

const ReviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: 'User',
    },
    review: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Review', ReviewSchema)
