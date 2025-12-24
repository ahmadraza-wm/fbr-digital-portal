<script setup>
import { ref, watch } from 'vue';
import searchCustomerModel from './searchCustomerModel.vue';
import { useCustomer } from '@/composables/agentPortal/useCustomers';
const addCustomer = ref(false);
const searchCustomer = ref(false);
const countryCurrencyStore = useCountryCurrencyStore();
const { nationalities, countries } = storeToRefs(countryCurrencyStore);
const formRef = ref('');

const {createCustomer, selectCustomer,form, occupationsOptions, fetchOccupationsList,genderOptions,loading,CustomerType,fetchCustomerById} = useCustomer();
const occupationSelect = ref('');
const otherOcupation = ref('');

const props = defineProps({
  resetKey: Number,
})

watch(
  () => props.resetKey,
  async () => {
    // Clear the selected customer immediately
    selectCustomer.value = {}
    
    // Reset form data
    form.value = {
      first_name: "",
      dob: "",
      gender: "",
      customer_type: "",
      email: "",
      phone_number: "",
      landline: "",
      address: "",
      street_address: "",
      city: "",
      postal_code: "",
      nationality: "",
      occupation: "",
      notes: "",
      receiving_country_id: null
    }
    
    // Reset other fields
    occupationSelect.value = ''
    otherOcupation.value = ''
    
    // Wait for next tick before resetting form validation
    await nextTick()
    formRef.value?.reset()
    formRef.value?.resetValidation()
  }
)


const submitForm = async() => {
   const { valid } = await formRef.value.validate();
  if (!valid) return;
  if(form.value.occupation === 'Other (Specify)')
  {
      form.value.occupation = `${form.value.occupation}-${otherOcupation.value}`;
  }
  await createCustomer(form.value);
  addCustomer.value = false;
}

const emit = defineEmits(['customerSelected']);

watch(
  () => selectCustomer.value,
  (newCustomer) => {
    if (newCustomer) {
      emit('customerSelected', newCustomer);
    }
  },
  { deep: true }
);

watch(
  () => occupationSelect.value,
  (newVal) => {
    form.value.occupation = newVal;
  },
  { immediate: true }
);


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

function handleSelectCustomer(customerId) {
  searchCustomer.value = false;
  fetchCustomerById(customerId);
}

onMounted(()=>{
 fetchOccupationsList();
});

