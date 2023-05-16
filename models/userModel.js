const mongoose = require('mongoose')

const UserSchema = mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    language: { type: String },
    age: { type: Number },
    gender: { type: String },
    preference: { type: String },
    location: {
      name: { type: String },
      country: { type: String },
      lat: { type: Number },
      lon: { type: Number },
    },
    name: { type: String },
    description: { type: String },
    photo: [String],

    done: { type: Boolean, default: false, required: true },
    dialog_status: { type: String, default: 'init', required: true },
    target: { type: String },
    targets: [Number],
    match: [Number],
    vip: {
      status: { type: Boolean, default: false },
      from: { type: Date },
      to: { type: Date },
    },
    isBot: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', UserSchema)
