const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  response.json(users)
})

usersRouter.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body

    if (!password || password.length < 3) {
      return res.status(400).json({
        error: 'password must be at least 3 characters long'
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const savedUser = await new User({
      username,
      name,
      passwordHash
    }).save()

    res.status(201).json(savedUser)
  } catch (err) {
    next(err)
  }
})

module.exports = usersRouter
