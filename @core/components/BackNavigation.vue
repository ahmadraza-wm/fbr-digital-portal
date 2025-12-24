<script setup>
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
     <NuxtLink to=""  class="d-flex align-center" @click="goBack">
  <i class="tabler-arrow-left fs-25  me-0 text-black cursor-pointer" style="color: rgba(47, 43, 61, 0.9) !important;"></i>
</NuxtLink>
</template>
