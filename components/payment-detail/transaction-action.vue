<script setup>
import { ref, computed } from "vue";
import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";

const props = defineProps({
  transaction: {
    type: Object,
    required: true,
  },
});

const { $axios } = useNuxtApp();

const reasonForSystem = ref("");
const reasonForCustomer = ref("");
const sendToCustomer = ref(false);
const holdAction = ref(null);
const holdPayment = ref(null);

const { showSuccess, showError } = useUiFeedback();

const submitForm = async () => {
  let responseSuccessful = false;

  const isValid = await holdPayment.value?.validate();
  if (!isValid) {
    showError("Please complete the form.");
    return;
  }

  const formData = new FormData();
  formData.append("transaction_id", props.transaction.id);
  formData.append("reason_for_system", reasonForSystem.value);
  formData.append("reason_for_customer", reasonForCustomer.value);
  formData.append(
    "send_to_customer",
    holdAction.value === "hold_and_email" ? "1" : "0"
  );

  try {
    await $axios.post("/compliance/held", formData);
    responseSuccessful = true;
  } catch (error) {
  let messages = "Something went wrong";

  const res = error.response?.data;

  if (res?.errors) {
    messages = Object.values(res.errors).flat();
  } else if (typeof res?.message === "string" && res.message) {
    messages = res.message;
  } else if (typeof res?.data === "string") {
    messages = res.data;
  }

  showError(messages);
}

  if (responseSuccessful) {
    showSuccess("Payment Hold!");
    fetchTransactions({ status: ["verifying_transfer"] });

    hold.value = false;
    reason_for_system.value = "";
    reason_for_customer.value = "";
    holdPayment.value.resetValidation();
  }
};
</script>

<template>
  <VCard class="my-8 border">
    <v-card-title
      class="border-b-sm bg-grey d-flex align-center justify-space-between"
    >
      <h4 class="text-h5 py-3">Transaction Actions</h4>
    </v-card-title>

    <VCardText class="px-0 pb-0">
      <VForm ref="holdPayment" @submit.prevent="submitForm">
        <VCol cols="12" class="mt-4">
          <span class="text-red pb-2 fs-13"
            >Hold Payment Remarks (For System)</span
          >
          <AppTextarea
            rows="2"
            placeholder="Type here"
            v-model="reasonForSystem"
          />
        </VCol>

        <VCol cols="12">
          <span class="text-red pb-1 fs-13"
            >Hold Payment Remarks (For Customer)</span
          >
          <AppTextarea
            rows="2"
            placeholder="Type here"
            v-model="reasonForCustomer"
          />
          <p class="text-red pt-4 mb-0">
            <strong>NOTE:</strong> This description will be sent to the customer
            via email.
          </p>
          <VCheckbox label="Test Acc" />
        </VCol>

        <VCol col="12">
          <VBtn color="success" variant="tonal" class="me-4"
            >Verifying Payment</VBtn
          >

          <VBtn
            color="transparent"
            variant="elevated"
            class="me-3"
            type="submit"
            @click="holdAction = 'hold'"
            style="background-color: #fe5f574f; color: #fe5f57"
          >
            Hold Payment
          </VBtn>

          <VBtn
            color="white"
            variant="elevated"
            type="submit"
            class="me-3 login-btn"
            @click="holdAction = 'hold_and_email'"
          >
            Hold and Send Email to customer
          </VBtn>
        </VCol>
      </VForm>
    </VCardText>
  </VCard>
</template>
