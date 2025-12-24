<script setup>
import { usePaymentStatus } from "@/composables/usePaymentStatus";
import FilterForm from "@/components/modification/filter-form.vue";
import PaymentDetail from "@/components/modification/payment-detail.vue";
import useUiFeedback from "@/composables/useUiFeedback";
import { usePinNumber } from '@/composables/usePinNumber';
import { ref, computed } from "vue";
definePageMeta({
  middleware: "auth",
  permission: "replace.pin.number"
})
const { showLoading, hideLoading, showError, showSuccess } = useUiFeedback();
const { transactionData, showData, search, reset, resolveStatusVariant } =
  usePaymentStatus();
const {
  replacePinNumber,
} = usePinNumber()

const requiredValidator = (v) => !!v || "This field is required";
const alert = ref(false);
const transactionId = computed(
  () => transactionData.value[0]?.transaction_id || null
);
const transferCode = computed(
  () => transactionData.value[0]?.transaction_code || null
);
const remarks = ref("");
const updatePin = ref("");
const validateAndOpen = () => {
  if (!updatePin.value) {
    showError("Updated Pin is required");
    return;
  }

  if (!remarks.value) {
    showError("Reason is required");
    return;
  }

  alert.value = true;
};

const onSubmit = async () => {
  const data = {
    transaction_id: transactionId.value,
    transaction_code: updatePin.value,
    remarks: remarks.value,
  }

  try {
    await replacePinNumber(data)
    alert.value = false
  } catch (error) {
    console.error("Replace pin error:", error?.response?.data || error.message || error)
  }
}
</script>

<template>
  <v-card class="mt-5">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm bg-grey">
          <h4 class="text-h4 pt-2 pb-1">Replace Pin Number</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text>
      <FilterForm @search="(filters) => search(filters, '/replace/pins')" @reset="reset" />
    </v-card-text>

    <v-card-text class="px-3" v-if="showData">
      <PaymentDetail :data="transactionData" :resolveStatusVariant="resolveStatusVariant" />
      <VForm @submit.prevent="" class="mt-5">
        <VRow>
          <VCol cols="12" md="12">
            <span class="fs-14 label-color font-weight-regular">Updated Pin #<span class="text-red">*</span></span>
            <AppTextField :rules="[requiredValidator]" name="updatePin" v-model="updatePin" placeholder="Update Pin" />
          </VCol>
          <VCol cols="12" md="12">
            <span class="fs-14 label-color font-weight-regular">Reason<span class="text-red">*</span></span>
            <AppTextarea rows="2" :rules="[requiredValidator]" name="reason" v-model="remarks"
              placeholder="Type Here..." />
          </VCol>

          <VCol cols="12" class="d-flex justify-end">
            <div class="d-flex gap-3">
              <VBtn color="secondary" variant="tonal" type="reset">Reset</VBtn>
              <VBtn class="login-btn" variant="tonal" @click="validateAndOpen">
                Replace Pin Number</VBtn>
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
          <p class="mb-0 fs-18 text-color font-weight-normal text-center px-4">
            Are you sure you want to replace Pin Number from <span class="fs-16 font-weight-bold text-info">{{
              transferCode }}</span> to <span class="fs-16 font-weight-bold text-info">{{
                updatePin }}</span>
          </p>
        </v-card-text>
        <v-card-text class="text-end d-flex align-center justify-end gap-3">
          <VBtn variant="elevated" color="secondary" class="mt-3" @click="alert = false">No</VBtn>
          <VBtn variant="elevated" color="white" type="submit" @click="onSubmit" class="login-btn mt-3">Yes Update
          </VBtn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
