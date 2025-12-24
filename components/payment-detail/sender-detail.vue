<script setup>
import { onMounted } from "vue";

const props = defineProps({
  sender: Object,
  ledger: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <VCol cols="12" class="d-flex" style="background-color: #e5e0e0ba">
    <p class="fs-16 font-weight-medium mb-0">Personal Details</p>
  </VCol>
  <VRow class="border-b-sm mt-1 mx-0" style="color: #2f2b3de5;">
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">Customer ID</p>
      <NuxtLink
        v-if="sender?.id"
         target="_blank"
        :to="`/customers/view/${sender.id}`"
        class="text-warning mb-0 fs-15 font-weight-medium text-decoration-underline"
      >
        {{ sender?.id || "---" }}
      </NuxtLink>
    </VCol>
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">First Name</p>
      <p class="text-color mb-0 fs-15 font-weight-medium">
        {{ sender?.user.first_name || "---" }}
      </p>
    </VCol>
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">Last Name</p>
      <p class="text-color mb-0 fs-15 font-weight-medium">
        {{ sender?.user.last_name || "---" }}
      </p>
    </VCol>
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">Email</p>
      <p class="text-color mb-0 fs-15 font-weight-medium">
        {{ sender?.user.email || "---" }}
      </p>
    </VCol>
  </VRow>
  <VRow class="border-b-sm mt-1 mx-0">
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">Phone</p>
      <p class="text-color mb-0 fs-15 font-weight-medium">
        {{ sender?.phone_number || "---" }}
      </p>
    </VCol>
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">Gender</p>
      <p class="text-color mb-0 fs-15 font-weight-medium">
        {{ sender?.customer_detail.gender || "---" }}
      </p>
    </VCol>
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">Place of Birth</p>
      <p class="text-color mb-0 fs-15 font-weight-medium">
        {{ sender?.customer_detail.place_of_birth || "---" }}
      </p>
    </VCol>
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">Date of Birth</p>
      <p class="text-color mb-0 fs-15 font-weight-medium">
        {{ sender?.customer_detail.dob || "---" }}
      </p>
    </VCol>
  </VRow>
  <VCol cols="12" class="d-flex mt-3" style="background-color: #e5e0e0ba">
    <p class="fs-16 font-weight-medium mb-0">Other Details</p>
  </VCol>
  <VRow class="border-b-sm mt-1 mx-0">
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">House #</p>
      <p class="mb-0 fs-15 font-weight-medium">
        {{ sender?.customer_detail.address || "---" }}
      </p>
    </VCol>
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">Street Name</p>
      <p class="text-color mb-0 fs-15 font-weight-medium">
        {{ sender?.customer_detail.street_address || "---" }}
      </p>
    </VCol>
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">Post Code</p>
      <p class="text-color mb-0 fs-15 font-weight-medium">
        {{ sender?.customer_detail.postal_code || "---" }}
      </p>
    </VCol>
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">City</p>
      <p class="text-color mb-0 fs-15 font-weight-medium">
        {{ sender?.customer_detail.city || "---" }}
      </p>
    </VCol>
  </VRow>
  <VRow class="border-b-sm mt-1 mx-0">
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">Country</p>
      <p class="text-color mb-0 fs-15 font-weight-medium">
        {{ sender?.sending_country.name || "---" }}
      </p>
    </VCol>
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">Occupation</p>
      <p class="text-color mb-0 fs-15 font-weight-medium">
        {{ sender?.occupation || "---" }}
      </p>
    </VCol>
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">Main Agent</p>
      <p class="text-color mb-0 fs-15 font-weight-medium">
        {{ sender?.main_agent || "---" }}
      </p>
    </VCol>
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">Sub Agent</p>
      <p class="text-color mb-0 fs-15 font-weight-medium">-----</p>
    </VCol>
  </VRow>
  <VRow class="mt-1 mx-0">
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">Verified Customer</p>
      <p class="font-weight-medium mb-0 lh-22 text-color">
        <VChip
          :color="sender?.verified == 1 ? 'success' : 'error'"
          class="font-weight-medium"
          size="small"
        >
          {{ sender?.verified == 1 ? "Yes" : "No" }}
        </VChip>
      </p>
    </VCol>
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">Total Transfer</p>
      <p class="text-color mb-0 fs-15 font-weight-medium">
        {{ ledger[0]?.total_transactions || "---" }}
      </p>
    </VCol>
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">Risk Assessment</p>
      <p class="text-color mb-0 fs-15 font-weight-medium">---</p>
    </VCol>
  </VRow>
</template>
