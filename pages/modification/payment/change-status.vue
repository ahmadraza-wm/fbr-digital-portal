<script setup>
import { usePaymentStatus } from '@/composables/usePaymentStatus'
import FilterForm from '@/components/modification/filter-form.vue'
import PaymentDetail from '@/components/modification/payment-detail.vue'
import useUiFeedback from '@/composables/useUiFeedback'
import { usePartners } from "@/composables/usePartners";
definePageMeta({
  middleware: "auth",
  permission: "modification.change.payment.status"
})
const { fetchPartners, partners } = usePartners();
const { showLoading, hideLoading, showError, showSuccess } = useUiFeedback()
const {
  code,
  invoice,
  status,
  transactionData,
  showData,
  search,
  reset,
  updateStatus,
  releasePayment,
  resolveStatusVariant,
} = usePaymentStatus()

const isChecked = ref(false)
const partner = ref(null)
const dc_rate = ref(null)
const sc_rate = ref(null)
const amount = ref(null)
const statusItems = ref([
  { title: "Incomplete", value: "incomplete" },
  { title: "Awaiting Funds", value: "awaiting_funds" },
  { title: "Verifying Transfer", value: "verifying_transfer" },
  // { title: "Compliance Review", value: "compliance_review" },
  { title: "Compliance Held", value: "compliance_held" },
  // { title: "Operation Hold", value: "operation_hold" },
  { title: "Processing Transfer", value: "processing_transfer" },
  { title: "Available for Collection", value: "available_for_collection" },
  { title: "Send to Partner", value: "send_to_partner" },
  { title: "Paid", value: "paid" },
  { title: "Canceled", value: "canceled" },
  { title: "Canceling", value: "canceling" },
  { title: "Refunded", value: "refunded" },
]);
const transactionId = computed(() => transactionData.value[0]?.transaction_id || null);

const reason = ref('')
const onSubmit = async () => {
  if (!transactionId.value) {
    showError("Transaction ID is missing")
    return
  }
  const data = {
    transaction_id: transactionId.value,
    status: status.value,
    remarks: reason.value,
  }
  if (isChecked.value) {
    data.isChecked = true
    data.partner_id = partner.value
    data.dc_rate = dc_rate.value
    data.sc_rate = sc_rate.value
    data.amount = amount.value

  }

  const res = await updateStatus(data)
  if (res) {
    transactionData.value[0].status = status.value;

    showSuccess("Status updated successfully")
  }
}

onMounted(() => {
  fetchPartners({}, false);
});
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Change Payment Status</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <FilterForm :status="changeStatus" @search="filters => search(filters, '/change/payment/status')"
        @reset="reset" />
    </v-card-text>
    <v-card-text class="px-3" v-if="showData">
      <PaymentDetail :data="transactionData" :status="status" :resolveStatusVariant="resolveStatusVariant" />
      <VForm ref="formRef" @submit.prevent="">
        <v-row class="px-5 pt-3">
          <v-col cols="12 pb-1">
            <span class="fs-15 label-color font-weight-medium">Select Status<span class="text-red">*</span></span>
            <AppAutocomplete :items="statusItems" v-model="status" placeholder="Select status"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12 pb-1">
            <span class="fs-15 label-color font-weight-medium">Reason<span class="text-red">*</span></span>
            <AppTextarea rows="5" name="reason" v-model="reason" class="cursor-pointer" placeholder="Type here"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12 d-flex align-center" v-if="status">
            <VCheckbox v-model="isChecked" />
            <span class="fs-15 label-color font-weight-medium">Would you like to update the ledger?</span>
          </v-col>
        </v-row>

        <v-row v-if="isChecked" class="px-5">
          <v-col cols="12 pb-1" md="6">
            <span class="fs-15 label-color font-weight-medium">Select Partner<span class="text-red">*</span></span>
            <AppAutocomplete :items="partners" item-title="name" item-value="id" v-model="partner"
              placeholder="Select partner" :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">DC Rate<span class="text-red">*</span></span>
            <AppTextField name="dc_rate" type="number" v-model="dc_rate" placeholder="DC rate"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">SC Rate<span class="text-red">*</span></span>
            <AppTextField name="sc_rate" type="number" v-model="sc_rate" placeholder="SC rate"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Amount<span class="text-red">*</span></span>
            <AppTextField name="amount" type="number" v-model="amount" placeholder="Amount"
              :rules="[requiredValidator]" />
          </v-col>
        </v-row>
        <v-row class="px-5">
          <v-col cols="12" class="d-flex justify-end gap-4">
            <VBtn type="reset" color="secondary" variant="tonal" @click="resetForm"> Reset </VBtn>
            <VBtn type="submit" variant="tonal" class="login-btn" @click="onSubmit">
              Change Status
            </VBtn>
          </v-col>
        </v-row>
      </VForm>
    </v-card-text>
  </v-card>
</template>
