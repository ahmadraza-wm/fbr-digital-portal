<script setup>
import AppDateTimePicker from "@/@core/components/app-form-elements/AppDateTimePicker.vue";
import BackNavigation from "@/@core/components/BackNavigation.vue";
import CustomerDocuments from "@/components/customers/CustomerDocuments.vue";
import { useCustomer } from "@/composables/useCustomer";
import data from "@/views/demos/forms/tables/data-table/datatable";
import { useRoute } from "vue-router";
import { VFileInput } from "vuetify/components";
import AuditLog from '@/components/AuditLog.vue'
const permissionStore = usePermissionStore()
definePageMeta({
  middleware: "auth",
  permission: "customer.document.upload"
})
const {
  fetchCustomerById,
  documents,
  fetchCustomerDocuments,
  uploadCustomerDocuments,
  documentTypes,
  countries,
  updateDocumentStatus,
  SubmitCustomerDocuments
} = useCustomer();
const route = useRoute();

const userList = ref([]);
const customer = ref(null);
const formRef = ref(null);

const customerID = ref(null);
const documentType = ref("");
const documentNumber = ref("");
const issuanceDate = ref("");
const expiryDate = ref("");
const issuerAuthority = ref("");
const issueCountry = ref("");
const frontFiles = ref([]);
const backFiles = ref([]);

const isEditMode = ref(false)
const selectedDocumentId = ref(null)
const hideFileInputs = ref(false)

const selectedDocument = ref(null);

const verifyDocument = ref(false);


function openVerifyDialog(doc) {
  selectedDocument.value = doc;
  verifyDocument.value = true;
}

async function verifySelectedDocument() {
  if (!selectedDocument.value) return;

 
  await updateDocumentStatus(selectedDocument.value.id, selectedDocument.value.is_verified);

  verifyDocument.value = false; 
}



const editDocument = (doc) => {
  if (formRef.value) {
    const top = formRef.value.getBoundingClientRect().top + window.scrollY
    window.scrollTo({
      top: top - 100,
      behavior: "smooth",
    })
  }
  documentType.value = doc.type
  documentNumber.value = doc.number
  issuanceDate.value = doc.issue_date
  expiryDate.value = doc.expiry_date
  issuerAuthority.value = doc.issuer_authority
  issueCountry.value = doc.country_id

  isEditMode.value = true
  selectedDocumentId.value = doc.id
  hideFileInputs.value = true

  frontFiles.value = []
  backFiles.value = []

  console.log('issue date', doc.issue_date);
}
const resetForm = () => {
  documentType.value = null
  documentNumber.value = ''
  issuanceDate.value = null
  expiryDate.value = null
  issuerAuthority.value = ''
  issueCountry.value = null
  frontFiles.value = []
  backFiles.value = []

  isEditMode.value = false
  selectedDocumentId.value = null
  hideFileInputs.value = false
}

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


  if (isEditMode.value) {
    delete payload.front_files;
    delete payload.back_files;
  }

  await SubmitCustomerDocuments(
    route.params.id,
    payload,
    isEditMode.value,
    selectedDocumentId.value
  );

  formRef.value.reset();
  resetForm();
};


const options = ref({
  page: 1,
  itemsPerPage: 3,
  sortBy: [""],
  sortDesc: [false],
});

onMounted(async () => {
  const id = route.params.id;
  customer.value = await fetchCustomerById(id);
  fetchCustomerDocuments(id);
  userList.value = JSON.parse(JSON.stringify(data));
});





