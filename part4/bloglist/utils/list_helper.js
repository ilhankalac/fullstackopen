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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}