<script setup>
import authV1BottomShape from '@images/svg/auth-v1-bottom-shape.svg?raw'
import authV1TopShape from '@images/svg/auth-v1-top-shape.svg?raw'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'


definePageMeta({
  layout: 'blank',
  public: true,

})

const route = useRoute()
const authStore = useAuthStore()

const form = ref({
  newPassword: '',
  confirmPassword: '',
})

const errorMessage = ref(null);
const successMessage = ref(null)
const formRef = ref(null);

const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)


const handleResetPassword = async () => {

 const { valid } = await formRef.value.validate();

  if (!valid) {
    return;
  }

  const email = route.query.email  
  const token = route.query.token

  console.log('email',email)

   console.log('token',token)

  if (!email || !token) {
    authStore.errorMessage = "Invalid password reset link"
    return
  }

  const success = await authStore.resetPassword({
    email,
    token,
    password: form.value.newPassword,
    password_confirmation: form.value.confirmPassword,
  })

  if (success) {
    navigateTo("/login") 
    successMessage.value = "Password Reset Successfully"
  } else {
    errorMessage.value = authStore.errorMessage
  }

}
</script>

<template>
    <VSnackbar v-model="errorMessage" color="error">
      {{ errorMessage }}
    </VSnackbar>
    <VSnackbar v-model="successMessage" color="success">
    {{ successMessage }}
  </VSnackbar>
    
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <!-- 👉 Top shape -->
      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1TopShape })"
        class="text-primary auth-v1-top-shape d-none d-sm-block"
      />

      <!-- 👉 Bottom shape -->
      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1BottomShape })"
        class="text-primary auth-v1-bottom-shape d-none d-sm-block"
      />

      <!-- 👉 Auth Card -->
      <VCard
        class="auth-card"
        max-width="460"
        :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-2'"
      >
        <VCardItem class="justify-center">
          <VCardTitle>
            <NuxtLink to="/">
              <div class="app-logo">
                <VNodeRenderer :nodes="themeConfig.app.logo" />

              </div>
            </NuxtLink>
          </VCardTitle>
        </VCardItem>

        <VCardText>
          <h4 class="text-h4 mb-1">
            Reset Password 🔒
          </h4>
          <p class="mb-0">
            Your new password must be different from previously used passwords
          </p>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="handleResetPassword" ref="formRef">
            <VRow>
              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.newPassword"
                  autofocus
                  label="New Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                    :rules="[requiredValidator , passwordValidator]"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
              </VCol>

              <!-- Confirm Password -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.confirmPassword"
                  label="Confirm Password"
                  placeholder="············"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :rules="[requiredValidator , passwordValidator, confirmedValidator(form.confirmPassword, form.newPassword)]"
                  :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                />
              </VCol>

              <!-- reset password -->
              <VCol cols="12">
                <VBtn class="login-btn" variant="outlined"
                  block
                  type="submit"
                >
                  Set New Password
                </VBtn>
              </VCol>

              <!-- back to login -->
              <VCol cols="12">
                <NuxtLink
                  class="d-flex align-center justify-center"
                  :to="{ name: '' }"
                >
                  <VIcon
                    icon="tabler-chevron-left"
                    size="20"
                    class="me-1 flip-in-rtl"
                  />
                  <span>Back to login</span>
                </NuxtLink>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
