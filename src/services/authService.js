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
}
