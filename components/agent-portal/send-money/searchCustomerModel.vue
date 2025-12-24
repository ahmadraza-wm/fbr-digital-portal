<script setup>
definePageMeta({
  middleware: "auth",
  permission: "agent.customers.list"
})
const permissionStore = usePermissionStore()
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import { useCustomer } from "@/composables/agentPortal/useCustomers";
const occupationSelect = ref('');
const formRef = ref('');
const otherOcupation = ref('');
const {
  fetchCustomers, 
  customersList, 
  pagination,
  fetchCustomersFilters,
  form,
  fetchCustomerById,
  updateCustomer,
  fetchOccupationsList,
  occupationsOptions,
  genderOptions,
  CustomerType,
  selectCustomer
} = useCustomer();

const emit = defineEmits(['searchCustomer', 'selectCustomer'])

const headers = [
  { title: "#", key: "sr_no" },
  { title: "Customer ID", key: "id" },
  { title: "Customer Name", key: "name" },
  { title: "Customer Address", key: "address" },
  { title: "City", key: "city" },
  { title: "Action", key: "action" },
];
const activeFilters = ref({});
const search = ref("");
const isEdit = ref(false);
const fetchWithFilters = (params) => {
  return fetchCustomersFilters({ ...activeFilters.value, ...params });
}
const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  fetchWithFilters,
  {
    initialPage: 1,
    initialPerPage: 10,
  }
);
function handleFilter(payload) {
  activeFilters.value = payload;
  loadPage(1);
}

watch(
  () => form.value.dob,
  (newVal) => {
    if (!newVal) return
    // If dob is in dd-mm-yyyy, convert to yyyy-mm-dd
    const ddmmyyyy = /^\d{2}-\d{2}-\d{4}$/.test(newVal)
    if (ddmmyyyy) {
      const [dd, mm, yyyy] = newVal.split('-')
      form.value.dob = `${yyyy}-${mm}-${dd}`
    }
  }
)

watch(
  () => occupationSelect.value,
  (newVal) => {
    form.value.occupation = newVal;
  },
  { immediate: true }
);


const splitOccupation = () => {
  if (form.value.occupation.startsWith("Other (Specify)")) {
    const parts = form.value.occupation.split("-");
    occupationSelect.value = parts[0]; // "Other (Specify)"
    otherOcupation.value = parts[1] || ""; // whatever comes after -
  } else {
    occupationSelect.value = form.value.occupation;
    otherOcupation.value = "";
  }
}


const EditCustomer = async(id) => {
  await fetchOccupationsList();
  await fetchCustomerById(id)
  splitOccupation();
  isEdit.value = id;
}

const updateForm = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  if (form.value.occupation === 'Other (Specify)') {
    form.value.occupation = `${form.value.occupation}-${otherOcupation.value}`;
  }
  const res = await updateCustomer(isEdit.value, form.value);
    // 🔥 SIRF CUSTOMER ID
    emit('selectCustomer', isEdit.value);
    isEdit.value = false;   
}

function handleReset() {
  activeFilters.value = {};
  loadPage(1);
  isEdit.value = false;
}

