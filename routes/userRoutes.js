const router = require('express').Router()
const {
  getUsers,
  getUsersById,
  getPotentialPartnerUsers,
  createUser,
  updateUser,
  deleteUser,
  banUser,
  unbanUser,
} = require('../controllers/userController')

router.route('/').post(createUser).get(getUsers)
router.route('/:id/search').get(getPotentialPartnerUsers)
router.route('/:id').put(updateUser).delete(deleteUser).get(getUsersById)
router.route('/ban/:id').post(banUser)
router.route('/unban/:id').post(unbanUser)

module.exports = router
