<script setup>
import authV1BottomShape from '@images/svg/auth-v1-bottom-shape.svg?raw'
import authV1TopShape from '@images/svg/auth-v1-top-shape.svg?raw'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { VForm } from 'vuetify/components/VForm'
// import { useGoogleVerify } from "@/composables/useGoogleVerify";
 const auth = useAuthStore();
const otpValidator = value => {
  if (!value || value.length !== 6) return 'OTP must be 6 digits';
  if (!/^\d{6}$/.test(value)) return 'OTP must contain only numbers';
  return true;
};

definePageMeta({
  layout: 'blank',
  public: true,

})

const errorMessage = ref(null);
const tokenInput = ref("");
const isOtpInserted = ref(false);


  const submit2FAToken = async () => {
  if (!tokenInput.value || tokenInput.value.length !== 6) {
    return;
  }


  isOtpInserted.value = true;
  const success = await auth.submit2FAToken(tokenInput.value);

  if(!success)
  {
    errorMessage.value = auth.errorMessage
  }
  isOtpInserted.value = false;

  
};


const router = useRouter()
const otp = ref('')

const onFinish = () => {
  isOtpInserted.value = true
  setTimeout(() => {
    isOtpInserted.value = false
    router.push('/')
  }, 2000)
}

const twoFactorUser = useCookie("twoFactorUser")

const clearTwoFactorUser = () => {
  twoFactorUser.value = null
}

</script>

<template>
   <VSnackbar v-model="errorMessage" color="error">
      {{ errorMessage }}
    </VSnackbar>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <!-- 👉 Top shape -->
      <VNodeRenderer :nodes="h('div', { innerHTML: authV1TopShape })"
        class="text-primary auth-v1-top-shape d-none d-sm-block" />

      <!-- 👉 Bottom shape -->
      <VNodeRenderer :nodes="h('div', { innerHTML: authV1BottomShape })"
        class="text-primary auth-v1-bottom-shape d-none d-sm-block" />

      <!-- 👉 Auth card -->
      <VCard class="auth-card" max-width="460" :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'">
        <VCardItem class="justify-center">
          <VCardTitle>
            <NuxtLink to="/">
              <div class="app-logo">
                <VNodeRenderer :nodes="themeConfig.app.logo" />

              </div>
            </NuxtLink>
          </VCardTitle>
        </VCardItem>
        <!-- back to login -->
        <VCol cols="12">
          <VCol cols="12">
            <NuxtLink class="d-flex align-center justify-start text-black" :to="{ name: 'login' }"
            @click="clearTwoFactorUser"
            >

              <VIcon icon="tabler-chevron-left" size="20" class="me-1 flip-in-rtl" />
              <span class="text-black">Back to login</span>
            </NuxtLink>
          </VCol>
        </VCol>
        <VCardText class="py-0">
          <h4 class="text-h4 mb-1 font-weight-medium">
            Two Factor Authentication
          </h4>

        </VCardText>

        <VCardText>
          <VForm @submit.prevent="submit2FAToken">
            <VRow>
              <!-- email -->
              <VCol cols="12 pb-1 mt-3">
                <!-- <AppTextField label="Enter Code" :type="isPasswordVisible ? 'number' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'" placeholder="Enter OTP"
                  :rules="[requiredValidator, passwordValidator]" autocomplete="on" v-model="tokenInput"
                  :disabled="isOtpInserted" @click:append-inner="isPasswordVisible = !isPasswordVisible" /> -->
                <span class="fs-15 label-color font-weight-medium">One Time Password</span>
                <v-otp-input :length="6" v-model="tokenInput" :disabled="isOtpInserted" autocomplete="on" class="pt-0"
                  :rules="[requiredValidator, passwordValidator]"/>
              </VCol>
              <!-- reset password -->
              <VCol cols="12">
                <VBtn variant="tonal" class="login-btn" :loading="isOtpInserted" :disabled="isOtpInserted || tokenInput.length !== 6" block
                  type="submit">
                  Verify
                </VBtn>
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

.v-otp-input {
  .v-otp-input__content {
    padding-inline: 0;
  }
}
</style>
