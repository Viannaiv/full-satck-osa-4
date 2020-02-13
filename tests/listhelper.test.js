const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listOfOneBlog = [{
    _id: '1b432cv54y67k898995f22t7',
    title: 'A test blog title',
    author: 'a tester',
    url: 'http://www.randomtestaddress.com/test',
    likes: 3,
    __v: 0
  }]

  const listOfBlogs = listOfOneBlog.concat([{
    _id: '2b432cv54y67k898995f22t8',
    title: 'A test blog title number 2',
    author: 'a tester',
    url: 'http://www.randomtestaddress.com/test2',
    likes: 7,
    __v: 0
  },
  {
    _id: '3b432cv54y67k898995f22t9',
    title: 'A test blog title number 3',
    author: 'a tester',
    url: 'http://www.randomtestaddress.com/test3',
    likes: 5,
    __v: 0
  }])

  test('of empty list of blogs is 0', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('of a list containing one blog equals the likes of that one blog', () => {
    expect(listHelper.totalLikes(listOfOneBlog)).toBe(3)
  })

  test('of a longer list is correctly calculated', () => {
    expect(listHelper.totalLikes(listOfBlogs)).toBe(15)
  })
})