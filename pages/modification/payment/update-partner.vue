<script setup>
import { usePaymentStatus } from '@/composables/usePaymentStatus'
import FilterForm from '@/components/modification/filter-form.vue'
import PaymentDetail from '@/components/modification/payment-detail.vue'

const {
  code,
  invoice,
  status,
  transactionData,
  showData,
  search,
  reset,
  updateStatus,
  resolveStatusVariant,
} = usePaymentStatus()

const isChecked = ref(false)

// Later in your submit:
const onSubmit = async () => {
  const payload = {
    status: status.value,
    reason: reason.value,
    code: code.value,
    update_ledger: isChecked.value,
    // other optional fields
  }

  await updateStatus(payload)
}
</script>
<template>
  <v-card class="mt-5">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm bg-grey">
          <h4 class="text-h4 pt-2 pb-1">Update Partner Details</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text>
      <FilterForm  @search="filters => search(filters, '/release/partner/payments')"
        @reset="reset" />

    </v-card-text>
    <v-card-text class="px-3" v-if="showData">
      <PaymentDetail :data="transactionData" :resolveStatusVariant="resolveStatusVariant" />
    </v-card-text>
    <v-card-text class="mt-4">
      <VForm @submit.prevent="">
        <VRow>
          <VCol cols="12" md="6">
            <span class="fs-14 label-color font-weight-regular">Partner Code</span>
            <AppTextField type="number" name="code" placeholder="******" autocomplete="off"/>
          </VCol>
          <VCol cols="12" md="6">
            <span class="fs-14 label-color font-weight-regular">Partner Status</span>
            <AppTextField name="status" placeholder="******" autocomplete="off" />
          </VCol>
          <VCol cols="12" md="6">
            <span class="fs-14 label-color font-weight-regular">Partner Response</span>
            <AppTextField name="response" placeholder="******" />
          </VCol>
          <VCol cols="12" md="6">
            <span class="fs-14 label-color font-weight-regular">Partner</span>
            <AppTextField name="response" placeholder="******" />
          </VCol>
          <VCol cols="12" md="12">
            <span class="fs-14 label-color font-weight-regular">Reason<span class="text-red">*</span></span>
            <AppTextarea rows="2" :rules="[requiredValidator]" name="reason" />
          </VCol>
          <VCol cols="12">
            <VCheckbox
              label="I have confirmed this transaction (RPL77118) is created on partner portal but not updated on our portal.">
            </VCheckbox>
          </VCol>
          <VCol cols="12" class="d-flex justify-end">
            <div class="d-flex gap-3">
              <VBtn color="secondary" variant="tonal" type="reset">Reset</VBtn>
              <VBtn class="login-btn" variant="tonal" type="submit">Change Status</VBtn>
            </div>
          </VCol>
        </VRow>

      </VForm>
    </v-card-text>
  </v-card>
</template>
