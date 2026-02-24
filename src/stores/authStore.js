import { useSwal } from '@/composables/swal'
import { APP_ROUTE_NAMES } from '@/constants/routerName'
import router from '@/router/routes'
import authService from '@/services/authService'
import SignIn from '@/views/auth/SignIn.vue'
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
      const { showSuccess } = useSwal()
      showSuccess('Registration successful')
      router.push(APP_ROUTE_NAMES.SIGN_IN)
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.errorMessages?.join('--') || 'Registration failed',
      }
    }
  }

  async function signIn(formObj) {
    try {
      //async await
      const { token, user: userData } = await authService.signIn(formObj)
      Object.assign(user, userData)
      user.isLoggedIn = true
      isAuthenticated.value = true

      router.push('/')

      //const { showSuccess } = useSwal()
      //showSuccess('Login successful')
      //router.push(APP_ROUTE_NAMES.HOME)
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
    signIn,
  }
})
