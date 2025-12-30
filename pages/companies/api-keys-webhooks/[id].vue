<script setup>
import { onMounted, ref, computed } from "vue"
import { useRoute } from "vue-router"
import { useCompanies } from "@/composables/useCompanies"
const permissionStore = usePermissionStore()

definePageMeta({
  middleware: "auth",
  permission: "company_security.secrets.view",
})

const {
  loading,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  confirmAction,
} = useUiFeedback();

const route = useRoute()
const { fetchApiKeySecrets, apiSecrets, updateWebhookUrl, resetSecretKeys } = useCompanies()

const showApiKey = ref(false)
const showApiSecret = ref(false)
const showWebhookSecret = ref(false)
const webhook_url = ref();
onMounted(async () => {
  await fetchApiKeySecrets(route.params.id)
  webhook_url.value = apiSecrets?.value?.webhook_url;
})

const secrets = computed(() => apiSecrets.value || {})

const mask = (value) => {
  if (!value) return "---"
  return value.slice(0, 8) + "****************"
}

const copyText = async (text) => {
  await navigator.clipboard.writeText(text)
  showSuccess('Copied To Clipboard')
}
const submitForm = () => {
  if (!webhook_url.value) {
    showError('Webhook Url field is empty it is required.')
    return;
  }
  updateWebhookUrl(route.params.id, webhook_url.value);
}
</script>

<template>
  <v-card class="mb-4">
    <v-card-title class="border-b-sm d-flex align-center bg-primary mb-4">
      <BackNavigation color="text-white" />
      <h4 class="text-h5 py-3 text-white">API Keys & Webhooks</h4>
    </v-card-title>
    <v-card-text class="px-0 pt-0 mb-2">
      <v-row class="border-b-md px-5">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Company Id</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ apiSecrets?.id || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Company Name</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ apiSecrets?.company_name || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Company Code</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ apiSecrets?.company_code || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Status</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            <VChip :color="apiSecrets?.user?.status == 1 ? 'success' : 'error'" class="font-weight-medium" size="small"
              variant="elevated">
              {{ apiSecrets?.user?.status == 1 ? "Active" : "Inactive" }}
            </VChip>
          </p>
        </v-col>
      </v-row>
      <v-row class="border-b-md px-5">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">First Name</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ apiSecrets?.user?.first_name || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Last Name</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ apiSecrets?.user?.last_name || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Email</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ apiSecrets?.user?.email || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Created At</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ formatDate(apiSecrets?.created_at) }}</p>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text class="">
      <v-card class="mb-6" variant="outlined">
        <v-card-title class="d-flex justify-space-between bg-secondary">
          <span class="font-weight-semibold">API KEYS</span>
          <VBtn size="small" variant="elevated" color="primary" @click="resetSecretKeys(route.params.id)"
            v-if="permissionStore.hasPermission('company_security.rotate')">
            Reset Keys
          </VBtn>
        </v-card-title>
        <v-divider />

        <div class="pa-4">
          <p class="text-caption text-black">API Key</p>
          <AppTextField :model-value="showApiKey ? secrets.api_key : mask(secrets.api_key)" readonly variant="solo">
            <template #append-inner>
              <VBtn size="small" variant="text" @click="showApiKey = !showApiKey">
                {{ showApiKey ? "Hide" : "View" }}
              </VBtn>

              <VBtn size="small" variant="text" @click="copyText(secrets.api_key)">
                Copy
              </VBtn>
            </template>
          </AppTextField>

        </div>

        <div class="pa-4 pt-0">
          <p class="text-caption text-black">API Secret</p>
          <AppTextField :model-value="showApiSecret ? secrets.api_secret : mask(secrets.api_secret)" readonly
            variant="solo">
            <template #append-inner>
              <VBtn size="small" variant="text" @click="showApiSecret = !showApiSecret">
                {{ showApiSecret ? "Hide" : "View" }}
              </VBtn>

              <VBtn size="small" variant="text" @click="copyText(secrets.api_secret)">
                Copy
              </VBtn>
            </template>
          </AppTextField>
        </div>
      </v-card>

      <v-card variant="outlined">
        <v-card-title class="d-flex justify-space-between  bg-secondary">
          <span class="font-weight-semibold">WEBHOOKS</span>
        </v-card-title>

        <v-divider />

        <div class="pa-4">
          <p class="text-caption text-black">Webhook Secret</p>
          <AppTextField :model-value="showWebhookSecret
            ? secrets.webhook_secret
            : mask(secrets.webhook_secret)
            " readonly variant="solo">
            <template #append-inner>
              <VBtn size="small" variant="text" @click="showWebhookSecret = !showWebhookSecret">
                {{ showWebhookSecret ? "Hide" : "View" }}
              </VBtn>

              <VBtn size="small" variant="text" @click="copyText(secrets.webhook_secret)">
                Copy
              </VBtn>
            </template>
          </AppTextField>
        </div>
        <div class="pa-4">
          <p class="text-caption text-black">Webhook URL</p>
          <AppTextField v-model="webhook_url" variant="solo"
            :readonly="!permissionStore.hasPermission('company_security.webhook.update')">
            <template #append-inner v-if="permissionStore.hasPermission('company_security.webhook.update')">
              <VBtn size="small" class="login-btn" variant="tonal" @click="submitForm">
                Update
              </VBtn>
            </template>
          </AppTextField>
        </div>
      </v-card>
    </v-card-text>
  </v-card>
</template>
