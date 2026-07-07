const { defineStore } = require('pinia')
const { ref, computed, reactive } = require('vue')

export const useCartStore = defineStore(
  'cartStore',
  () => {
    const cartItems = ref([])

    const cartCount = computed(() => {
      return cartItems.value.reduce((total, item) => total + item.quantity, 0)
    })

    // Calculate total price of items in the cart
    //comment
    const cartTotal = computed(() => {
      return cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0)
    })

    function addToCart(menuItem, quantity = 1) {
      const existingItem = cartItems.value.find((cartItem) => cartItem.id === menuItem.id)
      if (existingItem) {
        existingItem.quantity += menuItem.quantity
      } else {
        cartItems.value.push({
          id: menuItem.id,
          name: menuItem.name,
          image: menuItem.image,
          price: menuItem.price,
          quantity: quantity,
        })
      }
    }

    function updateQuantity(itemId, quantity) {
      const item = cartItems.value.find((cartItem) => cartItem.id === itemId)
      if (item) {
        if (quantity <= 0) {
          removeFromCart(itemId)
        } else {
          item.quantity = quantity
        }
      }
    }

    function removeFromCart(itemId) {
      //queremos encontrar el indice
      const itemIndex = cartItems.value.findIndex((cartItem) => cartItem.id === itemId)
      if (itemIndex !== -1) {
        cartItems.value.splice(itemIndex, 1)
      }
    }

    function clearCart() {
      cartItems.value = []
    }

    return {
      cartItems,
      cartCount,
      cartTotal,
      addToCart,
      clearCart,
      removeFromCart,
      updateQuantity,
    }
  },
  {
    persist: true,
  },
)
