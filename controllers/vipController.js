const asyncHandler = require('express-async-handler')
const VipPayment = require('../models/vipPaymentModel')

// @desc      Get all vip payments
// @route     GET /api/vip
// @access    Private
const getVipPayments = asyncHandler(async (req, res) => {
  const vips = await VipPayment.find()

  res.status(200).json({
    message: `В базе найдено ${vips.length} оплат 🤑 `,
    data: vips,
  })
})

// @desc      Create new vip payment
// @route     POST /api/vip
// @access    Private
const createVipPayment = asyncHandler(async (req, res) => {
  const data = req.body

  const newVipPayment = await VipPayment.create(data)
  if (!newVipPayment) {
    res.status(400)
    throw new Error('Не удалось добавить оплату 😥 ')
  }

  res.status(201).json({
    message: `Оплата успешно добавлена 🤑 `,
    data: newVipPayment,
  })
})

module.exports = {
  getVipPayments,
  createVipPayment,
}
