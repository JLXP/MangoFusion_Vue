<template>
  <h1>Menu Item List {{ menuItems }}</h1>
</template>
<script setup>
import menuItemService from '@/services/menuItemService'
import { ref, onMounted } from 'vue'

const menuItems = ref([])
const loading = ref(false)

const fetchMenuItems = async () => {
  loading.value = true
  try {
    menuItems.value = await menuItemService.getMenuItems()
    console.log(menuItems.value)
  } catch (error) {
    console.log('Error fetch menu items:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchMenuItems)
</script>
