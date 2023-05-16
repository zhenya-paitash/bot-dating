const mongoose = require('mongoose')

const UserStatisticSchema = mongoose.Schema(
  {
    tgid: { type: Number, required: true, unique: true },
    completedRegistration: { type: Number, default: 0 },
    deletedAccount: { type: Number, default: 0 },
    deleteReasons: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
    },
    buyVip: { type: Number, default: 0 },
    // vip: [
    //   {
    //     tarif: { type: String },
    //     from: { type: Date },
    //     to: { type: Date },
    //   },
    // ],
    viewVip: { type: Number, default: 0 },
    match: { type: Number, default: 0 },
    openDialog: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('UserStatistic', UserStatisticSchema)
