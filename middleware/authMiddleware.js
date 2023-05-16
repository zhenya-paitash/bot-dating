const asyncHandler = require('express-async-handler')

const protect = asyncHandler(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    const [, token] = req.headers.authorization.split` `
    if (!token || token !== process.env.SECRET_TOKEN) {
      res.status(401)
      throw new Error('Invalid token 🛡️')
    }

    return next()
  }

  res.status(401)
  throw new Error('Not authorized 🛡️')
})

module.exports = {
  protect,
}
