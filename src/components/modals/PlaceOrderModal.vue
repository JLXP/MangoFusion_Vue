import { computed } from 'vue';
<template>
  <div
    v-if="isOpen"
    class="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-black bg-opacity-50"
    style="z-index: 1050"
  >
    <div
      class="bg-body p-4 rounded-4 shadow-lg mx-3 overflow-auto"
      style="max-width: 500px; width: 100%; max-height: 90vh"
    >
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold m-0">Complete Your Order</h4>
        <button class="btn" @click="closeModal"><i class="bi bi-x-circle"></i></button>
      </div>

      <div v-if="errorList.length > 0" class="alert alert-danger" role="alert">
        <span class="d-block" v-for="error in errorList" :key="error"> {{ error }} </span>
      </div>

      <form @submit.prevent="submitOrder">
        <div class="mb-3">
          <label for="pickupName" class="form-label">Name</label>
          <input v-model="orderData.pickUpName" type="text" class="form-control" id="pickupName" />
        </div>

        <div class="mb-3">
          <label for="pickupPhoneNumber" class="form-label">Phone Number</label>
          <input
            v-model="orderData.pickUpPhoneNumber"
            type="tel"
            class="form-control"
            id="pickupPhoneNumber"
          />
        </div>

        <div class="mb-4">
          <label for="pickupEmail" class="form-label">Email</label>
          <input
            v-model="orderData.pickUpEmail"
            type="email"
            class="form-control"
            id="pickupEmail"
          />
        </div>

        <div class="bg-body-tertiary rounded-3 p-3 mb-4">
          <h5 class="fw-bold mb-3">Order Summary</h5>
          <div v-if="cartStore.cartItems && cartStore.cartItems.length > 0">
            <div
              class="d-flex justify-content-between align-items-center mb-2"
              v-for="item in cartStore.cartItems"
              :key="item.id"
            >
              <span class="fw-medium">{{ item.name }}</span>
              <div class="d-flex align-items-center gap-3">
                <span class="text-body-secondary">{{ item.quantity }} x</span>
                <span class="fw-medium">${{ item.price }}</span>
              </div>
            </div>
            <div class="border-top pt-3 mt-3">
              <div class="d-flex justify-content-between align-items-center">
                <span class="fw-bold">Total</span>
                <span class="fw-bold fs-5">${{ cartStore.totalPrice.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-outline-secondary px-4" @click="closeModal">
            Cancel
          </button>
          <button
            type="submit"
            class="btn btn-success px-4"
            :disabled="isSubmitting || !cartStore.cartItems || cartStore.cartItems.length === 0"
          >
            <span v-if="isSubmitting" class="d-flex align-items-center gap-2">
              <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              Processing...
            </span>
            <span v-else>Place Order</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { APP_ROUTE_NAMES } from '@/constants/routerName'
import orderService from '@/services/orderService'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const authStore = useAuthStore()

const cartStore = useCartStore()
const isSubmitting = ref(false)
const errorList = reactive([])

//order data structure to send to backend when placing order
const orderData = reactive({
  pickUpName: '',
  pickUpPhoneNumber: '',
  pickUpEmail: '',
  applicationUserId: 1,
  orderTotal: 1,
  totalItem: 1,
  orderDetailsDTO: [],
})

const props = defineProps({
  isOpen: Boolean,
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    orderData.pickUpName = authStore.user.name
    orderData.pickUpEmail = authStore.user.email
    orderData.applicationUserId = authStore.user.id
  }
})

const submitOrder = async () => {
  try {
    isSubmitting.value = true
    errorList.length = 0
    const requiredFields = [
      { key: 'pickUpName', message: 'Name is required' },
      { key: 'pickUpEmail', message: 'Email is required' },
      { key: 'pickUpPhoneNumber', message: 'Phone Number is required' },
    ]

    requiredFields.forEach((field) => {
      const value = orderData[field.key]

      if (!value || value.trim().length === 0) {
        errorList.push(field.message)
      }
    })

    if (errorList.length > 0) {
      isSubmitting.value = false
      return
    }

    orderData.orderTotal = cartStore.cartTotal

    orderData.totalItem = cartStore.cartCount

    orderData.orderDetailsDTO = Array.isArray(cartStore.cartItems)
      ? cartStore.cartItems.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
          itemName: item.name,
          price: item.price,
        }))
      : []

    const orderHeader = await orderService.createOrder(orderData)
    if (orderHeader && orderHeader.orderHeaderId > 0) {
      router.push({
        name: APP_ROUTE_NAMES.ORDER_CONFIRM,
        params: { orderId: orderHeader.orderHeaderId },
      })
    } else {
      throw new Error('Failed to create order')
    }
  } catch (error) {
    errorList.push(error.message)
  } finally {
    isSubmitting.value = false
  }
}
</script>
