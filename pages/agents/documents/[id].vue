<script setup>
import BackNavigation from "@/@core/components/BackNavigation.vue";
import AgentDocument from '@/components/agents/AgentDocument.vue';
import { useAgents } from "@/composables/useAgents";
import { ref, watch } from 'vue';
import { useRoute } from "vue-router";
import { VFileInput } from "vuetify/components";
import AuditLog from '@/components/AuditLog.vue'
const countryCurrencyStore = useCountryCurrencyStore();
const { countries, currencies } = storeToRefs(countryCurrencyStore);

const selectedDocType = ref(null)
const formRef = ref(null);
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

const editDocument = (doc) => {
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
}

const agent = ref(null);
const route = useRoute();

const issuanceError = ref('')
const expiryError = ref('')

// Validators
const validateIssuanceDate = () => {
  issuanceError.value = ''

  if (!issuanceDate.value || !expiryDate.value) return true

  if (new Date(issuanceDate.value) >= new Date(expiryDate.value)) {
    expiryDate.value = ''
    return false
  }

  return true
}

const validateExpiryDate = () => {
  expiryError.value = ''

  if (!expiryDate.value || !issuanceDate.value) return true

  if (new Date(expiryDate.value) <= new Date(issuanceDate.value)) {
    expiryError.value = 'Expiry date must be after issuance date'
    issuanceError.value = '' // remove issuance error if expiry is invalid
    return false
  }

  return true
}

// Watch for changes and re-validate
watch(issuanceDate, () => {
  validateIssuanceDate()
})

watch(expiryDate, () => {
  validateExpiryDate()
})


const {
  agents,
  fetchAgentById,
  updateDocumentStatus,
  documents,
  uploadAgentDocuments,
  fetchAgentDocuments,
} = useAgents();



const openFrontImage = () => {
  if (frontFiles.value.length) {
    const fileUrl = URL.createObjectURL(frontFiles.value[0])
    window.open(fileUrl, '_blank')
  } else {
    alert('Please upload a front side image first.')
  }
}

const openBackImage = () => {
  if (backFiles.value.length) {
    const fileUrl = URL.createObjectURL(backFiles.value[0])
    window.open(fileUrl, '_blank')
  } else {
    alert('Please upload a back side image first.')
  }
}





onMounted(async () => {
  const id = route.params.id;
  agent.value = await fetchAgentById(id);
  fetchAgentDocuments(id);
});



const docType = [
  { title: "Passport", value: "Passport" },
  { title: "Licence", value: "Driving Licence" },
  { title: "ID-Card", value: "ID-Card" }
]
const country = [
  { "title": "Afghanistan", "value": "Afghanistan" },
  { "title": "Albania", "value": "Albania" },
  { "title": "Algeria", "value": "Algeria" },
  { "title": "Andorra", "value": "Andorra" },
  { "title": "Angola", "value": "Angola" },
  { "title": "Antigua and Barbuda", "value": "Antigua and Barbuda" },
  { "title": "Argentina", "value": "Argentina" },
  { "title": "Armenia", "value": "Armenia" },
  { "title": "Australia", "value": "Australia" },
  { "title": "Austria", "value": "Austria" },
  { "title": "Azerbaijan", "value": "Azerbaijan" },
  { "title": "Bahamas", "value": "Bahamas" },
  { "title": "Bahrain", "value": "Bahrain" },
  { "title": "Bangladesh", "value": "Bangladesh" },
  { "title": "Barbados", "value": "Barbados" },
  { "title": "Belarus", "value": "Belarus" },
  { "title": "Belgium", "value": "Belgium" },
  { "title": "Belize", "value": "Belize" },
  { "title": "Benin", "value": "Benin" },
  { "title": "Bhutan", "value": "Bhutan" },
  { "title": "Bolivia", "value": "Bolivia" },
  { "title": "Bosnia and Herzegovina", "value": "Bosnia and Herzegovina" },
  { "title": "Botswana", "value": "Botswana" },
  { "title": "Brazil", "value": "Brazil" },
  { "title": "Brunei", "value": "Brunei" },
  { "title": "Bulgaria", "value": "Bulgaria" },
  { "title": "Burkina Faso", "value": "Burkina Faso" },
  { "title": "Burundi", "value": "Burundi" }
]
const resetForm = () => {
  documentType.value = null
  documentNumber.value = ''
  issuanceDate.value = null
  expiryDate.value = null
  frontFiles.value = []
  backFiles.value = []
  issuerAuthority.value = ''
  issueCountry.value = null


  isEditMode.value = false
  selectedDocumentId.value = null;
  hideFileInputs.value = false
}


