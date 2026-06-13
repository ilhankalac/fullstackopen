import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  const user = response.data
  window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
  return response.data
}

export default { login }