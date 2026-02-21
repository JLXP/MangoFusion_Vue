import { APP_ROUTE_NAMES } from '@/constants/routerName'
import router from '@/router/routes'
import authService from '@/services/authService'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

export const useAuthStore = defineStore('authStore', () => {
  const user = reactive({
    email: '',
    password: '',
    name: '',
    id: '',
    isLoggedIn: false,
  })

  const isAuthenticated = ref(false)

  //getter
  const getUserInfo = computed(() => {
    return isAuthenticated.value ? user : null
  })
  //actions
  async function signUp(userData) {
    try {
      await authService.signUp(userData)
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.errorMessages?.join('--') || 'Registration failed',
      }
    }
  }

  return {
    user,
    isAuthenticated,
    getUserInfo,
    signUp,
  }
})
