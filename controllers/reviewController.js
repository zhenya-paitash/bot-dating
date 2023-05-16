const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Review = require('../models/reviewModel')

// @desc      Get all reviews
// @route     GET /api/review
// @access    Private
const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({}).populate('user', 'id')

  res.status(200).json({
    message: `В базе найдено ${reviews.length} отзывов 😃 `,
    data: reviews,
  })
})

// @desc      Create new review or update if exists
// @route     POST /api/review
// @access    Private
const createReview = asyncHandler(async (req, res) => {
  const { user, review } = req.body

  const userExist = await User.findById(user)
  if (!userExist) {
    res.status(400)
    throw new Error('Пользователя с таким ID не существует ⚠️ ')
  }

  // UPDATE
  const oldReview = await Review.findOne({ user })
  if (oldReview) {
    if (oldReview.review === review) {
      res.status(400)
      throw new Error('Вы посылаете тот же отзыв 😥 ')
    }

    oldReview.review = review
    await oldReview.save()
    return res.status(200).json({
      message: `Отзыв успешно обновлен 😄 `,
      data: oldReview,
    })
  }

  const newReview = await Review.create({ user, review })
  if (!newReview) {
    res.status(400)
    throw new Error('Не удалось добавить новый отзыв 😥 ')
  }

  res.status(201).json({
    message: `Отзыв успешно добавлен 😄 `,
    data: newReview,
  })
})

module.exports = {
  getReviews,
  createReview,
}
