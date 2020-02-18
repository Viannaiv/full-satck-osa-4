const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

describe('When there is initially some blogs in db', () => {
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

      expect(blogs.filter(blog => blog.id === returned_id)[0]).toMatchObject(newBlog)
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

  describe('Tests for DELETE /api/blogs/:id :', () => {
    test('deletion succeeds with status code 204 if the id is valid', async () => {
      const blogsAtBeginning = await helper.blogsInDb()
      const deletableBlog = blogsAtBeginning[0]

      await api
        .delete(`/api/blogs/${deletableBlog.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(blogsAtBeginning.length - 1)

      expect(blogsAtEnd).not.toContainEqual(deletableBlog)
    })
  })

  describe('Tests for PUT /api/blogs/:id :', () => {
    test('updating a blog succeeds and updates the blog with correct content', async () => {
      const blogsAtBeginning = await helper.blogsInDb()
      const blogToUpdate = blogsAtBeginning[0]
      const updatedBlog = {
        ...blogToUpdate,
        likes: 9
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(blogsAtBeginning.length)

      expect(blogsAtEnd).not.toContainEqual(blogToUpdate)
      expect(blogsAtEnd).toContainEqual(updatedBlog)
    })
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({
      username: 'test_user',
      name: 'testUser',
      password: 'testest'
    })
    await user.save()
  })

  describe('Tests for POST /api/blogs :', () => {
    test('succeeds with a unique username', async () => {
      const usersAtBeginning = await helper.usersInDb()

      const newUser = {
        username: 'Tester123',
        name: 'Tester',
        password: 'tester',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtBeginning.length + 1)

      const usernames = usersAtEnd.map(user => user.username)
      expect(usernames).toContain(newUser.username)
    })

    test('fails with fitting statuscode and error message if username not unique', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'test_user',
        name: 'testUser',
        password: 'testest'
      }

      const res = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(res.body.error).toContain('`username` to be unique')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

    test('fails with fitting statuscode and error message if username too short', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 't',
        name: 'testUser',
        password: 'testest'
      }

      const res = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(res.body.error).toContain('is shorter than the minimum allowed length', '`username`')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

    test('fails with fitting statuscode and error message if there is no username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        name: 'testUser',
        password: 'testest'
      }

      const res = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(res.body.error).toContain('`username` is required')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

    test('fails with fitting statuscode and error message if password too short', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'testpersonnel',
        name: 'testUser',
        password: 'te'
      }

      const res = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(res.body.error).toContain('password is shorter than the minimum allowed length (3)')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

    test('fails with fitting statuscode and error message if there is no password', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'testpersonnel',
        name: 'testUser'
      }

      const res = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(res.body.error).toContain('password required')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})