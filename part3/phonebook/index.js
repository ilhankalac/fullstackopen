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
  Person.findByIdAndDelete(id).then(() => {
    response.status(204).end()
  }).catch(error => next(error))
})

const generateId = () => {
  return Math.floor(Math.random() * 1_000_000_000)
}

const checkIfNameExists = (personObj) => {
  return Person.findOne({ name: personObj.name })
    .then(result => {
      return !!result
    })
    .catch(err => {
      console.error(err)
      return false
    })
}

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const { name, number } = request.body
  console.log(name, number)
  Person.findById(id).then(person => {

    if (!person) {
      return response.status(404).end()
    }

    person.name = name
    person.number = number

    return person.save().then((updatedPerson) => {
      response.json(updatedPerson)
    })
  }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    id: generateId(),
    name: body.name,
    number: body.number,
  })

  return checkIfNameExists(person)
    .then(exists => {
      if (exists) {
        return response.status(400).json({ error: 'name must be unique' })
      }

      return person.save().then(saved => {
        console.log('person saved')
        return response.status(201).json(saved)
      })
    })
    .catch(next)
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
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})