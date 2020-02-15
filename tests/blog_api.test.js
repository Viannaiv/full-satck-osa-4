const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('Tests for GET /api/blogs:', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all saved blogs are returned', async () => {
    const res = await api.get('/api/blogs')
    expect(res.body.length).toBe(helper.initialBlogs.length)
  })

  test('the identification field of a returned blog is named id not _id', async () => {
    const res = await api.get('/api/blogs')
    const blogs = res.body
    expect(blogs[0].id).toBeDefined()
    expect(blogs[0]._id).not.toBeDefined()
  })
})

afterAll(() => {
  mongoose.connection.close()
})