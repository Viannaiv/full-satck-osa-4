const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const likelist = blogs.map(blog => blog.likes)
  const blog = blogs.find(b => b.likes === Math.max(...likelist))

  return blog
    ? {
      title: blog.title,
      author: blog.author,
      likes: blog.likes
    }
    : {}
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}