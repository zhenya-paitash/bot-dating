const mongoose = require('mongoose')

const BanSchema = mongoose.Schema(
  { telegramid: { type: Number, required: true, unique: true } },
  { timestamps: true }
)

module.exports = mongoose.model('Ban', BanSchema)
