const express = require('express')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')

require('dotenv').config()

const app = express()

logger.info('connecting to', url)
mongoose.connect(url, { family: 4 })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app