const moment = require('moment')
const User = require('../../models/userModel')
const Link = require('../../models/linkModel')
const Review = require('../../models/reviewModel')
const UserStatistic = require('../../models/userStatisticModel')
const BotStatistic = require('../../models/botStatisticModel')
const language = require('../../telegrambot/language')

const getDayStatistic = async () => {
  const now = moment()
  const $gte = now.startOf('day').toISOString()
  const $lte = now.endOf('day').toISOString()
  const $bot = { isBot: false }

  // check today statistic
  const todayStat = await BotStatistic.find({ createdAt: { $gte, $lte } })
  if (todayStat.length) return null

  const users = await User.find({ ...$bot })
  const gender = {
    male: users.filter(i => i.gender === 'male').length,
    female: users.filter(i => i.gender === 'female').length,
  }
  const preference = {
    hetero: users.filter(
      i =>
        (i.gender === 'male' && i.preference === 'female') ||
        (i.gender === 'female' && i.preference === 'male')
    ).length,
    homo: users.filter(
      i => i.gender && i.preference && i.gender === i.preference
    ).length,
    bi: users.filter(i => i.preference === 'irrelevant').length,
  }
  const photo = {
    // ! можно поменять логику и чистить массив, если фото нет, и выводить дефолт
    // ? сейчас добавляется дефолтное фото
    without: users.filter(
      i => i.photo && Object.values(language.defaultPhoto).includes(i.photo[0])
    ).length,
    count: {
      // ? логика
      1: users.filter(
        i =>
          i.photo?.length === 1 &&
          !Object.values(language.defaultPhoto).includes(i.photo[0])
      ).length,
      2: users.filter(i => i.photo?.length === 2).length,
      3: users.filter(i => i.photo?.length === 3).length,
    },
  }
  const description = {
    without: users.filter(i => i.done && !i.description).length,
  }
  const age = {
    avg:
      +(
        users.reduce((sum, i) => (i.age ? sum + i.age : sum), 0) /
        users.filter(i => i.age).length
      ).toFixed(2) || 0,
  }
  const lng = Object.fromEntries(
    Object.values(language.languages).map(i => [
      i,
      users.filter(j => j.language === i).length,
    ])
  )

  const location = {}
  users.forEach(i => {
    if (!i.done || !i.location) return
    const $ = i.location.country
    return $ in location ? location[$]++ : (location[$] = 1)
  })

  const allAcc = await UserStatistic.find()
  const completedAcc = (
    await UserStatistic.find({
      $ne: { completeRegistration: 0 },
    })
  ).filter(i => i.completedRegistration > i.deletedAccount)

  const newUsers = await User.find({ createdAt: { $gte, $lte }, ...$bot })
  const activeUsers = await User.find({ updatedAt: { $gte, $lte }, ...$bot })
  const notCompletedRegistrationUsers = await User.find({
    updatedAt: { $gte, $lte },
    dialog_status: {
      $in: [
        'init',
        'ask_language',
        'ask_age',
        'ask_gender',
        'ask_preference',
        'ask_location',
        'ask_location_select',
        'ask_name',
        'ask_description',
        'ask_photo',
      ],
    },
    ...$bot,
  })

  const usersWithVip = await User.find({ 'vip.status': true, ...$bot })
  // ?
  const links = await Link.find({ createdAt: { $gte, $lte } })
  const linksLike = await Link.find({
    createdAt: { $gte, $lte },
    isLiked: true,
  })
  const linksDislike = links.length - linksLike.length
  const reviews = await Review.find({ createdAt: { $gte, $lte } })

  const buyVip = await User.find({
    'vip.status': true,
    'vip.from': { $gte, $lte },
    ...$bot,
  })
  const buyVipTarif = buyVip
    .map(i => moment(i.vip.to).diff(i.vip.from))
    .reduce(
      (acc, cur) => {
        const day = cur / 1000 / 60 / 60 / 24
        if (day === 1) acc['24h']++
        if (day === 7) acc['7d']++
        if (day === 30) acc['30d']++
        if (day === 90) acc['90d']++
        return acc
      },
      {
        '24h': 0,
        '7d': 0,
        '30d': 0,
        '90d': 0,
      }
    )

  return {
    users: {
      all: users.length,
      new: newUsers.length,
      active: activeUsers.length,
      notCompletedRegistration: notCompletedRegistrationUsers.length,
      withVip: usersWithVip.length,
      gender,
      preference,
      photo,
      description,
      age,
      language: lng,
      location,
    },
    accounts: {
      all: allAcc.length,
      completed: completedAcc.length,
    },
    vip: {
      new: buyVip.length,
      tarif: buyVipTarif,
    },
    links: {
      new: links.length,
      like: linksLike.length,
      dislike: linksDislike,
    },
    reviews: {
      new: reviews.length,
    },
  }
}

module.exports = { getDayStatistic }
