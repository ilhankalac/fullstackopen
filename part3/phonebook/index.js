require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
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

const Person = require('./models/person')
app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(contacts => {
    response.json(contacts)
  }).catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  const time = new Date()
  Person.find({}).then(contacts => {
    const count = contacts.length
    response.send(`
      <div>
        <p>Phonebook has info for ${count} people</p>
        <p>${time}</p>
      </div>
    `)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then(result => {
    let person = result
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then(result => {
    response.status(204).end()
  }).catch(error => next(error))
})

const generateId = () => {
  return Math.floor(Math.random() * 1_000_000_000)
}

/*const checkIfNameExists = (personObj) => {
  return persons.find(person => person.name === personObj.name)
}*/

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    id: generateId(),
    name: body.name,
    number:  body.number
  })

  if (!person.name || !person.number) {
    return response.status(400).json({ error: 'content missing' })
  }

  /*if (checkIfNameExists(person)) {
    return response.status(400).json({ error: 'name must be unique' })
  }*/
  
  person.save().then(result => {
    console.log('person saved');
  }).catch(error => next(error))
  
  response.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})