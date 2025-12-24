<script setup>
import promotionsForm from '@/components/promotions/promotionsForm.vue';
 definePageMeta({
  middleware: "auth",
  permission: "promotions.store"
})
</script>
<template>
  <promotionsForm :isEdit="false" />
</template>