const submitForm = async () => {
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


  // Include files only if not editing
  if (!isEditMode.value) {
    payload.front_files = frontFiles.value;
    payload.back_files = backFiles.value;
  }


  await uploadAgentDocuments(route.params.id, payload, isEditMode.value, selectedDocumentId.value);

  formRef.value.reset();
};
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex align-center" style="background-color: lightgrey;">
          <BackNavigation />
          <h4 class="text-h5 py-4">Agent Documents</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="px-0 pt-0">
      <v-row class="border-b-md px-5">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Email</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1"> {{ agent?.email || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Name</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ agent?.name || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Gender</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ agent?.gender || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Phone</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ agent?.phone || "---" }}</p>
        </v-col>
      </v-row>
      <v-row class="border-b-md px-5">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Code/Prefix</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ agent?.agent_code || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Status</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            <VChip :style="{
              backgroundColor:
                agent?.status == 1 ? '#28C76F29' : '#FF9F4329',
              color: agent?.status == 1 ? '#28C76F' : '#FF9F43',

              marginTop: '2px',
            }" class="font-weight-light fs-12 p-1" size="small">
              {{ agent?.status == 1 ? "Active" : "Inactive" }}
            </VChip>
          </p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Type</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ agent?.type || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Main Agent</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ agent?.main_agent_name }}</p>
        </v-col>
      </v-row>
      <v-row class="border-b-md px-5">

        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Country</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{countries.find(c => c.id === agent?.country_id)?.name
            || '------'}}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">City</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ agent?.city || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Nationality</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ agent?.nationality || "---" }}</p>
        </v-col>

      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card-text class="px-4 py-0">
            <VForm @submit.prevent="submitForm" ref="formRef">
              <VRow>
                <VCol cols="12" md="6">
                  <span class="fs-13 label-color">Type<span class="text-red">*</span></span>
                  <AppAutocomplete :items="docType" v-model="documentType" placeholder="Select type"
                    :rules="[requiredValidator]" />
                </VCol>
                <VCol cols="12" md="6">
                  <span class="fs-13 label-color">
                    Document No
                    <span class="text-red" v-if="documentType == 'Passport' || documentType == 'ID-Card'">*</span>
                  </span>
                  <AppTextField placeholder="Document #" type="text" v-model="documentNumber"
                    :rules="documentType == 'Passport' || documentType == 'ID-Card' ? [requiredValidator] : []" />
                </VCol>
                <VCol cols="12" md="6">
                  <span class="fs-13 label-color">Issuance Date<span class="text-red">*</span></span>
                  <AppDateTimePicker name="issuanceDate" v-model="issuanceDate" placeholder="dd-mm-yyyy"
                    :config="{ dateFormat: 'd-m-Y' }" :rules="[requiredValidator]" />
                  <div v-if="issuanceError" class="text-red text-sm mt-1">{{ issuanceError }}</div>
                </VCol>

                <VCol cols="12" md="6">
                  <span class="fs-13 label-color">Expiry Date<span class="text-red">*</span></span>
                  <AppDateTimePicker name="expiryDate" v-model="expiryDate" placeholder="dd-mm-yyyy"
                    :config="{ dateFormat: 'd-m-Y' }" :rules="[requiredValidator]" />
                  <div v-if="expiryError" class="text-red text-sm mt-1">{{ expiryError }}</div>
                </VCol>

                <VCol cols="12" md="6" v-if="!hideFileInputs">
                  <span class="fs-13 label-color font-weight-medium" v-html="requiredLabel('Front Side')"></span><span class="text-red"> (jpg,png,pdf,doc,docx)</span>
                  <div class="d-flex gap-1">
                    <VFileInput chips :rules="[requiredValidator]" multiple v-model="frontFiles" />
                    <VBtn color="primary" variant="elevated" v-if="!hideFileInputs" @click="openFrontImage">Front Side
                    </VBtn>
                  </div>
                </VCol>
                <VCol cols="12" md="6" v-if="!hideFileInputs">
                  <span class="fs-13 label-color font-weight-medium">Back Side</span><span class="text-red"> (jpg,png,pdf,doc,docx)*</span>
                  <div class="d-flex gap-1">
                    <VFileInput chips multiple v-model="backFiles" />
                    <VBtn color="primary" variant="elevated" v-if="!hideFileInputs" @click="openBackImage">Back Side
                    </VBtn>
                  </div>
                </VCol>
                <VCol cols="12" md="6">
                  <span class="fs-13 label-color">Issuer Authority</span>
                  <AppTextField placeholder="Issuer authority" v-model="issuerAuthority" />
                </VCol>
                <VCol cols="12" md="6">
                  <span class="fs-13 label-color">Issuer Country</span><span class="text-red">*</span>
                  <AppAutocomplete placeholder="Select Country" v-model="issueCountry" :items="countries" :rules="[requiredValidator]" 
                    item-title="name" item-value="id" />
                </VCol>
                <VCol cols="12" class="d-flex gap-4 justify-end">
                  <VBtn type="reset" color="secondary" variant="tonal" @click="resetForm"> Reset </VBtn>
                  <VBtn type="submit" variant="tonal" class="login-btn" :loading="loading">
                    {{ isEditMode ? 'Update Document' : 'Add Document' }}
                  </VBtn>
                </VCol>
              </VRow>
            </VForm>
          </v-card-text>

        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <AgentDocument :documents="documents" :updateDocumentStatus="updateDocumentStatus" :agentId="route.params.id"
    @editDocument="editDocument" :isView="true" />

  <AuditLog module="Document" :id="route.params.id" class="mt-4"/>
  
</template>