</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="d-flex align-center" style="background-color: lightgray;">
          <BackNavigation />
          <h4 class="text-h4 py-3">Customer Documents</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="px-0">
      <v-row class="border-b-sm px-5">
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Customer ID</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.id || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Name</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.first_name || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Phone</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.phone || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Address</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.place_of_birth || "---" }}
          </p>
        </v-col>
      </v-row>
      <v-row class="border-b-sm px-5">
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Gender</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.gender || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Country</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.sending_country || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">DOB</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.dob || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Occupation</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.occupation || "---" }}
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
              :rules="documentType == 'Passport' || documentType == 'ID Card' || documentType == 'Liveness' || documentType == 'Resident Permit' ? [requiredValidator] : []" autocomplete="off" />
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Issuance Date')"></span>
            <AppDateTimePicker name="issuanceDate" v-model="issuanceDate" :rules="[requiredValidator]"
              :config="{ dateFormat: 'd-m-Y' }" placeholder="Issuance Date" autocomplete="off"/>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Expiry Date')"></span>
            <AppDateTimePicker name="expiryDate" v-model="expiryDate" :rules="[requiredValidator]"
              :config="{ dateFormat: 'd-m-Y' }" placeholder="Expiry Date" autocomplete="off"/>
          </v-col>
          <v-col cols="12" sm="6" md="6" v-if="!hideFileInputs">
            <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Front Side')"></span><span class="text-red"> (jpg,png,pdf,doc,docx)</span>
            <VFileInput chips multiple :rules="[requiredValidator]" v-model="frontFiles" label="Choose front files" />
          </v-col>
          <v-col cols="12" sm="6" md="6" v-if="!hideFileInputs">
            <span class="fs-15 label-color font-weight-medium">Back Side</span><span class="text-red"> (jpg,png,pdf,doc,docx)</span>
            <VFileInput chips multiple v-model="backFiles" label="Choose back files" />
          </v-col>

          <v-col cols="12" sm="6" md="6">
            <span class="fs-15 label-color font-weight-medium">Issuer Authority</span>
            <AppTextField name="issuerAuthority" v-model="issuerAuthority" placeholder="Type..." autocomplete="off"/>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <span class="fs-15 label-color font-weight-medium">Issuer Country<span class="text-red">*</span></span>
            <AppAutocomplete name="issueCountry" v-model="issueCountry" placeholder="Algeria" :items="countries"
              item-title="name" item-value="id" autocomplete="off" :rules="[requiredValidator]"/>
          </v-col>
          <VCol cols="12" md="12" class="d-flex gap-2 align-end justify-end">
            <VBtn type="reset" color="secondary" variant="tonal" @click="resetForm">
              Reset
            </VBtn>
            <VBtn type="submit" class="login-btn" variant="tonal">
              {{ isEditMode ? 'Update Document' : 'Add Document' }}
            </VBtn>
          </VCol>
        </v-row>
      </VForm>
    </V-card-text>
  </v-card>
  <CustomerDocuments :documents="documents" :updateDocumentStatus="updateDocumentStatus" @editDocument="editDocument" :openVerifyDialog="openVerifyDialog"
    :isView="true" v-if="permissionStore.hasPermission('customer.document.view')"/>
     <div class="text-center">
    <!-- Dialog -->
    <v-dialog v-model="verifyDocument" max-width="1000" transition="scale-transition">
      <v-card>
        <v-row>
          <v-col cols="12">
            <v-card-title class="d-flex align-center justify-space-between" style="background-color: lightgray;">
              <h4 class="text-h4 py-3">Attention</h4>
              <IconBtn @click="verifyDocument = false">
                <VIcon icon="tabler-x" />
              </IconBtn>
            </v-card-title>
          </v-col>
        </v-row>
        <v-card-text>
          <p class="text-red mb-0 fs-16 font-weight-bold text-center">
            Are you sure you want to verify this document?
          </p>
          <p class="text-red mb-0 fs-16 font-weight-bold text-center">
            Verifying the primary document will also verify the customer
            profile.
          </p>
          <p class="text-red mb-0 fs-14 font-weight-bold text-center">
            (The customer will not be able to edit his profile.)
          </p>
        </v-card-text>
        <v-card-text>
          <VTable class="text-no-wrap">
            <thead>
              <tr>
                <th>Type</th>
                <th>Number</th>
                <th>Issuer Auth</th>
                <th>Issuance date</th>
                <th>Expiry date</th>
              </tr>
            </thead>
            <tbody class="pb-2">
              <tr>
                <td>{{ selectedDocument?.type }}</td>
                <td>{{ selectedDocument?.number }}</td>
                <td>{{ selectedDocument?.issuer_authority }}</td>
                <td>{{ selectedDocument?.issue_date }}</td>
                <td>{{ selectedDocument?.expiry_date }}</td>
              </tr>
            </tbody>
          </VTable>
        </v-card-text>
        <v-card-text>
          <VCol cols="12" v-if="selectedDocument?.media?.[0]?.url">
            <p class="fs-16 font-weight-medium">Front</p>
            <div class="d-flex justify-center">
              <img :src="selectedDocument?.media?.[0]?.url || ''" alt="Front Image" class="rounded border"
                style=" block-size: auto;max-inline-size: 100%;" />
            </div>
          </VCol>

          <VCol cols="12" v-if="selectedDocument?.media?.[1]?.url">
            <p class="fs-16 font-weight-medium">Back</p>
            <div class="d-flex justify-center">
              <img :src="selectedDocument?.media?.[1]?.url || ''" alt="Back Image" class="rounded border"
                style=" block-size: auto;max-inline-size: 100%;" />
            </div>
          </VCol>
        </v-card-text>
        <v-card-text>
          <VCol class=" d-flex gap-3 justify-end">
            <VBtn class="px-5" variant="tonal" color="secondary" @click="verifyDocument = false">
            Discard
          </VBtn>
            <VBtn  class="login-btn" variant="tonal" color="white" @click="verifySelectedDocument">
              Approve
            </VBtn>
          </VCol>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>

    <AuditLog module="Document" :id="route.params.id" class="mt-4"/>
  

</template>
