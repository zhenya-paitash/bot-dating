const mongoose = require('mongoose')

const BotStatisticSchema = mongoose.Schema(
  {
    // date: { type: Date, required: true, unique: true, default: Date.now },
    users: {
      all: { type: Number, default: 0 },
      new: { type: Number, default: 0 },
      active: { type: Number, default: 0 },
      notCompletedRegistration: { type: Number, default: 0 },
      withVip: { type: Number, default: 0 },
      gender: {
        male: { type: Number, default: 0 },
        female: { type: Number, default: 0 },
      },
      preference: {
        hetero: { type: Number, default: 0 },
        homo: { type: Number, default: 0 },
        bi: { type: Number, default: 0 },
      },
      photo: {
        without: { type: Number, default: 0 },
        count: {
          1: { type: Number, default: 0 },
          2: { type: Number, default: 0 },
          3: { type: Number, default: 0 },
        },
      },
      description: {
        without: { type: Number, default: 0 },
      },
      age: {
        avg: { type: Number, default: 0 },
      },
      language: {
        ru: { type: Number, default: 0 },
        en: { type: Number, default: 0 },
        ua: { type: Number, default: 0 },
      },
      location: { type: Object },
    },

    accounts: {
      all: { type: Number, default: 0 },
      completed: { type: Number, default: 0 },
    },

    vip: {
      new: { type: Number, default: 0 },
      tarif: {
        '24h': { type: Number, default: 0 },
        '7d': { type: Number, default: 0 },
        '30d': { type: Number, default: 0 },
        '90d': { type: Number, default: 0 },
      },
    },

    links: {
      new: { type: Number, default: 0 },
      like: { type: Number, default: 0 },
      dislike: { type: Number, default: 0 },
    },

    reviews: {
      new: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('BotStatistic', BotStatisticSchema)
