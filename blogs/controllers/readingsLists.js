const router = require('express').Router()

const {  ReadingList, User } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.get('/', async (req, res) => {
  const lists = await ReadingList.findAll()
  res.json(lists)
})

router.post('/', async (req, res) => {
  const readingListEntry = await ReadingList.create({ ...req.body })
  return res.status(201).json(readingListEntry)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const list = await ReadingList.findByPk(req.params.id)

  if (list.userId !== user.id) {
    res.status(401).json({ message: "Unauthorized update operation" }).end();
  }

  if (!req.body.hasOwnProperty('read')) {
    return res.status(422).json({ error: "Incorrect input, read must be true or false" })
  }
  list.read = req.body.read
  await list.save()
  res.json(list)
})


module.exports = router