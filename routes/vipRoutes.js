const router = require('express').Router()
const {
  getVipPayments,
  createVipPayment
} = require('../controllers/vipController')

router.route('/').post(createVipPayment).get(getVipPayments)

module.exports = router
