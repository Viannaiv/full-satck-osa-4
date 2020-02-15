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

describe('Tests for GET /api/blogs :', () => {
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

describe('Tests for POST /api/blogs :', () => {
  test('a new blog is added correctly', async () => {
    const newBlog = {
      title: 'Interesting blog',
      author: 'M. Find',
      url: 'http://www.interestingblogs.com/find',
      likes: 10
    }

    const res = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs =  await helper.blogsInDb()
    expect(blogs.length).toBe(helper.initialBlogs.length + 1)

    const returned_id = res.body.id
    newBlog.id = returned_id
    expect(blogs).toContainEqual(newBlog)
  })

  test('the likes of a new blog are set to 0 if no other value is defined', async () => {
    const newBlog = {
      title: 'A new blog without likes',
      author: 'N. Find',
      url: 'http://www.interestingblogs.com/nolikes'
    }

    const res = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    expect(res.body.likes).toBe(0)
  })

  test('if new blog does not contain a title, status code 400 is returned', async () => {
    const newBlog = {
      author: 'M',
      url: 'http://www.interestingblogs.com/notitle',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('if new blog does not contain a url, status code 400 is returned', async () => {
    const newBlog = {
      title: 'A new blog without url',
      author: 'A',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

afterAll(() => {
  mongoose.connection.close()
})