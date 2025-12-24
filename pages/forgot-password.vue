<script setup>
import { useGenerateImageVariant } from "@core/composable/useGenerateImageVariant";
import Companylogo from "@images/logos/logo.png";
import authV2ForgotPasswordIllustrationDark from "@images/pages/auth-v2-forgot-password-illustration-dark.png";
import authV2ForgotPasswordIllustrationLight from "@images/pages/auth-v2-forgot-password-illustration-light.png";
import authV2MaskDark from "@images/pages/misc-mask-dark.png";
import authV2MaskLight from "@images/pages/misc-mask-light.png";
import authV1BottomShape from "@images/svg/auth-v1-bottom-shape.svg?raw";
import authV1TopShape from "@images/svg/auth-v1-top-shape.svg?raw";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();

const email = ref("");
const authThemeImg = useGenerateImageVariant(
  authV2ForgotPasswordIllustrationLight,
  authV2ForgotPasswordIllustrationDark
);
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark);

definePageMeta({
  layout: "blank",
  unauthenticatedOnly: true,
});

const errorMessage = ref(null);
const successMessage = ref(null);
const loading = ref(false);

const handleForgotPassword = async () => {
  loading.value = true;
  errorMessage.value = null;
  successMessage.value = null;

  const success = await authStore.forgotPassword(email.value);
  if (success) {
    successMessage.value = "OTP or Reset Link Sent! Check your email.";
  } else {
    errorMessage.value = authStore.errorMessage;
  }
  loading.value = false;
};
</script>

<template>
  <VSnackbar v-model="successMessage" color="success">
    {{ successMessage }}
  </VSnackbar>
  <VSnackbar v-model="errorMessage" color="error">
    {{ errorMessage }}
  </VSnackbar>
  <VRow class="auth-wrapper bg-surface d-flex justify-center" no-gutters>
    <VCol
      cols="12"
      md="4"
      class="d-flex align-center justify-center position-relative pa-4"
    >
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
        <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4" elevation="16">
          <VCardText class="text-center py-5">
            <img :src="Companylogo" alt="Logo Image" class="ma-auto" />
          </VCardText>
          <VCardText>
            <h4 class="text-h4 mb-1">Forgot Password? 🔒</h4>
            <p class="mb-0">
              Enter your email and we'll send you instructions to reset your
              password
            </p>
          </VCardText>

          <VCardText>
            <VForm @submit.prevent="handleForgotPassword">
              <VRow>
                <!-- email -->
                <VCol cols="12">
                  <AppTextField
                    v-model="email"
                    autofocus
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                  />
                </VCol>

                <!-- Reset link -->
                <VCol cols="12">
                  <VBtn
                    class="login-btn"
                    variant="outlined"
                    block
                    type="submit"
                    :loading="loading"
                  >
                    {{ loading ? "Sending Reset Email..." : "Send Reset Link" }}
                  </VBtn>
                </VCol>

                <!-- back to login -->
                <VCol cols="12">
                  <NuxtLink
                    class="d-flex align-center justify-center"
                    :to="{ name: 'login' }"
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
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
