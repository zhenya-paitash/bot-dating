const router = require('express').Router()
const {
  getLinks,
  getLinksWithId,
  createLink,
  updateLink,
} = require('../controllers/linkController')

router.route('/').put(updateLink).post(createLink).get(getLinks)
router.route('/:id').get(getLinksWithId)

module.exports = router
