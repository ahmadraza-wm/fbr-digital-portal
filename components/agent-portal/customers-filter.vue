<script setup>
import { ref, computed } from "vue";

const emit = defineEmits(["filter", "reset"]);

const filters = ref({
  customer_id: "",
  customer_name: "",
  customer_phone: "",
  customer_dob: "",
  postal_code: "",
  id_number: "",
});

// remove empty fields automatically
const activeFilters = computed(() => {
  return Object.fromEntries(
    Object.entries(filters.value).filter(([_, v]) => v !== "" && v !== null)
  );
});

const onSubmit = () => {
  emit("filter", activeFilters.value);
};

const onReset = () => {
  Object.keys(filters.value).forEach(key => {
    filters.value[key] = "";
  });
  emit("reset");
};
</script>


<template>
  <VForm @submit.prevent="onSubmit" @reset.prevent="onReset">
    <v-row class="ps-0">

      <v-col cols="12" sm="6" md="3">
        <span class="fs-15 label-color font-weight-medium">Customer ID</span>
        <AppTextField type="number" v-model="filters.customer_id" placeholder="Customer ID" />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <span class="fs-15 label-color font-weight-medium">Customer Name</span>
        <AppTextField v-model="filters.customer_name" placeholder="Customer Name" />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <span class="fs-15 label-color font-weight-medium">Customer Phone</span>
        <AppTextField v-model="filters.customer_phone" placeholder="Customer Phone" />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <span class="fs-15 label-color font-weight-medium">Customer DOB</span>
        <AppDateTimePicker v-model="filters.customer_dob" placeholder="Customer DOB" />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <span class="fs-15 label-color font-weight-medium">ID Number</span>
        <AppTextField v-model="filters.id_number" placeholder="ID Number" />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <span class="fs-15 label-color font-weight-medium">Postal Code</span>
        <AppTextField v-model="filters.postal_code" placeholder="Postal code" />
      </v-col>

      <v-col cols="12 d-flex gap-2 justify-end align-end" md="6">
        <VBtn type="submit" variant="tonal" class="login-btn">
          Search
        </VBtn>
        <VBtn type="reset" color="secondary" variant="tonal">
          Reset
        </VBtn>
      </v-col>
    </v-row>
  </VForm>
</template>
