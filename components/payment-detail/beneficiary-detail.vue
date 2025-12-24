<script setup>
import { computed } from "vue";

const props = defineProps({
  beneficiary: Object,
  transaction: Object,
});

// Computed properties to extract first and last names
const firstName = computed(() => {
  const name = props.beneficiary?.name || "";
  return name.split(" ")[0] || "---";
});

const lastName = computed(() => {
  const name = props.beneficiary?.name || "";
  const parts = name.split(" ");
  return parts.length > 1 ? parts.slice(1).join(" ") : "---";
});
</script>

<template>
  <VCol cols="12" class="d-flex" style="background-color: #e5e0e0ba">
    <p class="fs-16 font-weight-medium mb-0">Personal Details</p>
  </VCol>
  <VRow class="border-b-sm mt-1 mx-0">
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">Beneficiary ID</p>
     <NuxtLink
        v-if="beneficiary?.id"
         target="_blank"
        :to="`/beneficiaries/view-beneficiary/${beneficiary.id}`"
        class="text-warning mb-0 fs-15 font-weight-medium text-decoration-underline"
      >
        {{ beneficiary?.id || "---" }}
      </NuxtLink>
    </VCol>
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">First Name</p>
      <p class="text-color mb-0 fs-15 font-weight-medium">
        {{ transaction?.beneficiary_first_name || "---" }}
      </p>
    </VCol>
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">Last Name</p>
      <p class="text-color mb-0 fs-15 font-weight-medium">
         {{ transaction?.beneficiary_last_name || "---" }}
      </p>
    </VCol>

    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">Email</p>
      <p class="text-color mb-0 fs-15 font-weight-medium">
        {{ beneficiary?.email || "---" }}
      </p>
    </VCol>
  </VRow>
  <VRow class="border-b-sm mt-1 mx-0">
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">Phone</p>
      <p class="text-color mb-0 fs-15 font-weight-medium">
        {{ beneficiary?.phone_number || "---" }}
      </p>
    </VCol>
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">Gender</p>
      <p class="text-color mb-0 fs-15 font-weight-medium">
        {{ beneficiary?.gender || "---" }}
      </p>
    </VCol>
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">Relation</p>
      <p class="text-color mb-0 fs-15 font-weight-medium">
        {{ transaction?.beneficiary_relation || "---" }}
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
        {{ beneficiary?.house_no || "---" }}
      </p>
    </VCol>
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">Street Name</p>
      <p class="text-color mb-0 fs-15 font-weight-medium">
        {{ beneficiary?.street || "---" }}
      </p>
    </VCol>
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">Post Code</p>
      <p class="text-color mb-0 fs-15 font-weight-medium">
        {{ beneficiary?.postal_code || "---" }}
      </p>
    </VCol>
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">City</p>
      <p class="text-color mb-0 fs-15 font-weight-medium">
        {{ beneficiary?.city || "---" }}
      </p>
    </VCol>
  </VRow>
  <VRow class="mt-1 mx-0">
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">Country</p>
      <p class="text-color mb-0 fs-15 font-weight-medium">
        {{ beneficiary?.country || "---" }}
      </p>
    </VCol>
    <VCol cols="3" class="py-3">
      <p class="fs-16 font-weight-bold text-color mb-1">Occupation</p>
      <p class="text-color mb-0 fs-15 font-weight-medium">
        {{ beneficiary?.occupation || "---" }}
      </p>
    </VCol>
  </VRow>
</template>
