const router = require('express').Router()
const { createReview, getReviews } = require('../controllers/reviewController')

router.route('/').post(createReview).get(getReviews)

module.exports = router
