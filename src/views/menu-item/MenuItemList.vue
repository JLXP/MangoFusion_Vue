<template>
  <h1>Menu Item List {{ menuItems }}</h1>
</template>
<script setup>
import menuItemService from '@/services/menuItemService'
import { ref, onMounted, reactive } from 'vue'

const menuItems = reactive([])
const loading = ref(false)

const fetchMenuItems = async () => {
  loading.value = true
  try {
    const result = await menuItemService.getMenuItems()
    menuItems.push(...result)
  } catch (error) {
    console.log('Error fetch menu items:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchMenuItems)
</script>
