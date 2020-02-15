const Blog = require('../models/blog')

const initialBlogs = [{
  title: 'A test blog title 1',
  author: 'tester 1',
  url: 'http://www.randomtestaddress.com/test1',
  likes: 3
},
{
  title: 'A test blog title number 2',
  author: 'tester 2',
  url: 'http://www.randomtestaddress.com/test2',
  likes: 7
},
{
  title: 'A test blog title number 3',
  author: 'tester 3',
  url: 'http://www.randomtestaddress.com/test3',
  likes: 5
},
{
  title: 'A test blog title number 4',
  author: 'tester 4',
  url: 'http://www.randomtestaddress.com/test4',
  likes: 0
}]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'to be removed instantly' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}