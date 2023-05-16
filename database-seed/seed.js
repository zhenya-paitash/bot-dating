const User = require('../models/userModel')
const Link = require('../models/linkModel')
const Review = require('../models/reviewModel')
const Ban = require('../models/banModel')
const BotStatistic = require('../models/botStatisticModel')
const UserStatistic = require('../models/userStatisticModel')
const VipPayment = require('../models/vipPaymentModel')
// IMPORT SEED USERS DATA
const botUsers = require('./users')
const { myProfile, mobileProfile } = require('./my')

require('colors')
require('dotenv').config({ path: './.env' })
require('../config')()

async function destroyData() {
  try {
    await Review.deleteMany()
    await Link.deleteMany()
    await Ban.deleteMany()
    await User.deleteMany()
    await UserStatistic.deleteMany()
    await BotStatistic.deleteMany()
    await VipPayment.deleteMany()
    console.log(`Data destroyed.`.white.bgRed)
  } catch (e) {
    console.log(`${e}`.red)
    process.exit(1)
  }
}

async function importFakeData() {
  console.log(`Importing data...`.green)

  try {
    const users = [myProfile, mobileProfile, ...botUsers]
    // ? IMPORT
    await User.insertMany(users)
    await UserStatistic.insertMany(
      users.map(i => ({ tgid: i.id, completedRegistration: 1 }))
    )
    console.log(`Data imported!`.white.bgGreen)
  } catch (e) {
    console.log(`${e}`.red)
    process.exit(1)
  }
}

;(async () => {
  if (process.argv[2] === '-D') {
    await destroyData()
    process.exit(1)
  } else {
    await destroyData()
    await importFakeData()
    process.exit(1)
  }
})()
