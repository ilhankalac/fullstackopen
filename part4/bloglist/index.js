const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')

require('dotenv').config()

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const app = express()

app.use(express.json())
app.use('/api/blogs', blogsRouter)

const PORT = 3003
app.listen(PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})