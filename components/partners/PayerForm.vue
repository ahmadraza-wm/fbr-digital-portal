<script setup>
import AppTextField from "@/@core/components/app-form-elements/AppTextField.vue";
import { usePayer } from "@/composables/usePayer";
import { useCountryCurrencyStore } from "@/stores/useCountryCurrencyStore";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import useUiFeedback from "@/composables/useUiFeedback";

const { loading, showLoading, hideLoading, showSuccess, showError } = useUiFeedback();

// Country and Currency Store
const countryCurrencyStore = useCountryCurrencyStore();
const { countries, currencies, sending_countries } = storeToRefs(countryCurrencyStore);

// Router & Route
const router = useRouter();
const route = useRoute();

// Use Payer Composable
const {
  payerData,
  submitForm,
  successMessage,
  errorMessage,
  statuses,
  partners,
  sending_methods_tags,
  sending_country_tags,
  isEditing,
  transfer_prefix,
} = usePayer();

const {
  gatewayData,
  saveGateway,
  gatewayRequirements,
} = useGateway();

const requiredValidator = (v) => !!v || "This field is required";
const formRef = ref(null);

onMounted(() => {
  // If editing, the composable will automatically load the payer details
});
</script>

<template>
  <VForm ref="formRef" @submit.prevent="submitForm">
    <VRow>
      <!-- Name -->
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Name<span class="text-red">*</span></span>
        <AppTextField v-model="payerData.name" placeholder="Enter Name" :rules="[requiredValidator]" />
      </VCol>

      <!-- Currency -->
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Currency<span class="text-red">*</span></span>
        <v-autocomplete v-model="payerData.currency_id" :items="currencies" :item-title="(item) => {
          const n = item?.code ?? '';
          const m = item?.name ?? '';
          return n && m ? `${n} - ${m}` : n || m;
        }" item-value="id" :rules="[requiredValidator]">
          <template #item="{ item, props, selected }">
            <div v-bind="props" class="px-3 py-1 mb-2" :class="selected ? 'bg-primary text-white' : 'text-body'"
              style="border-radius: 4px;">
              {{ item?.code || item?.raw?.code }} - <b class="bg-primary px-1 py-1 rounded">{{ item?.name ||
                item?.raw?.name }}</b>
            </div>
          </template>

          <template #selection="{ item }">
            <span v-if="item">
              {{ item?.code || item?.raw?.code }} - <b class="text-primary">{{ item?.name || item?.raw?.name }}</b>
            </span>
            <span v-else>Select base currency</span>
          </template>
        </v-autocomplete>
      </VCol>

      <!-- Country -->
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Country<span class="text-red">*</span></span>
        <v-autocomplete v-model="payerData.country_id" :items="countries" item-title="name" item-value="id"
          :rules="[requiredValidator]" />
      </VCol>

      <!-- Method -->
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Method<span class="text-red">*</span></span>
        <v-autocomplete v-model="payerData.method" :items="partners" item-title="title" item-value="value"
          :rules="[requiredValidator]" />
      </VCol>

      <!-- Status -->
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Status</span>
        <v-autocomplete v-model="payerData.status" :items="statuses" item-title="text" item-value="value" />
      </VCol>

      <!-- Min Limit -->
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Min Limit<span class="text-red">*</span></span>
        <VTextField v-model="payerData.min_limit" type="number" placeholder="Minimum Limit" :rules="[requiredValidator]"
          min="0" step="0.01" />
      </VCol>

      <!-- Max Limit -->
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Max Limit<span class="text-red">*</span></span>
        <VTextField v-model="payerData.max_limit" type="number" placeholder="Maximum Limit" :rules="[requiredValidator]"
          min="0" step="0.01" />
      </VCol>

      <!-- Sending Method Tags -->
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Sending Method Tags</span>
        <v-autocomplete v-model="payerData.sending_method_tags" :items="gatewayRequirements.sending_methods || []"
          item-title="text" item-value="value" placeholder="Select Method" chips multiple closable-chips />
      </VCol>

      <!-- Sending Country Tags -->
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Sending Country Tags</span>
        <v-autocomplete v-model="payerData.sending_country_tags" :items="gatewayRequirements.sending_countries || []"
          item-title="text" item-value="value" placeholder="Select Country" chips multiple closable-chips />
      </VCol>

      <!-- Transfer Prefix -->
      <VCol cols="12" md="6">
        <AppTextField v-model="payerData.transfer_prefix" label="Transfer Prefix" placeholder="RPL" />
      </VCol>
      <!-- Transfer Pinlength -->
      <VCol cols="12" md="6">
        <AppTextField v-model="payerData.transfer_pin_length" label="Transfer Pin Length" type="number" placeholder="Transfer Pin Length
" />
      </VCol>

      <!-- Submit Buttons -->
      <VCol cols="12" class="d-flex justify-end gap-4">
        <VBtn type="reset" color="secondary" variant="tonal">Reset</VBtn>
        <VBtn type="submit" :loading="loading" variant="tonal" color="white" class="login-btn">
          {{ isEditing ? "Update Payer" : "Create Payer" }}
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