</script>
<template>
  <v-col cols="12" md="6">
    <v-card>
      <v-row>
        <v-col cols="12">
          <v-card-title class="border-b-sm d-flex align-center justify-space-between"
            style="background-color: lightgrey;">
            <h4 class="text-h5 py-3">Sender Details</h4>
            <div class="d-flex gap-3">
              <VBtn @click="addCustomer = true">Add Customer</VBtn>
              <VBtn color="warning" @click="searchCustomer = true">Search/Edit Customer</VBtn>
            </div>
          </v-card-title>
        </v-col>
      </v-row>
      <VTable class="border">
        <tbody>
          <tr>
            <th class="bg-grey">Full Name</th>
            <td class="text-center font-weight-bold text-capitalize">{{ selectCustomer?.user?.name || '-----' }}</td>
          </tr>
          <tr>
            <th class="bg-grey">Gender</th>
            <td class="text-center font-weight-bold text-capitalize">{{ selectCustomer?.customer_detail?.gender || '-----' }}</td>
          </tr>
          <tr>
            <th class="bg-grey">Address</th>
            <td class="text-center font-weight-bold text-capitalize">{{ selectCustomer?.customer_detail?.address || '-----' }}</td>
          </tr>
          <tr>
            <th class="bg-grey">Postal Code</th>
            <td class="text-center font-weight-bold text-capitalize">{{ selectCustomer?.customer_detail?.postal_code || '-----' }}</td>
          </tr>
          <tr>
            <th class="bg-grey">City</th>
            <td class="text-center font-weight-bold text-capitalize">{{ selectCustomer?.customer_detail?.city || '-----' }}</td>
          </tr>
          <tr>
            <th class="bg-grey">Mobile No.</th>
            <td class="text-center font-weight-bold text-capitalize">{{ selectCustomer?.phone_number || '-----' }}</td>
          </tr>
          <tr>
            <th class="bg-grey">Landline No.</th>
            <td class="text-center font-weight-bold text-capitalize">{{ selectCustomer?.landline || '-----' }}</td>
          </tr>
          <tr>
            <th class="bg-grey">Nationality</th>
            <td class="text-center font-weight-bold text-capitalize">{{ selectCustomer?.customer_detail?.nationality || '-----' }}</td>
          </tr>
          <tr>
            <th class="bg-grey">Occupation</th>
            <td class="text-center font-weight-bold text-capitalize">{{ selectCustomer?.customer_detail?.occupation || '-----' }}</td>
          </tr>
          <tr>
            <th class="bg-grey">View Documents</th>
            <td class="text-center font-weight-bold">
              <VBtn variant="plain" target="_blank" :to="`/agent/customers/documents/${selectCustomer?.id || ''}`" :disabled="!selectCustomer?.id">
                <VIcon icon="tabler-link" />View Documents
              </VBtn>
            </td>
          </tr>
        </tbody>
      </VTable>
    </v-card>
  </v-col>
  <div class="text-center">
    <!-- Dialog -->
    <v-dialog v-model="addCustomer" max-width="1000" transition="scale-transition">
      {{ form.occupation }}
      <v-card>
        <v-row>
          <v-col cols="12">
            <v-card-title class="d-flex align-center justify-space-between" style="background-color: lightgray;">
              <h4 class="text-h4 py-3">Add New Customers</h4>
              <IconBtn @click="addCustomer = false">
                <VIcon icon="tabler-x" />
              </IconBtn>
            </v-card-title>
          </v-col>
        </v-row>
        <V-card-text>
          <VForm @submit.prevent="submitForm" ref="formRef">
            <VRow>
              <!-- Customer Type -->
              <VCol cols="12" md="6">
                <span class="fs-13 label-color">Customer Type<span class="text-red">*</span></span>
                <AppAutocomplete :items="CustomerType" item-title="label" item-value="value"
                  v-model="form.customer_type" placeholder="Choose customer type" :rules="[requiredValidator]" />
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
                <AppDialogDate v-model="form.dob" placeholder="dd/mm/yyyy"   format="yyyy-mm-dd" :rules="[requiredValidator]"
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
                <AppAutocomplete :items="nationalities" item-title="title" item-value="id"
                  placeholder="Select nationality" v-model="form.nationality" :rules="[requiredValidator]" />
              </VCol>
              
              <VCol cols="12" md="6">
                <span class="fs-13 label-color">Receiving Country<span class="text-red">*</span></span>
                <AppAutocomplete :items="countries" item-title="name" item-value="id"
                  placeholder="Select nationality" v-model="form.receiving_country_id" :rules="[requiredValidator]" />
              </VCol>

              <!-- Occupation -->
              <VCol cols="12" md="6">
                <span class="fs-13 label-color">Occupation<span class="text-red">*</span></span>
                <AppAutocomplete :items="occupationsOptions" item-title="name" item-value="name"
                  placeholder="Select occupation" v-model="occupationSelect" :rules="[requiredValidator]" />
              </VCol>
              <VCol cols="12" md="6" v-if="occupationSelect ==='Other (Specify)'">
                <span class="fs-13 label-color">Other (Specify) Occupation<span class="text-red">*</span></span>
                <AppTextarea rows="1" placeholder="Type here" v-model="otherOcupation" :rules="form.occupation ==='Other (Specify)' ? [requiredValidator] : []" />
              </VCol>
              <!-- Notes -->
              <VCol cols="12" md="6">
                <span class="fs-13 label-color">Notes<span class="text-red">*</span></span>
                <AppTextarea rows="1" placeholder="Type here" v-model="form.notes" :rules="[requiredValidator]" />
              </VCol>

              <!-- Buttons -->
              <VCol cols="12" class="d-flex gap-4 justify-end">
                <VBtn type="reset" color="secondary" variant="tonal">Reset</VBtn>
                <VBtn type="submit" variant="tonal" class="login-btn" :loading="loading">
                  Add Customer
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </V-card-text>
      </v-card>
    </v-dialog>
    <!-- Search Customer -->
    <v-dialog v-model="searchCustomer" max-width="1000" transition="scale-transition">
      <v-card>
        <searchCustomerModel @searchCustomer="searchCustomer = $event" @selectCustomer="handleSelectCustomer" />
      </v-card>
    </v-dialog>
  </div>
</template>
