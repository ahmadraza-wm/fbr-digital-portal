<script setup>
import { ref, watch, onMounted} from 'vue';
const countryCurrencyStore = useCountryCurrencyStore();
const { countries, nationalities } = storeToRefs(countryCurrencyStore);
import { useAgentProfile } from '@/composables/agentPortal/useProfile';
const {fetchUserDocuments,userDocuments,uploadUserDocuments} = useAgentProfile();
const agentDocument = ref(false)
const documentTypes = [
  { title: 'Passport', id: 1 },
  { title: 'Licence', id: 2 },
  { title: 'ID-Card', id: 3 }
]
const { userId } = defineProps({
  userId: { type: [String, Number], required: true }
});

const formRef = ref('');
const documentType = ref("");
const documentNumber = ref("");
const issuanceDate = ref("");
const expiryDate = ref("");
const issuerAuthority = ref("");
const issueCountry = ref("");
const frontFiles = ref([]);
const backFiles = ref([]);


const submitForm = async() =>{
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  const payload = {
    type: documentType.value,
    document_number: documentNumber.value,
    issuance_date: issuanceDate.value,
    expiry_date: expiryDate.value,
    country_id: issueCountry.value,
    front_files: frontFiles.value,
    back_files: backFiles.value,
  };
  
  await uploadUserDocuments(userId,payload);
  agentDocument.value = false;
}

const headers = [
    { title: "#", key: "sr" },
    { title: "Document Name", key: "type" },
    { title: "Number", key: "number" },
    { title: "Issuance date", key: "issue_date" },
    { title: "Expiry", key: "expiry_date" },
    { title: "Verify", key: "is_verified" },
    { title: "Status", key: "status" },
  ];

onMounted(() => {
  fetchUserDocuments(userId); 
});

</script>
<template>
  <v-card>
    <v-card-title class="border-b-sm d-flex justify-end">
      <VBtn @click="agentDocument = true">Add Documents</VBtn>
    </v-card-title>
    <v-card-text class="px-0">
      <v-data-table :headers="headers" :items="userDocuments" item-key="name" hide-default-footer
        class="border-t-sm border-b-sm">
        <template #item.sr="{ index }">
          {{ index + 1 }}
        </template>
         <template #item.is_verified="{ item }">
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            <VChip :color="item?.is_verified === 'Yes' ? 'success' : 'warning'" class="font-weight-light fs-12 p-1" size="small">
              {{ item?.is_verified === 'Yes' ? "Yes" : "No" }}
            </VChip>
          </p>
        </template>
        <template #item.status="{ item }">
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            <VChip :color="item?.is_verified === 'Yes' ? 'success' : 'error'" class="font-weight-light fs-12 p-1" size="small">
              {{ item?.is_verified === 'Yes' ? "Approved" : "Not Approved" }}
            </VChip>
          </p>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
  <div class="text-center">
    <!-- Dialog -->
    <v-dialog v-model="agentDocument" max-width="1000" transition="scale-transition">
      <v-card>
        <v-row>
          <v-col cols="12">
            <v-card-title class="d-flex align-center justify-space-between" style="background-color: lightgray;">
              <h4 class="text-h4 py-3">Add Documents</h4>
              <IconBtn @click="agentDocument = false">
                <VIcon icon="tabler-x" />
              </IconBtn>
            </v-card-title>
          </v-col>
        </v-row>
        <V-card-text>
          <VForm @submit.prevent="submitForm" ref="formRef">
            <v-row class="ps-0">
              <v-col cols="12" sm="6" md="6">
                <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Document Name')"></span>
                <AppAutocomplete name="documentType" v-model="documentType" :items="documentTypes" item-title="title"
                  item-value="title" placeholder="Type" :rules="[requiredValidator]" />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <span class="fs-15 label-color font-weight-medium">Document No
                </span>
                <AppTextField name="documentNumber" v-model="documentNumber" placeholder="1234567" />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Issuance Date')"></span>
                <AppDialogDate name="issuanceDate" v-model="issuanceDate" placeholder="Issuance Date"
                  :rules="[requiredValidator]" />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Expiry Date')"></span>
                <AppDialogDate name="expiryDate" v-model="expiryDate" placeholder="Expiry Date"
                  :rules="[requiredValidator]" />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Front Side')"></span><span
                  class="text-red"> (jpg,png,pdf,doc,docx)</span>
                <VFileInput chips multiple :rules="[requiredValidator]" v-model="frontFiles"
                  label="Choose front files" />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <span class="fs-15 label-color font-weight-medium">Back Side</span><span class="text-red">
                  (jpg,png,pdf,doc,docx)</span>
                <VFileInput chips multiple v-model="backFiles" label="Choose back files" />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Issue Country')"></span>
                <AppAutocomplete name="issueCountry" v-model="issueCountry" placeholder="Algeria" :items="countries"
                  item-title="name" item-value="id" :rules="[requiredValidator]" />
              </v-col>
              <VCol cols="12" md="12" class="d-flex gap-2 align-end justify-end">
                <VBtn type="reset" color="secondary" variant="tonal">
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
    </v-dialog>
  </div>
</template>