</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-card-title class="d-flex align-center justify-space-between" style="background-color: lightgray;">
        <h4 class="text-h4 py-3">{{ !isEdit ? 'Search Customers':'Edit Customer' }}</h4>
        <IconBtn @click="emit('searchCustomer',false)">
          <VIcon icon="tabler-x" />
        </IconBtn>
      </v-card-title>
    </v-col>
  </v-row>
  <v-card-text class="border-b-sm" v-if="!isEdit">
    <CustomersFilter @filter="handleFilter" @reset="handleReset" />
  </v-card-text>
  <VCardText class="d-flex flex-wrap gap-4 justify-space-between mt-5 pb-2" v-if="!isEdit">
    <div class="me-3 d-flex gap-3">
      <ItemsPerPageSelector v-model="itemsPerPage" @update:model-value="updateItemsPerPage" />
    </div>
  </VCardText>


  <VDatableComponent :headers="headers" :items="customersList" :loading="loading" :search="search" :pagination="pagination"
      :pageNo="pageNo" @update:pageNo="pageNo = $event" class="border-t-sm" v-if="!isEdit">
    <template #item.action="{ item }">
      <div class="d-flex gap-2">
        <VBtn color="warning" type="button" :to="``" variant="elevated" size="small"   @click="emit('selectCustomer', item.id)">
          Select
        </VBtn>
        <VBtn color="primary" type="button" @click="EditCustomer(item.id)" variant="elevated" size="small">
          Edit
        </VBtn>
      </div>
    </template>
  </VDatableComponent>
  <VCardText v-if="isEdit">
    <VForm @submit.prevent="updateForm" ref="formRef">
        <VRow>
          <!-- Customer Type -->
          <VCol cols="12" md="6">
            <span class="fs-13 label-color">Customer Type<span class="text-red">*</span></span>
            <AppAutocomplete :items="CustomerType" item-title="label" item-value="value" v-model="form.customer_type"
              placeholder="Choose customer type" :rules="[requiredValidator]" />
          </VCol>

          <!-- Customer Name -->
          <VCol cols="12" md="6">
            <span class="fs-13 label-color">Customer Name<span class="text-red">*</span></span>
            <AppTextField placeholder="Customer name" v-model="form.first_name" :rules="[requiredValidator]" />
          </VCol>

          <!-- Gender -->
          <VCol cols="12" md="6">
            <span class="fs-13 label-color">Gender<span class="text-red">*</span></span>
            <AppAutocomplete :items="genderOptions" item-title="text" item-value="value" v-model="form.gender"
              placeholder="Gender" :rules="[requiredValidator]" />
          </VCol>

          <!-- Date of Birth -->
          <VCol cols="12" md="6">
            <span class="fs-13 label-color">Date Of Birth<span class="text-red">*</span></span>
            <AppDialogDate v-model="form.dob" placeholder="dd/mm/yyyy" format="yyyy-mm-dd" :rules="[requiredValidator]"
              autocomplete="off" />
          </VCol>

          <!-- Email -->
          <VCol cols="12" md="6">
            <span class="fs-13 label-color">Email<span class="text-red">*</span></span>
            <AppTextField type="email" placeholder="Email" v-model="form.email"
              :rules="[requiredValidator, emailValidator]" />
          </VCol>

          <!-- Phone Number -->
          <VCol cols="12" md="6">
            <span class="fs-13 label-color">Phone<span class="text-red">*</span></span>
            <AppTextField placeholder="Phone number" v-model="form.phone_number" :rules="[requiredValidator]" />
          </VCol>

          <!-- Landline -->
          <VCol cols="12" md="6">
            <span class="fs-13 label-color">Landline</span>
            <AppTextField placeholder="Landline number" v-model="form.landline" />
          </VCol>

          <!-- Address -->
          <VCol cols="12" md="6">
            <span class="fs-13 label-color">House #<span class="text-red">*</span></span>
            <AppTextField placeholder="House # / Office" v-model="form.address" :rules="[requiredValidator]" />
          </VCol>

          <!-- Street -->
          <VCol cols="12" md="6">
            <span class="fs-13 label-color">Street #<span class="text-red">*</span></span>
            <AppTextField placeholder="Street" v-model="form.street_address" :rules="[requiredValidator]" />
          </VCol>

          <!-- City -->
          <VCol cols="12" md="6">
            <span class="fs-13 label-color">City</span>
            <AppTextField placeholder="City" v-model="form.city" />
          </VCol>

          <!-- Postal Code -->
          <VCol cols="12" md="6">
            <span class="fs-13 label-color">Postal Code<span class="text-red">*</span></span>
            <AppTextField placeholder="Postal code" v-model="form.postal_code" :rules="[requiredValidator]" />
          </VCol>

          <!-- Nationality -->
          <VCol cols="12" md="6">
            <span class="fs-13 label-color">Nationality<span class="text-red">*</span></span>
            <AppAutocomplete :items="nationalities" item-title="title" item-value="id" placeholder="Select nationality"
              v-model="form.nationality" :rules="[requiredValidator]" />
          </VCol>

          <VCol cols="12" md="6">
            <span class="fs-13 label-color">Receiving Country<span class="text-red">*</span></span>
            <AppAutocomplete :items="countries" item-title="name" item-value="id" placeholder="Select nationality"
              v-model="form.receiving_country_id" :rules="[requiredValidator]" />
          </VCol>

          <!-- Occupation -->
          <VCol cols="12" md="6">
            <span class="fs-13 label-color">Occupation<span class="text-red">*</span></span>
            <AppAutocomplete :items="occupationsOptions" item-title="name" item-value="name"
              placeholder="Select occupation" v-model="occupationSelect" :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12" md="6" v-if="occupationSelect === 'Other (Specify)'">
            <span class="fs-13 label-color">Other (Specify) Occupation<span class="text-red">*</span></span>
            <AppTextarea rows="1" placeholder="Type here" v-model="otherOcupation"
              :rules="form.occupation === 'Other (Specify)' ? [requiredValidator] : []" />
          </VCol>
          <!-- Notes -->
          <VCol cols="12" md="6">
            <span class="fs-13 label-color">Notes<span class="text-red">*</span></span>
            <AppTextarea rows="1" placeholder="Type here" v-model="form.notes" :rules="[requiredValidator]" />
          </VCol>

          <!-- Buttons -->
          <VCol cols="12" class="d-flex gap-4 justify-end">

            <VBtn color="primary" variant="elevated" @click="handleReset">Back To Search</VBtn>
            <VBtn type="submit" variant="tonal" class="login-btn" :loading="loading">
              Update & Use Customer
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
  </VCardText>
</template>
