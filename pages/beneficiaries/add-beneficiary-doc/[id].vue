<script setup>
import AppDateTimePicker from "@/@core/components/app-form-elements/AppDateTimePicker.vue";
import BackNavigation from "@/@core/components/BackNavigation.vue";
import BeneficiaryDocuments from "@/components/beneficiary/BeneficiaryDocuments.vue";
import { useBeneficiary } from "@/composables/useBeneficiary";
import data from "@/views/demos/forms/tables/data-table/datatable";
import { useRoute } from "vue-router";
import { VFileInput } from "vuetify/components";
import AuditLog from '@/components/AuditLog.vue'
const permissionStore = usePermissionStore()
definePageMeta({
  middleware: "auth",
  permission: "beneficiary.document.upload"
})
const { fetchCustomerById, fetchCustomerDocuments, documentTypes, countries, uploadCustomerDocuments } = useBeneficiary();
const route = useRoute();

const userList = ref([]);
const customer = ref({});
const banks = ref([]);
const documents = ref([]);
const customer_id = route.params.id;
const formRef = ref(null);

const documentType = ref("");
const documentNumber = ref("");
const issuanceDate = ref("");
const expiryDate = ref("");
const issuerAuthority = ref("");
const issueCountry = ref("");
const frontFiles = ref([]);
const backFiles = ref([]);

const selectedDocument = ref(null);
const frontView = ref(false)
const backView = ref(false)


function openFrontView(doc) {
  const url = doc.media?.[0]?.url;
  if (url && (url.endsWith(".pdf") || url.endsWith(".doc") || url.endsWith(".docx"))) {
    window.open(url, "_blank"); 
  } else {
    selectedDocument.value = doc;
    frontView.value = true; 
  }
}

function openBackView(doc) {
  const url = doc.media?.[1]?.url;
  if (url && (url.endsWith(".pdf") || url.endsWith(".doc") || url.endsWith(".docx"))) {
    window.open(url, "_blank"); 
  } else {
    selectedDocument.value = doc;
    backView.value = true; 
  }
}






const handleSubmit = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  const payload = {
    type: documentType.value,
    document_number: documentNumber.value,
    issuance_date: issuanceDate.value,
    expiry_date: expiryDate.value,
    issue_authority: issuerAuthority.value,
    country_id: issueCountry.value,
    front_files: frontFiles.value,
    back_files: backFiles.value,
  };

  await uploadCustomerDocuments(route.params.id, payload);

  customer.value = await fetchCustomerById(route.params.id);
  documents.value = customer.value.documents;

  formRef.value.reset();
};


const options = ref({
  page: 1,
  itemsPerPage: 3,
  sortBy: [""],
  sortDesc: [false],
});

const resolveStatusVariant = (status) => {
  if (status === 1)
    return {
      color: "primary",
      text: "Current",
    };
  else if (status === 2)
    return {
      color: "success",
      text: "Professional",
    };
  else if (status === 3)
    return {
      color: "error",
      text: "Rejected",
    };
  else if (status === 4)
    return {
      color: "warning",
      text: "Resigned",
    };
  else
    return {
      color: "info",
      text: "Applied",
    };
};

