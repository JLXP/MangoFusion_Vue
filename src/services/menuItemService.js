import api from '@/services/api'

export default {
  async getMenuItems() {
    try {
      const response = await api.get('/menuItem')
      if (response.data.isSuccess) {
        return response.data
      } else {
        throw new Error('Failed to fecth menu Items')
      }
    } catch (error) {
      console.error('Error fetching menu items', error)
      throw error
    }
  },
}
