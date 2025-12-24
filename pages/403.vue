<script setup>
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import miscMaskDark from '@images/pages/misc-mask-dark.png'
import miscMaskLight from '@images/pages/misc-mask-light.png'
import Companylogo from '@images/logos/africlinks-logo-2.png'

const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark)

definePageMeta({
  layout: 'blank',
})

const handleBack = () => {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="misc-wrapper d-flex flex-column align-center text-center">
    <!-- Logo -->
    <img :src="Companylogo" alt="Logo" height="70" class="mb-6" />

    <!-- Error Title -->
    <h1 class="text-h2 mb-2">403</h1>
    <h4 class="text-h5 mb-2">Access Forbidden 🚫</h4>
    <p class="text-body-1 mb-6">
      You don’t have permission to access this page. <br />
      Please contact the administrator if you think this is a mistake.
    </p>

    <!-- Back Button -->
    <VBtn color="primary" class="mb-8" @click="handleBack">
      Back to Home
    </VBtn>

    <!-- Background Mask -->
    <img
      class="misc-footer-img d-none d-md-block"
      :src="authThemeMask"
      alt="misc-footer-img"
      height="280"
    />
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/misc.scss";
</style>
