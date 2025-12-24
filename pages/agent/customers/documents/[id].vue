<script setup>
// const permissionStore = usePermissionStore()
// definePageMeta({
//   middleware: "auth",
//   permission: "customer.document.upload"
// })
import { ref, onMounted } from "vue";
import AppDateTimePicker from "@/@core/components/app-form-elements/AppDateTimePicker.vue";
import customerDocuments from '@/components/agent-portal/customerDocuments.vue';
import { useCustomer } from "@/composables/agentPortal/useCustomers";
import { useRoute } from "vue-router";
import { VFileInput } from "vuetify/components";
const countryCurrencyStore = useCountryCurrencyStore();
const { countries } = storeToRefs(countryCurrencyStore);
const route = useRoute();
const customerId = computed(() => route.params.id);
const { selectCustomer, fetchCustomerById, documentTypes, form, uploadCustomerDocuments, loading } = useCustomer();
const occupationSelect = ref('');

const customer = ref(null);
const formRef = ref(null);

const documentType = ref("");
const documentNumber = ref("");
const issuanceDate = ref("");
const expiryDate = ref("");
const issuerAuthority = ref("");
const issueCountry = ref("");
const frontFiles = ref([]);
const backFiles = ref([]);

const resetForm = () => {
  documentType.value = null
  documentNumber.value = ''
  issuanceDate.value = null
  expiryDate.value = null
  issuerAuthority.value = ''
  issueCountry.value = null
  frontFiles.value = []
  backFiles.value = []
  formRef.value.reset();
}

const customerDocumentsRef = ref(null);

const refetchDocuments = async () => {
  if (customerDocumentsRef.value) {
    await customerDocumentsRef.value.refetchSenderDocuments();
  }
};


const handleSubmit = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  const payload = {
    category: 'Identification',
    type: documentType.value,
    document_number: documentNumber.value,
    issuance_date: issuanceDate.value,
    expiry_date: expiryDate.value,
    issue_authority: issuerAuthority.value,
    country_id: issueCountry.value,
    front_files: frontFiles.value,
    back_files: backFiles.value,
  };

  await uploadCustomerDocuments(customerId.value, payload);
  formRef.value.reset();
  resetForm();
  await refetchDocuments();
};


const options = ref({
  page: 1,
  itemsPerPage: 3,
  sortBy: [""],
  sortDesc: [false],
});

const splitOccupation = () => {
  if (form.value.occupation.startsWith("Other (Specify)")) {
    const parts = form.value.occupation.split("-");
    occupationSelect.value = parts[1]; // "Other (Specify)"
  } else {
    occupationSelect.value = form.value.occupation;
  }
}

onMounted(async () => {
  await fetchCustomerById(customerId.value);
  splitOccupation();
});


</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="d-flex align-center justify-space-between" style="background-color: lightgray;">
          <div class="d-flex align-center">
            <BackNavigation />
            <h4 class="text-h4 py-3">Customer Documents</h4>
          </div>
          <VBtn variant="tonal" class="login-btn">Use For Transfer</VBtn>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="px-0">
      <v-row class="border-b-sm px-5">
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Customer ID</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customerId || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Name</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1 text-capitalize">
            {{ form?.first_name || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Phone</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1 text-capitalize">
            {{ form?.phone_number || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Address</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1 text-capitalize">
            {{ `${form?.street_address || ''} ${form?.address || ''} ${form?.postal_code || ''}` }}
          </p>
        </v-col>
      </v-row>
      <v-row class="border-b-sm px-5">
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Gender</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1 text-capitalize">
            {{ form?.gender || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Nationality</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1 text-capitalize">
            {{ form?.nationality || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">DOB</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ form?.dob || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Occupation</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1 text-capitalize">
            {{ occupationSelect || "---" }}
          </p>
        </v-col>
      </v-row>
    </v-card-text>
    <V-card-text>
      <VForm @submit.prevent="handleSubmit" ref="formRef">
        <v-row class="ps-0 mt-4">
          <v-col cols="12" sm="6" md="6">
            <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Type')"></span>
            <AppAutocomplete name="documentType" v-model="documentType" :items="documentTypes" item-title="title"
              item-value="title" placeholder="Type" :rules="[requiredValidator]" autocomplete="off" />
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <span class="fs-15 label-color font-weight-medium">Document No
              <span class="text-red"
                v-if="documentType == 'Passport' || documentType == 'ID Card' || documentType == 'Liveness' || documentType == 'Resident Permit'">*</span>
            </span>
            <AppTextField name="documentNumber" v-model="documentNumber" placeholder="1234567"
              :rules="documentType == 'Passport' || documentType == 'ID Card' || documentType == 'Liveness' || documentType == 'Resident Permit' ? [requiredValidator] : []"
              autocomplete="off" />
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Issuance Date')"></span>
            <AppDateTimePicker name="issuanceDate" v-model="issuanceDate" :rules="[requiredValidator]"
              :config="{ dateFormat: 'd-m-Y' }" placeholder="Issuance Date" autocomplete="off" />
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Expiry Date')"></span>
            <AppDateTimePicker name="expiryDate" v-model="expiryDate" :rules="[requiredValidator]"
              :config="{ dateFormat: 'd-m-Y' }" placeholder="Expiry Date" autocomplete="off" />
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Front Side')"></span><span
              class="text-red"> (jpg,png,pdf,doc,docx)</span>
            <VFileInput chips multiple :rules="[requiredValidator]" v-model="frontFiles" label="Choose front files" />
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <span class="fs-15 label-color font-weight-medium">Back Side</span><span class="text-red">
              (jpg,png,pdf,doc,docx)</span>
            <VFileInput chips multiple v-model="backFiles" label="Choose back files" />
          </v-col>

          <v-col cols="12" sm="6" md="6">
            <span class="fs-15 label-color font-weight-medium">Issuer Authority</span>
            <AppTextField name="issuerAuthority" v-model="issuerAuthority" placeholder="Type..." autocomplete="off" />
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <span class="fs-15 label-color font-weight-medium">Issuer Country<span class="text-red">*</span></span>
            <AppAutocomplete name="issueCountry" v-model="issueCountry" placeholder="Algeria" :items="countries"
              item-title="name" item-value="id" autocomplete="off" :rules="[requiredValidator]" />
          </v-col>
          <VCol cols="12" md="12" class="d-flex gap-2 align-end justify-end">
            <VBtn type="reset" color="secondary" variant="tonal" @click="resetForm">
              Reset
            </VBtn>
            <VBtn type="submit" class="login-btn" variant="tonal">
              Add Document
            </VBtn>
          </VCol>
        </v-row>
      </VForm>
    </V-card-text>
  </v-card>
  <customerDocuments ref="customerDocumentsRef" :customer_id="customerId" @refetchSenderDocuments="refetchDocuments" />

</template>
