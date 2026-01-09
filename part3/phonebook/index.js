const express = require('express')
const app = express()
app.use(express.json())
var morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI
mongoose.connect(url, { family: 4 })

app.use(express.static('dist'))

app.use(cors())

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.method(req, res) === 'POST' ? JSON.stringify(req.body) : ''
  ].join(' ')
}))

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

app.get('/api/persons', (request, response) => {
  Person.find({}).then(contacts => {
    response.json(contacts)
  })
})

app.get('/info', (request, response) => {
  const count = persons.length
  const time = new Date()
  
  response.send(`
    <div>
      <p>Phonebook has info for ${count} people</p>
      <p>${time}</p>
    </div>
  `)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * 1_000_000_000)
}

const checkIfNameExists = (personObj) => {
  return persons.find(person => person.name === personObj.name)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  const person = {
    id: generateId(),
    name: body.name,
    number:  body.number
  }

  if (!person.name || !person.number) {
    return response.status(400).json({ error: 'content missing' })
  }

  if (checkIfNameExists(person)) {
    return response.status(400).json({ error: 'name must be unique' })
  }
  
  persons.push(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})