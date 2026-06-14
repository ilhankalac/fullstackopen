import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Login from './components/Login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const notify = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )

    const loggedUser = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))
    if (loggedUser) {
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      notify(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, 'success')
    } catch (error) {
      notify(error.response?.data?.error || 'failed to create blog', 'error')
    }
  }

  if (user === null) {
    return (
      <div>
        {notification && (
          <Notification notification={notification} />
        )}
        <Login setUser={setUser} notify={notify} />
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      {notification && (
        <Notification notification={notification} />
      )}
      <p>{user.name} logged in
        <button onClick={() => {
          window.localStorage.removeItem('loggedBlogappUser')
          setUser(null)
        }}>
        logout
        </button>
      </p>
      <BlogForm createBlog={createBlog} />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App