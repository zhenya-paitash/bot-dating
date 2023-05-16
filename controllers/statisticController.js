const asyncHandler = require('express-async-handler')
const moment = require('moment')
const UserStatistic = require('../models/userStatisticModel')
const BotStatistic = require('../models/botStatisticModel')
const { getDayStatistic } = require('./utils/statistic')

// @desc      Get day statistic
// @route     GET /api/statistic/:date
// @access    Private
const getBotDayStatistic = asyncHandler(async (req, res) => {
  const date = moment(req.params.date, 'D.MM.YYYY')

  const dayStatistic = await BotStatistic.findOne({
    createdAt: {
      $gte: date.startOf('day').toISOString(),
      $lte: date.endOf('day').toISOString(),
    },
  })
  if (!dayStatistic) {
    res.status(400)
    throw new Error(`За ${date} нет статистики`)
  }

  res.status(200).json({
    message: `Статистика за ${date} 😐`,
    data: dayStatistic,
  })
})

// @desc      Get user statistic
// @route     GET /api/statistic/user/:id
// @access    Private
const getUserStatistic = asyncHandler(async (req, res) => {
  const userStat = await UserStatistic.findOne({ tgid: req.params.id })
  if (!userStat) {
    res.status(400)
    throw new Error(`Пользователь ${req.params.id} не найден 😞`)
  }

  res.status(200).json({
    message: `Статистика пользователя ${req.params.id} 😐`,
    data: userStat,
  })
})

// @desc      Create day statistic
// @route     POST /api/statistic
// @access    Private
const createBotDayStatistic = asyncHandler(async (req, res) => {
  const data = await getDayStatistic()
  if (!data) {
    res.status(400)
    throw new Error(`За ${moment()} уже имеется статистика`)
  }

  const stat = await BotStatistic.create(data)
  res.status(200).json({
    message: `Добавлена статистика за ${stat.createdAt}`,
    data: stat,
  })
})

// @desc      Update user statistic
// @route     PUT /api/statistic/user/:id
// @access    Private
const updateUserStatistic = asyncHandler(async (req, res) => {
  const field = req.body.field
  if (!field) {
    res.status(400)
    throw new Error(`Нет поля field 😞`)
  }

  // ? refactoring to 'buyvip' table
  // let updUserStat
  // if (field.startsWith('vip?tarif=')) {
  //   const [tarif, from, to] = field
  //     .slice(4)
  //     .split('&')
  //     .map(i => i.split('=')[1])
  //   const buyVip = { tarif, from, to }
  //   updUserStat = await UserStatistic.findOneAndUpdate(
  //     { tgid: req.params.id },
  //     { $push: { vip: buyVip } }
  //   )
  // } else {
  //   updUserStat = await UserStatistic.findOneAndUpdate(
  //     { tgid: req.params.id },
  //     { $inc: { [field]: 1 } }
  //   )
  // }
  const updUserStat = await UserStatistic.findOneAndUpdate(
    { tgid: req.params.id },
    { $inc: { [field]: 1 } }
  )
  if (!updUserStat) {
    res.status(400)
    throw new Error(
      `Возникла ошибка при обновлении статистики пользователя ${req.params.id} 😞`
    )
  }

  res.status(200).json({
    message: `Статистика пользователя ${req.params.id} 😐`,
    data: updUserStat,
  })
})

module.exports = {
  // BOT STATISTIC
  getBotDayStatistic,
  createBotDayStatistic,

  // USER STATISTIC
  getUserStatistic,
  updateUserStatistic,
}
