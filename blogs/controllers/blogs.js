const router = require('express').Router()
const { Op } = require('sequelize')

const { Blog, User } = require('../models')
const { tokenExtractor, sessionExtractor, userExtractor } = require('../util/middleware')

router.post('/', tokenExtractor, sessionExtractor, userExtractor, async (req, res) => {
  console.log('posting here')
  const blog = await Blog.create({ ...req.body, userId: req.user.id })
  return res.status(201).json(blog)
})

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.substring]: req.query.search
        }
      },
      {
        author: {
          [Op.substring]: req.query.search
        }
      }
    ]
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name', 'username']
    },
    where,
    order: [
      ['likes', 'DESC']
    ],
  })
  // console.log(JSON.stringify(blogs, null, 2))
  res.json(blogs)
})

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/:id', blogFinder, async (req, res) => {
  res.json(req.blog)
})

router.put('/:id', blogFinder, tokenExtractor, sessionExtractor, userExtractor, async (req, res) => {
  req.blog.likes = req.body.likes
  await req.blog.save()
  res.json(req.blog)
})


router.delete('/:id', blogFinder, tokenExtractor, sessionExtractor, userExtractor, async (req, res) => {
  if (req.blog.userId === req.user.id) {
    await req.blog.destroy();
    res.status(204).end();
  }
  else {
    res.status(401).json({ message: "Unauthorized delete operation" }).end();
  }
})


module.exports = router