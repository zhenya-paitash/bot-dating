const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const UserStatistic = require('../models/userStatisticModel')
const Link = require('../models/linkModel')
const Review = require('../models/reviewModel')
const Ban = require('../models/banModel')
const { findPartners, getTargets } = require('./utils/user')

// @desc      Get all users
// @route     GET /api/user
// @access    Private
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.status(200).json({
    message: `В базе найдено ${users.length} пользователей 😐`,
    data: users,
  })
})

// @desc      Get user by id
// @route     GET /api/user/:id
// @access    Private
const getUsersById = asyncHandler(async (req, res) => {
  const user = await User.findOne({ id: req.params.id })
  if (!user) {
    res.status(404)
    throw new Error('Пользователь не найден ❌')
  }

  // ? удаление VIP статуса по истечении времени
  if (user.vip && user.vip.status) {
    const { to } = user.vip
    const timeIsUp = new Date(to).getTime() - new Date().getTime() < 0

    if (timeIsUp) {
      console.log('NEED DELETE')
      user.vip = {}
      await user.save()
    }
  }

  res.status(200).json({
    message: `Ползователь найден ✔️`,
    data: user,
  })
})

// @desc      Get list potential partners
// @route     GET /api/user/:id/search
// @access    Private
const getPotentialPartnerUsers = asyncHandler(async (req, res) => {
  let user = await User.findOne({ id: req.params.id })

  if (!user) {
    res.status(404)
    throw new Error('Пользователь не найден ❌')
  }

  if (!user.target && user.targets.length) {
    const [target, targets] = getTargets(user.targets)
    user.target = target
    user.targets = targets
    await user.save()

    const data = await User.findOne({ id: target })
    // ? если пользователем с ID из стека был удален
    if (!data) {
      user.target = ''
      await user.save()
      res.status(404)
      throw new Error('Пользователь из стэка вероятно был удален ❓')
    }

    return res.status(200).json({
      message: 'Мы нашли для вас ваших потенциальных партнеров 🤩',
      data,
    })
  }

  const users = await findPartners(user)

  if (users.length) {
    const [target, targets] = getTargets(users)
    const data = await User.findOne({ id: target })
    if (!data) {
      user.target = ''
      await user.save()

      res.status(404)
      throw new Error('Пользователь из стэка вероятно был удален ❓')
    }

    user.target = target
    user.targets = targets
    await user.save()

    return res.status(200).json({
      message: 'Мы нашли для вас ваших потенциальных партнеров 🤩',
      data,
    })
  }

  res.status(200).json({
    message: 'Мы не нашли подходящих пользователей 😥',
    data: null,
  })
})

// @desc      Add new user to database
// @route     POST /api/user
// @access    Private
const createUser = asyncHandler(async (req, res) => {
  const { id, firstname, username } = req.body
  const userExists = await User.findOne({ id })
  if (userExists) {
    res.status(400)
    throw new Error('Пользователь уже есть в базе 😄')
  }

  const isBanned = await Ban.findOne({ telegramid: id })
  if (isBanned) {
    res.status(400)
    throw new Error('Данный телеграм аккаунт забанен 🥶')
  }

  const user = await User.create({ id, firstname, username })
  const userStat = await UserStatistic.findOne({ tgid: id })
  if (!userStat) {
    await UserStatistic.create({ tgid: id })
  }

  res.status(201).json({
    message: `Пользователь ${user.id} добавлен в базу 😃`,
    data: user,
  })
})

// @desc      Update user info
// @route     PUT /api/user/:id
// @access    Private
const updateUser = asyncHandler(async (req, res) => {
  const updUser = await User.findOneAndUpdate({ id: req.params.id }, req.body)
  if (!updUser) {
    res.status(400)
    throw new Error('Возникла ошибка при обновлении')
  }

  res.status(201).json({
    message: `Пользователь ${updUser.id} обновлен ✔️`,
    data: updUser,
  })
})

// @desc      Delete user
// @route     DELETE /api/user/:id
// @access    Private
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ id: req.params.id })
  if (!user) {
    res.status(404)
    throw new Error('Пользователь не найден в базе 😄')
  }

  await Link.deleteMany({ $or: [{ uid: user._id }, { targetid: user._id }] })
  await UserStatistic.findOneAndUpdate(
    { tgid: user.id },
    { $inc: { deletedAccount: 1 } }
  )
  await user.remove()

  res.status(200).json({
    message: `Пользователь ${req.params.id} был удален! ❌`,
    data: {},
  })
})

// @desc      Ban user by telegram id
// @route     POST /api/user/ban/:id
// @access    Private
const banUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id })
    if (user) {
      await Link.deleteMany({
        $or: [{ uid: user._id }, { targetid: user._id }],
      })
      await Review.deleteMany({ user: user._id })
      await user.remove()
    }

    await Ban.create({ telegramid: req.params.id })

    res.status(200).json({
      message: `Пользователь ${req.params.id} был удален и занесен в бан-лист. 🔴`,
      data: {},
    })
  } catch (e) {
    res.status(404)
    throw new Error(e)
  }
})

// @desc      Unban user by telegram id
// @route     POST /api/user/unban/:id
// @access    Private
const unbanUser = asyncHandler(async (req, res) => {
  await Ban.deleteOne({ telegramid: req.params.id })

  res.status(201).json({
    message: `Пользователь ${req.params.id} теперь разбанен`,
    data: {},
  })
})

module.exports = {
  getUsers,
  getUsersById,
  getPotentialPartnerUsers,
  createUser,
  updateUser,
  deleteUser,
  banUser,
  unbanUser,
}
