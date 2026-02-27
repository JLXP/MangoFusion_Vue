import { useSwal } from '@/composables/swal'
import { APP_ROUTE_NAMES } from '@/constants/routerName'
import router from '@/router/routes'
import authService from '@/services/authService'
import SignIn from '@/views/auth/SignIn.vue'
import Cookies from 'js-cookie'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

export const useAuthStore = defineStore('authStore', () => {
  const user = reactive({
    email: '',
    password: '',
    name: '',
    id: '',
  })

  const isAuthenticated = ref(false)

  //getter
  const getUserInfo = computed(() => {
    return isAuthenticated.value ? user : null
  })

  const isAdmin = computed(() => {
    return isAuthenticated.value && user.role === 'admin'
  })

  function decodeToken(token) {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return {
      email: payload.email,
      name: payload.fullname,
      id: payload.id,
      role: payload.role,
    }
  }

  function initialize() {
    try {
      //Se obtiene el token
      const token = Cookies.get('token_mango')

      if (token) {
        //Se decodifica el token para obtener la información del usuario
        const userData = decodeToken(token)
        if (userData) {
          Object.assign(user, userData)
          isAuthenticated.value = true
        } else {
          clearAuthData()
        }
      } else {
        clearAuthData()
      }
    } catch (err) {
      console.error('Error initializing auth store:', err)
      clearAuthData()
    }
  }

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
      isAuthenticated.value = true
      Cookies.set('token_mango', token, { expires: 7 })
      router.push('/')

      //const { showSuccess } = useSwal()s
      //showSuccess('Login successful')
      //router.push(APP_ROUTE_NAMES.HOME)
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.errorMessages?.join('--') || 'Registration failed',
      }
    }
  }

  function clearAuthData() {
    Object.assign(user, {
      email: '',
      password: '',
      name: '',
      id: '',
    })
    isAuthenticated.value = false
    Cookies.remove('token_mango')
  }

  function signOut() {
    clearAuthData()
    router.push({ name: APP_ROUTE_NAMES.SIGN_IN })
  }

  return {
    user,
    isAuthenticated,
    getUserInfo,
    isAdmin,
    signUp,
    signIn,
    initialize,
    signOut,
  }
})
