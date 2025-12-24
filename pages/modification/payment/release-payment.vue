<script setup>
import { usePaymentStatus } from "@/composables/usePaymentStatus";
import FilterForm from "@/components/modification/filter-form.vue";
import PaymentDetail from "@/components/modification/payment-detail.vue";
import useUiFeedback from "@/composables/useUiFeedback";
definePageMeta({
  middleware: "auth",
  permission: "release.partner.payments"
})
const { showLoading, hideLoading, showError, showSuccess } = useUiFeedback();
const {
  code,
  invoice,
  status,
  transactionData,
  showData,
  search,
  reset,
  releasePayment,
  resolveStatusVariant,
} = usePaymentStatus();
const remarks = ref("");

const isChecked = ref(false);
const alert = ref(false)
const requiredValidator = (v) => !!v || "This field is required";

const validateAndOpen = () => {
  if (!remarks.value) {
    showError("Reason is required");

    return;
  }
  alert.value = true;
};
const transactionId = computed(() => transactionData.value[0]?.transaction_id || null);

// Later in your submit:
const onSubmit = async () => {
  const data = {
    transaction_id: transactionId.value,
    remarks: remarks.value,
  }

  try {
    await releasePayment(data)
    alert.value = false
  } catch (error) {
    console.error("Replace pin error:", error?.response?.data || error.message || error)
  }

};
</script>

<template>
  <v-card class="mt-5">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm bg-grey">
          <h4 class="text-h4 pt-2 pb-1">Release Partner Payments</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text>
      <FilterForm :status="changeStatus" @search="(filters) => search(filters, '/release/partner/payments')"
        @reset="reset" />
    </v-card-text>

    <v-card-text class="px-3" v-if="showData">
      <PaymentDetail :data="transactionData" :resolveStatusVariant="resolveStatusVariant" />
      <VForm @submit.prevent="">
        <VRow class="mt-6 mb-3">
          <VCol cols="12" md="12">
            <span class="fs-14 label-color font-weight-regular">Reason<span class="text-red">*</span></span>
            <AppTextarea rows="2" :error="reasonError" :error-messages="reasonError ? ['This field is required'] : []"
              :rules="[requiredValidator]" name="remarks" v-model="remarks" />
          </VCol>

          <VCol cols="12" class="d-flex justify-end">
            <div class="d-flex gap-3">
              <VBtn color="seconadry" variant="tonal" type="reset">Reset</VBtn>
              <VBtn class="login-btn" variant="tonal" @click="validateAndOpen">Release Payment</VBtn>
            </div>
          </VCol>
        </VRow>
      </VForm>
    </v-card-text>
  </v-card>
  <div class="text-center pa-4">
    <!-- Dialog -->
    <v-dialog v-model="alert" max-width="600" transition="scale-transition">
      <v-card>
        <VCardTitle class="bg-grey d-flex align-center justify-space-between">
          <h4 class="text-h4 py-2">Attention</h4>
          <IconBtn @click="alert = false">
            <VIcon icon="tabler-x" />
          </IconBtn>
        </VCardTitle>
        <v-card-text class="border-b-sm">
          <p class="mb-0 fs-20 font-weight-bold text-red text-center px-4">
            Are you sure you want to release this payment from partner?
          </p>
        </v-card-text>
        <v-card-text class="text-end">
          <VBtn variant="elevated" color="white" type="submit" @click="onSubmit" class="login-btn mt-3">Release</VBtn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
