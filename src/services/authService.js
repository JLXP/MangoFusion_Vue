import api from '@/services/api'

export default {
  async signUp(userData) {
    try {
      //registration endpoint
      const response = await api.post('/auth/register', {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        role: userData.role,
      })
      console.log('Sign Up Response:', response)
      if (response.data.isSuccess) {
        return {
          success: true,
          message: 'User registered successfully',
        }
      } else {
        throw new Error('Registraton failed')
      }
    } catch (error) {
      console.error('Error in Registration', error)
      throw error
    }
  },
  async signIn(userData) {
    try {
      //registration endpoint
      const response = await api.post('/auth/login', {
        email: userData.email,
        password: userData.password,
      })
      console.log('Sign In Response:', response)
      if (response.data.isSuccess) {
        //si trae informacion se retornara el token y el user
        const { token, email } = response.data.result
        const payload = JSON.parse(atob(token.split('.')[1]))
        return {
          token,
          email,
          role: payload.role,
          name: payload.fullname,
          id: payload.id,
        }
      } else {
        throw new Error('Login failed')
      }
    } catch (error) {
      console.error('Error in Login', error)
      throw error
    }
  },
}
