const router = require('express').Router()
const { tokenExtractor, sessionExtractor } = require('../util/middleware')

router.delete('/', tokenExtractor, sessionExtractor, async (req, res) => {
  await req.session.destroy();
  res.status(204).end();
})

module.exports = router