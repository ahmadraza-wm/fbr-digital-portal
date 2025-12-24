<script setup>
import { useConfigStore } from "@core/stores/config";
import { AppContentLayoutNav } from "@layouts/enums";
import { switchToVerticalNavOnLtOverlayNavBreakpoint } from "@layouts/utils";
import { usePermissionStore } from "@/stores/userPermission";
import useUiFeedback from "@/composables/useUiFeedback";
const {
  loadingMessage,
  successMessage,
  errorMessages,
  confirmDialog,
  confirmAction,
  closeConfirm,
} = useUiFeedback();

const DefaultLayoutWithHorizontalNav = defineAsyncComponent(() =>
  import("./components/DefaultLayoutWithHorizontalNav.vue")
);
const DefaultLayoutWithVerticalNav = defineAsyncComponent(() =>
  import("./components/DefaultLayoutWithVerticalNav.vue")
);
const configStore = useConfigStore();

// ℹ️ This will switch to vertical nav when define breakpoint is reached when in horizontal nav layout

// Remove below composable usage if you are not using horizontal nav layout in your app
switchToVerticalNavOnLtOverlayNavBreakpoint();

const { layoutAttrs, injectSkinClasses } = useSkins();

injectSkinClasses();
const permissionStore = usePermissionStore();
onBeforeMount(async () => {
  if (!permissionStore.isLoaded) {
    await permissionStore.fetchUserPermissions();
  }
});
</script>

<template>
  <Component
    v-bind="layoutAttrs"
    :is="
      configStore.appContentLayoutNav === AppContentLayoutNav.Vertical
        ? DefaultLayoutWithVerticalNav
        : DefaultLayoutWithHorizontalNav
    "
  >
    <slot />
  </Component>
  <VSnackbar v-model="loadingMessage" color="info" location="top right">
    {{ loadingMessage }}
  </VSnackbar>

  <VSnackbar v-model="successMessage" color="success" location="top right">
    {{ successMessage }}
  </VSnackbar>

  <VSnackbar
    v-for="(msg, index) in errorMessages"
    :key="index"
    v-model="errorMessages[index]"
    color="error"
    location="top right"
    :timeout="3000"
    :style="{ top: `${index * 60 + 60}px` }"
  >
    {{ msg }}
  </VSnackbar>

  <VDialog v-model="confirmDialog.show" persistent width="400">
    <VCard>
      <VCardTitle class="text-h6"> Confirmation </VCardTitle>
      <VCardText>
        {{ confirmDialog.message }}
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn text @click="closeConfirm">Cancel</VBtn>
        <VBtn
          color="error"
          @click="
            () => {
              confirmDialog.onConfirm?.();
              closeConfirm();
            }
          "
          >Yes, Delete</VBtn
        >
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
@use "@layouts/styles/default-layout";
</style>
