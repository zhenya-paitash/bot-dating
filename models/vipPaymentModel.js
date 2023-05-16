const mongoose = require('mongoose')

const VipPaymentSchema = mongoose.Schema(
  {
    tgid: { type: Number, required: true },
    tarif: { type: String, required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('VipPayment', VipPaymentSchema)
