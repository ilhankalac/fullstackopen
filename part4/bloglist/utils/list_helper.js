const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.likes;
  }, 0);
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  
  return blogs.reduce((favorite, current) => {
    return (current.likes > favorite.likes) ? current : favorite;
  });
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authors = new Set(
    blogs.map(blog => blog.author)
  )

  const blogCountsByAuthor = []

  authors.forEach(author => {
    blogCountsByAuthor.push({
      author,
      blogs: blogs.filter(blog => blog.author === author).length
    })
  })

  return blogCountsByAuthor.reduce((topAuthor, currentAuthor) => {
    return currentAuthor.blogs > topAuthor.blogs ? currentAuthor : topAuthor
  })
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}