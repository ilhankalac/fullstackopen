const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'First blog',
    author: 'Author One',
    url: 'http://example.com/first',
    likes: 5
  },
  {
    title: 'Second blog',
    author: 'Author Two',
    url: 'http://example.com/second',
    likes: 3
  },
  {
    title: 'Third blog',
    author: 'Author Three',
    url: 'http://example.com/third',
    likes: 8
  }
]

let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const userResponse = await api.post('/api/users').send({ username: 'testuser', name: 'Test User', password: 'password' })
  const loginResponse = await api.post('/api/login').send({ username: 'testuser', password: 'password' })

  token = loginResponse.body.token

  const userId = userResponse.body.id
  const blogsWithUser = initialBlogs.map(blog => ({ ...blog, user: userId }))
  await Blog.insertMany(blogsWithUser)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('correct number of blogs is returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body

  blogs.forEach(blog => {
    assert.ok(blog.id, 'Blog post does not have an id property')
  })
})

test('POST /api/blogs creates a new blog with valid data', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'Author Four',
    url: 'http://example.com/new',
    likes: 7
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length + 1)
})

test('POST /api/blogs sets default likes value to 0 if likes property is missing', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'Author Five',
    url: 'http://example.com/nolikes'
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  const response = await api.get('/api/blogs')
  const addedBlog = response.body.find(blog => blog.title === 'Blog without likes')
  assert.strictEqual(addedBlog.likes, 0)
})

test('POST /api/blogs without title or url returns 400 Bad Request', async () => {
  const newBlog = {
    author: 'Author Six',
    likes: 4
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('POST /api/blogs without token returns 401 Unauthorized', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'Author Four',
    url: 'http://example.com/new',
    likes: 7
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

test('DELETE /api/blogs/:id deletes a blog post', async () => {
  const response = await api.get('/api/blogs')
  const blogToDelete = response.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAfterDeletion = await api.get('/api/blogs')
  assert.strictEqual(blogsAfterDeletion.body.length, initialBlogs.length - 1)
  const deletedBlog = blogsAfterDeletion.body.find(blog => blog.id === blogToDelete.id)
  assert.strictEqual(deletedBlog, undefined)
})

test('PUT /api/blogs/:id updates a blog post', async () => {
  const response = await api.get('/api/blogs')
  const blogToUpdate = response.body[0]

  const updatedBlogData = {
    title: 'Updated Title 1',
    author: 'Updated Author 1',
    url: 'http://new-url.com/updated',
    likes: 9
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlogData)
    .expect(200)

  const updatedBlogResponse = await api.get('/api/blogs')
  const updatedBlog = updatedBlogResponse.body.find(blog => blog.id === blogToUpdate.id)

  assert.strictEqual(updatedBlog.title, updatedBlogData.title)
  assert.strictEqual(updatedBlog.author, updatedBlogData.author)
  assert.strictEqual(updatedBlog.url, updatedBlogData.url)
  assert.strictEqual(updatedBlog.likes, updatedBlogData.likes)
})

after(async () => {
  await mongoose.connection.close()
})