onMounted(async () => {
  const id = route.params.id;
  customer.value = await fetchCustomerById(id);
  banks.value = customer.value.banks;
  documents.value = customer.value.documents;
  fetchCustomerDocuments(id);
  userList.value = JSON.parse(JSON.stringify(data));
});
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex align-center" style="background-color: lightgrey;">
          <BackNavigation />
          <h4 class="text-h5 py-4">Customer Beneficiary Documents</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="px-0 pt-0">
      <v-row class="border-b-md px-5">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Beneficiary ID</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ customer?.id || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Phone</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.phone_number || "---" }}
          </p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Name</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ customer?.name || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Address</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ customer?.address || "---" }}</p>
        </v-col>
      </v-row>
      <v-row class="border-b-md px-5 py-3">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Gender</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ customer?.gender || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Country</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ customer?.country || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">DOB</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ customer?.dob || "---" }}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card-text class="px-4 py-0">
            <VForm @submit.prevent="handleSubmit" ref="formRef">
              <v-row class="ps-0 mt-4">
                <v-col cols="12" sm="6" md="6">
                  <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Type')"></span>
                  <AppAutocomplete name="documentType" v-model="documentType" :items="documentTypes" item-title="title"
                    item-value="title" placeholder="Type" :rules="[requiredValidator]" autocomplete="off" />
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <span class="fs-15 label-color font-weight-medium">Document No
                  <span class="text-red" v-if="documentType == 'Passport' || documentType == 'ID Card'">*</span>
                </span>
                <AppTextField name="documentNumber" v-model="documentNumber" placeholder="1234567"
                  :rules="documentType == 'Passport' || documentType == 'ID Card' ? [requiredValidator] : []"
                  autocomplete="off" />
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Issuance Date')"></span>
                  <AppDateTimePicker name="issuanceDate" v-model="issuanceDate" :rules="[requiredValidator]"
                    placeholder="Issuance Date" autocomplete="off" />
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Expiry Date')"></span>
                  <AppDateTimePicker name="expiryDate" v-model="expiryDate" :rules="[requiredValidator]"
                    placeholder="Expiry Date" autocomplete="off" />
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Front Side')"></span><span class="text-red"> (jpg,png,pdf,doc,docx)</span>
                  <VFileInput chips multiple :rules="[requiredValidator]" v-model="frontFiles"
                    label="Choose front files" />
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <span class="fs-15 label-color font-weight-medium">Back Side</span><span class="text-red"> (jpg,png,pdf,doc,docx)</span>
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
                  <VBtn type="reset" color="secondary" variant="tonal"> Reset </VBtn>
                  <VBtn type="submit" class="login-btn" variant="tonal">
                    Add Documents
                  </VBtn>
                </VCol>
              </v-row>
            </VForm>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <BeneficiaryDocuments :documents="documents" :openFrontView="openFrontView" :openBackView="openBackView"/>

     <!---Front View of document show in pop up--->
<div class="text-center">
  <!-- Dialog -->
  <v-dialog v-model="frontView" max-width="1000" transition="scale-transition">
    <v-card>
      <v-row>
        <v-col cols="12">
          <v-card-title
            class="d-flex align-center justify-space-between"
            style="background-color: lightgray;"
          >
            <h4 class="text-h4 py-3">Front View</h4>
            <IconBtn @click="frontView = false">
              <VIcon icon="tabler-x" />
            </IconBtn>
          </v-card-title>
        </v-col>
      </v-row>
      <v-card-text>
        <VCol cols="12">
          <template v-if="selectedDocument?.media?.[0]?.url">
            <!-- If PDF show link -->
            <template v-if="selectedDocument.media[0].url.endsWith('.pdf')">
              <a
                :href="selectedDocument.media[0].url"
                target="_blank"
                rel="noopener"
              >
                Open PDF
              </a>
            </template>

            <!-- Otherwise show image -->
            <template v-else>
              <ImageViewer :imageUrl="selectedDocument.media[0].url" />
            </template>
          </template>

          <template v-else>
            <span>No document available</span>
          </template>
        </VCol>
      </v-card-text>
    </v-card>
  </v-dialog>
</div>

  <!---BackView of document show in pop up--->
<div class="text-center">
  <v-dialog v-model="backView" max-width="1000" transition="scale-transition">
    <v-card>
      <v-row>
        <v-col cols="12">
          <v-card-title
            class="d-flex align-center justify-space-between"
            style="background-color: lightgray;"
          >
            <h4 class="text-h4 py-3">Back View</h4>
            <IconBtn @click="backView = false">
              <VIcon icon="tabler-x" />
            </IconBtn>
          </v-card-title>
        </v-col>
      </v-row>
      <v-card-text>
        <VCol cols="12">
          <template v-if="selectedDocument?.media?.[1]?.url">
            <!-- If PDF show link -->
            <template v-if="selectedDocument.media[1].url.endsWith('.pdf')">
              <a
                :href="selectedDocument.media[1].url"
                target="_blank"
                rel="noopener"
              >
                Open PDF
              </a>
            </template>

            <!-- Otherwise show image -->
            <template v-else>
              <ImageViewer :imageUrl="selectedDocument.media[1].url" />
            </template>
          </template>

          <template v-else>
            <span>No document available</span>
          </template>
        </VCol>
      </v-card-text>
    </v-card>
  </v-dialog>
</div>

  <AuditLog module="Document" :id="route.params.id" class="mt-4"/>

  
</template>
