<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGenerateImageVariant } from "@core/composable/useGenerateImageVariant";
import CardLogo1 from "@images/logos/1.png";
import CardLogo2 from "@images/logos/2.png";
import CardLogo3 from "@images/logos/3.png";
import CardLogo4 from "@images/logos/4.png";
import CardLogo5 from "@images/logos/5.png";
import CardLogo6 from "@images/logos/6.png";
import CardLogo7 from "@images/logos/7.png";
import CardLogo8 from "@images/logos/8.png";
import CardLogo9 from "@images/logos/9.png";
import BgImage1 from "@images/logos/bg-1.png";
import BgImage2 from "@images/logos/bg-2.png";
import Companylogo from "@images/logos/payout-hub-logo.png";
import authV2LoginIllustrationBorderedDark from "@images/pages/auth-v2-login-illustration-bordered-dark.png";
import authV2LoginIllustrationBorderedLight from "@images/pages/auth-v2-login-illustration-bordered-light.png";
import authV2LoginIllustrationDark from "@images/pages/auth-v2-login-illustration-dark.png";
import authV2LoginIllustrationLight from "@images/pages/auth-v2-login-illustration-light.png";
import authV2MaskDark from "@images/pages/misc-mask-dark.png";
import authV2MaskLight from "@images/pages/misc-mask-light.png";
import { themeConfig } from "@themeConfig";
import { VForm } from "vuetify/components/VForm";
import AuthProvider from "@/views/pages/authentication/AuthProvider.vue";
import authV1BottomShape from "@images/svg/auth-v1-bottom-shape.svg?raw";
import authV1TopShape from "@images/svg/auth-v1-top-shape.svg?raw";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const isPasswordVisible = ref(false);
const refVForm = ref();
const errors = ref({ email: "", password: "" });
const credentials = ref({
  email: "",
  password: "",
});
const rememberMe = ref(false);
const authThemeImg = useGenerateImageVariant(
  authV2LoginIllustrationLight,
  authV2LoginIllustrationDark,
  authV2LoginIllustrationBorderedLight,
  authV2LoginIllustrationBorderedDark,
  true
);
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark);
const errorMessage = ref(null);
const loading = ref(false);

definePageMeta({
  layout: "blank",
  unauthenticatedOnly: true,
});

const login = async () => {
  loading.value = true;
  errorMessage.value = null;
  const success = await authStore.login(
    credentials.value.email,
    credentials.value.password,
    rememberMe.value
  );

  if (success) {
    navigateTo("/");
  } else {
    errorMessage.value = authStore.errorMessage;
  }
  loading.value = false;
};

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) login();
  });
};
</script>

<template>
  <VSnackbar v-model="errorMessage" color="error">
    {{ errorMessage }}
  </VSnackbar>
  <VRow no-gutters class="auth-wrapper bg-surface d-flex justify-center">
    <VCol
      cols="12"
      md="6"
      lg="4"
      class="auth-card-v2 d-flex align-center justify-center position-relative pa-4"
    >
      <div class="position-relative my-sm-16">
        <VNodeRenderer
          :nodes="h('div', { innerHTML: authV1TopShape })"
          class="text-primary auth-v1-top-shape d-none d-sm-block"
        />
        <VNodeRenderer
          :nodes="h('div', { innerHTML: authV1BottomShape })"
          class="text-primary auth-v1-bottom-shape d-none d-sm-block"
        />
        <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4" elevation="16">
          <VCardText class="text-center py-5">
            <img :src="Companylogo" alt="Logo Image" class="ma-auto" height="75" />
          </VCardText>
          <VCardText class="py-1">
            <h4 class="text-h4 mb-1">
              Welcome to
              <span class="text-capitalize"> {{ themeConfig.app.title }} </span
              >! 👋🏻
            </h4>
          </VCardText>
          <VCardText>
            <VForm ref="refVForm" @submit.prevent="onSubmit">
              <VRow>
                <VCol cols="12">
                  <AppTextField
                    v-model="credentials.email"
                    label="Email or Username"
                    placeholder="johndoe@email.com"
                    type="email"
                    autofocus
                    :error-messages="errors.email"
                  />
                </VCol>
                <VCol cols="12">
                  <AppTextField
                    v-model="credentials.password"
                    label="Password"
                    placeholder="············"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    :error-messages="errors.password"
                    :append-inner-icon="
                      isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                    "
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  />
                  <div
                    class="d-flex align-center flex-wrap justify-end my-6"
                  >
                    <!-- <VCheckbox v-model="rememberMe" label="Remember me" /> -->
                    <NuxtLink
                      class="text-primary ms-2 mb-1"
                      :to="{ name: 'forgot-password' }"
                    >
                      Forgot Password?
                    </NuxtLink>
                  </div>
                  <VBtn
                    class="login-btn"
                    variant="outlined"
                    block
                    type="submit"
                     :loading="loading"
                  >
                    Login
                  </VBtn>
                </VCol>
              </VRow>
              <!----Card Logos Row-->
              <VRow>
                <VCol cols="2" class="py-1">
                  <img :src="CardLogo1" class="card-logo" />
                </VCol>
                <VCol cols="2" class="py-1">
                  <img :src="CardLogo2" class="card-logo" />
                </VCol>
                <VCol cols="2" class="py-1">
                  <img :src="CardLogo3" class="card-logo" />
                </VCol>
                <VCol cols="2" class="py-1">
                  <img :src="CardLogo4" class="card-logo" />
                </VCol>
                <VCol cols="2" class="py-1">
                  <img :src="CardLogo5" class="card-logo" />
                </VCol>
                <VCol cols="2" class="py-1">
                  <img :src="CardLogo6" class="card-logo" />
                </VCol>
                <VCol cols="2" class="py-1">
                  <img :src="CardLogo7" class="card-logo" />
                </VCol>
                <VCol cols="2" class="py-1">
                  <img :src="CardLogo8" class="card-logo" />
                </VCol>
                <VCol cols="2" class="py-1">
                  <img :src="CardLogo9" class="card-logo" />
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
