const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

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
},
{
  _id: '4b432cv54y67k898995f22t4',
  title: 'A test blog title number 4',
  author: 'a tester',
  url: 'http://www.randomtestaddress.com/test4',
  likes: 0,
  __v: 0
}])

const listWithEqualLikes = listOfOneBlog.concat({
  _id: '6b432cv54y67k898995f22t6',
  title: 'A test blog title with identical likes',
  author: 'a tester',
  url: 'http://www.randomtestaddress.com/test',
  likes: 3,
  __v: 0
})

describe('total likes', () => {
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

describe('favorite blog', () => {
  test('of empty array returns {}', () => {
    expect(listHelper.favoriteBlog([])).toEqual({})
  })

  test('of a list containing one blog is the one blog', () => {
    expect(listHelper.favoriteBlog(listOfOneBlog)).toEqual({
      title: 'A test blog title',
      author: 'a tester',
      likes: 3,
    })
  })

  test('of a longer list is the one with most likes', () => {
    expect(listHelper.favoriteBlog(listOfBlogs)).toEqual({
      title: 'A test blog title number 2',
      author: 'a tester',
      likes: 7,
    })
  })
  test('of a list with equal highest likes returns the first of one', () => {
    expect(listHelper.favoriteBlog(listWithEqualLikes)).toEqual({
      title: 'A test blog title',
      author: 'a tester',
      likes: 3
    })
  })
})