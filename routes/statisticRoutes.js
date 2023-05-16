const router = require('express').Router()
const {
  // BOT STATISTIC
  getBotDayStatistic,
  createBotDayStatistic,
  // USER STATISTIC
  getUserStatistic,
  updateUserStatistic,
} = require('../controllers/statisticController')

router.route('/user/:id').put(updateUserStatistic).get(getUserStatistic)
router.route('/').post(createBotDayStatistic)
router.route('/:date').get(getBotDayStatistic)

module.exports = router
