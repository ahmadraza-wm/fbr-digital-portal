<script setup>
defineProps({
  color: {
    type: String,
    default: 'text-secondary',
  },
})
const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <button type="button" :class="['d-flex align-center bg-transparent border-0 ' , color] " @click="goBack">
    <i class="tabler-arrow-left fs-25"></i>
  </button>
</template>
