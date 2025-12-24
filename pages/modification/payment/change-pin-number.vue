<script setup>
import { usePinNumber } from '@/composables/usePinNumber';
import { usePaymentStatus } from '@/composables/usePaymentStatus'

import FilterForm from '@/components/modification/filter-form.vue'
import PaymentDetail from '@/components/modification/payment-detail.vue'
import { ref, computed } from 'vue'
definePageMeta({
  middleware: "auth",
  permission: "change.pin"
})
const { showLoading, hideLoading, showError, showSuccess } = useUiFeedback();

const {

  transactionData,
  showData,
  search,
  reset,

  resolveStatusVariant,
} = usePaymentStatus()
const {
  changePinStatus,
} = usePinNumber()

const alphabet = ref(
  Array.from({ length: 26 }, (_, i) => {
    const letter = String.fromCharCode(65 + i)
    return { title: letter, value: letter }
  })
);
const requiredValidator = (v) => !!v || "This field is required";
const changeAlert = ref(false);
const transactionId = computed(() => transactionData.value[0]?.transaction_id || null);
const transferCode = computed(
  () => transactionData.value[0]?.transaction_code || null
);
const remarks = ref('');
const selectedAlphabet = ref('');
const validateAndOpen = () => {
  const errors = []

  if (!selectedAlphabet.value) {
    errors.push("Please Select an Alphabet.")
  }

  if (!remarks.value) {
    errors.push("Reason is required")
  }

  if (errors.length) {
    showError(errors.join('\n'))
    return
  }

  changeAlert.value = true
}

const onSubmit = async () => {
  const data = {
    transaction_id: transactionId.value,
    alphabet: selectedAlphabet.value,
    remarks: remarks.value,
  }

  const success = await changePinStatus(data);
  if (success) {
    changeAlert.value = false
  }
}



</script>

<template>
  <v-card class="mt-5">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm bg-grey">
          <h4 class="text-h4 pt-2 pb-1">Change Pin Number
          </h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text>
      <FilterForm @search="filters => search(filters, '/change/pins')" @reset="reset" />
    </v-card-text>

    <v-card-text class="px-3" v-if="showData">
      <PaymentDetail :data="transactionData" :resolveStatusVariant="resolveStatusVariant" />

      <VForm @submit.prevent="" class="mt-4">
        <VRow>
          <VCol cols="12" md="12">
            <span class="fs-14 label-color font-weight-regular">Select Alphabet<span class="text-red">*</span></span>
            <AppAutocomplete v-model="selectedAlphabet" :items="alphabet" :rules="[requiredValidator]" name="pin"
              placeholder="Select Alphabate" />
          </VCol>
          <VCol cols="12" md="12">
            <span class="fs-14 label-color font-weight-regular">Reason<span class="text-red">*</span></span>
            <AppTextarea rows="2" v-model="remarks" :rules="[requiredValidator]" name="reason"
              placeholder="Type Here..." />
          </VCol>

          <VCol cols="12" class="d-flex justify-end">
            <div class="d-flex gap-3">
              <VBtn color="secondary" variant="tonal" type="reset">Reset</VBtn>
              <VBtn class="login-btn" variant="tonal" type="submit" @click="validateAndOpen">Change Pin</VBtn>
            </div>
          </VCol>
        </VRow>

      </VForm>
    </v-card-text>

  </v-card>
  <div class="text-center pa-4">
    <!-- Dialog -->
    <v-dialog v-model="changeAlert" max-width="600" transition="scale-transition">
      <v-card>
        <VCardTitle class="bg-grey d-flex align-center justify-space-between">
          <h4 class="text-h4 py-2">Attention</h4>
          <IconBtn @click="changeAlert = false">
            <VIcon icon="tabler-x" />
          </IconBtn>
        </VCardTitle>
        <v-card-text class="border-b-sm">
          <p class="mb-0 fs-18 text-color font-weight-normal text-center px-4">
            Are you sure you want to replace Pin Number from <span class="fs-16 font-weight-bold text-info">{{
              transferCode }}</span> to <span class="fs-16 font-weight-bold text-info">
              {{ /[a-zA-Z]$/.test(transferCode) ? transferCode.slice(0, -1) + selectedAlphabet : transferCode +
                selectedAlphabet }}

            </span>
          </p>
        </v-card-text>
        <v-card-text class="text-end d-flex align-center justify-end gap-3">
          <VBtn variant="elevated" color="secondary" class="mt-3" @click="changeAlert = false">No</VBtn>
          <VBtn variant="elevated" color="white" type="submit" @click="onSubmit" class="login-btn mt-3">Yes Update
          </VBtn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
