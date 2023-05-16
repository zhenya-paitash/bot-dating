const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Link = require('../models/linkModel')

// @desc      Get all links
// @route     GET /api/link
// @access    Private
const getLinks = asyncHandler(async (req, res) => {
  const links = await Link.find({}).populate('uid').populate('targetid')

  res.status(200).json({
    message: `В базе найдено ${links.length} связей 😃 `,
    data: links,
  })
})

// @desc      Create link users
// @route     POST /api/link
// @access    Private
const createLink = asyncHandler(async (req, res) => {
  let { uid, targetid, isLiked } = req.body

  const user = await User.findById(uid)
  const target = await User.findById(targetid)

  if (!user || !target) {
    res.status(400)
    throw new Error('Ползователей с таким ID не существует ⚠️ ')
  }

  // UPDATE
  const haveLink = await Link.findOne({ uid, targetid })
  if (haveLink) {
    if (+user.target === +target.id) {
      user.target = ''
      await user.save()
    }

    if (haveLink.isLiked === isLiked) {
      res.status(400)
      throw new Error('Взаимосвязь данных пользователей уже существует')
    }

    haveLink.isLiked = isLiked
    await haveLink.save()
    return res.status(200).json({
      message: `Линк успешно обновлен 😄 `,
      data: haveLink,
    })
  }

  const link = await Link.create({ uid, targetid, isLiked })
  if (!link) {
    res.status(400)
    throw new Error('Не удалось добавить новый линк 😥 ')
  }

  if (+user.target === +target.id) {
    user.target = ''
    await user.save()
  }

  // MATCH <=> LIKE ❤️
  let isMatch = await Link.findOne({
    uid: targetid,
    targetid: uid,
    isLiked,
  })

  res.status(201).json({
    message: `Линк успешно добавлен 😄 `,
    data: link,
    isMatch: !!isMatch,
  })
})

// @desc      Update link users
// @route     PUT /api/link
// @access    Private
const updateLink = asyncHandler(async (req, res) => {
  const { uid, targetid, isLiked } = req.body

  const user = await User.findById(uid)
  const target = await User.findById(targetid)

  if (!user || !target) {
    res.status(400)
    throw new Error('Ползователей с таким ID не существует ⚠️ ')
  }

  const link = await Link.findOne({ uid, targetid })
  if (!link || link.isLiked === isLiked) {
    res.status(400)
    throw new Error('Взаимосвязь данных пользователей уже существует')
  }

  link.isLiked = isLiked
  await link.save()

  res.status(200).json({
    message: `Линк успешно обновлен 😄 `,
    data: link,
  })
})

// @desc      Get all links with this user
// @route     GET /api/link/:id
// @access    Private
const getLinksWithId = asyncHandler(async (req, res) => {
  const id = req.params.id
  const user = await User.findOne({ id })
  const links = await Link.find({
    $or: [{ uid: user._id }, { targetid: user._id }],
    isLiked: true,
  }).populate('targetid')

  // TODO: переделать на человеческий
  const match = links.filter(
    link =>
      link.uid.toString() === user._id.toString() &&
      links.some(
        l =>
          l.targetid._id.toString() === user._id.toString() &&
          l.uid.toString() === link.targetid._id.toString()
      )
  )

  const usersMatch = match.map(l => l.targetid.id).slice(0, 10)
  user.match = usersMatch
  await user.save()

  res.status(200).json({
    message: `Найдено ${match.length} линков`,
    data: usersMatch,
  })
})

module.exports = {
  getLinks,
  getLinksWithId,
  createLink,
  updateLink,
}
