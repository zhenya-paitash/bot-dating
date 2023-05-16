const mongoose = require('mongoose')

const LinkModel = mongoose.Schema(
  {
    uid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    targetid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    isLiked: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Link', LinkModel)
