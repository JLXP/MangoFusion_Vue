const { defineStore } = require('pinia')
const { ref, computed, reactive } = require('vue')

export const useCartStore = defineStore('cartStore', () => {
  const cartItems = reactive([])

  const cartCount = computed(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  })

  // Calculate total price of items in the cart
  const cartTotal = computed(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  })

  function addToCart(menuItem, quantity = 1) {
    const existingItem = cartItems.find((cartItem) => cartItem.id === menuItem.id)
    if (existingItem) {
      existingItem.quantity += menuItem.quantity
    } else {
      cartItems.push({
        id: menuItem.id,
        name: menuItem.name,
        image: menuItem.image,
        price: menuItem.price,
        quantity: quantity,
      })
    }
  }

  function updateQuantity(itemId, quantity) {
    const item = cartItems.find((cartItem) => cartItem.id === itemId)
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
    const itemIndex = cartItems.findIndex((cartItem) => cartItem.id === itemId)
    if (itemIndex !== -1) {
      cartItems.splice(itemIndex, 1)
    }
  }

  function clearCart() {
    cartItems = []
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
})
