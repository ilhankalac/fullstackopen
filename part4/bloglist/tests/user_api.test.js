const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
})

test('user without username is not created', async () => {
  const newUser = {
    name: 'Test User',
    password: 'sekret'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert.ok(result.body.error)

  const users = await User.find({})
  assert.strictEqual(users.length, 0)
})

after(async () => {
  await mongoose.connection.close()
})
