<script setup>
import { defineProps } from "vue";
import { ref, watch } from "vue";

import useUiFeedback from "@/composables/useUiFeedback";
import { useCustomer } from "@/composables/useCustomer";
const permissionStore = usePermissionStore()

const { $axios } = useNuxtApp();
const kycNotes = ref([
  { title: "YES", value: 1 },
  { title: "No", value: 0 },
]);
const updateEKYC = ref(false);
const ekycVerifiedStatus = ref("Select Status");
const emit = defineEmits(["refetchSenderDocuments"]);

const {
  fetchCustomerById,
} = useCustomer();

const {
  loading,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  confirmAction,
} = useUiFeedback();

const headers = [
  {
    title: "CUSTOMER REMARKS",
    value: "note",
  },
  {
    title: "CATEGORY",
    value: "category",
  },
  {
    title: "ATTACHMENT",
    value: "attachment",
  },
  {
    title: "iSSUANCE DATE",
    value: "issuance_date",
  },
  {
    title: "EXPIRY DATE",
    value: "expiry_date",
  },
  {
    title: "ADDED BY",
    value: "created_by",
  },
  {
    title: "PAYMENT #",
    value: "transaction_code",
  },
  {
    title: "CREATED AT",
    value: "created_at",
  },
];

const categories = [
  {
    title: "Initial Due Deligence",
    value: "initial_due_diligence",
  },
  {
    title: "Enhance Due Deligence",
    value: "enhance_due_diligence",
  },
  {
    title: "Commitments",
    value: "commitments",
  },
  {
    title: "Deposit",
    value: "deposit",
  },
  {
    title: "Multiple transactions/ Beneficiaries",
    value: "multiple_transactions_beneficiaries",
  },
  {
    title: "SAR (Suspicious Activity Report)",
    value: "sar_(suspicious_activity_report)",
  },
  {
    title: "Cancellations",
    value: "cancellations",
  },
  {
    title: "Others",
    value: "others",
  },
];

// const requiredValidator = (v) => !!v || "This field is required";
const requiredValidator = (v) => v !== null && v !== undefined && v !== '' ? true : "This field is required";


const notesss = ref(false);
const selectedCategory = ref("");
const noteText = ref("");
const files = ref([]);
const verifiedTillDate = ref(null);
const verifiedAddressTillDate = ref(null);
const issuanceDate = ref(null);
const expiryDate = ref(null);

const previewDialog = ref(false);
const previewFile = ref(null);

const options = ref({
  itemsPerPage: 5,
  page: 1,
});

const kycNotesList = ref([]);


const props = defineProps({
  kyc_notes: {
    type: Array,
    default: () => [],
  },
  customer_id: {
    type: Number,
    required: true,
  },
  transaction_id: {
    type: Number,
    default: null,
  },
});

const saveNote = async () => {
  if (!selectedCategory.value || !noteText.value || !files.value) {
    showError("Category, Attachment and Note are required");
    return;
  }

if (updateEKYC.value) {
  if (
    ekycVerifiedStatus.value === null ||
    ekycVerifiedStatus.value === undefined ||
    ekycVerifiedStatus.value === "Select Status"
  ) {
    showError("E-KYC Verified Status is required");
    return;
  }

  if (ekycVerifiedStatus.value === 1 && !verifiedTillDate.value) {
    showError("Verified Till date is required when E-KYC is YES");
    return;
  }
}


  if (files.value && (!issuanceDate.value || !expiryDate.value)) {
    showError("Issuance and Expiry Date are required with files");
    return;
  }

  const payload = new FormData();
  payload.append("customer_id", props.customer_id);
  if (props.transaction_id) {
    payload.append("transaction_id", props.transaction_id);
  }
  payload.append("category", selectedCategory.value);
  payload.append("note", noteText.value);
  // payload.append("e_kyc_update", updateEKYC.value ? "1" : "0");
  if (updateEKYC.value) {
  payload.append("e_kyc_update", "1");
  payload.append("e_kyc_status", ekycVerifiedStatus.value);
  if (ekycVerifiedStatus.value === 1) {
    payload.append("e_kyc_till_date", verifiedTillDate.value);
  }
}

  if (updateEKYC.value) {
    payload.append("e_kyc_status", ekycVerifiedStatus.value);
    if (ekycVerifiedStatus.value === 1) {
      payload.append("verified_till", verifiedTillDate.value);
      if (verifiedAddressTillDate.value) {
        payload.append("e_kyc_till_date", verifiedAddressTillDate.value);
      }
    }
  }

  if (files.value) {
    payload.append("files[]", files.value[0]);
    payload.append("issuance_date", issuanceDate.value);
    payload.append("expiry_date", expiryDate.value);
  }


  try {
    loading.value = true;
    const response = await $axios.post("kyc/notes", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    showSuccess("Notes Added successfully.");
    const customer = await fetchCustomerById(props.customer_id);
    kycNotesList.value = customer.kyc_notes || [];
    emit("refetchSenderDocuments");
    selectedCategory.value = "";
    noteText.value = "";
    files.value = null;
    updateEKYC.value = false;
    ekycVerifiedStatus.value = "Select Status";
    verifiedTillDate.value = null;
    verifiedAddressTillDate.value = null;
    issuanceDate.value = null;
    expiryDate.value = null;
    notesss.value = false;
  } catch (error) {
    const messages = error.response?.data?.errors
      ? Object.values(error.response.data.errors).flat()
      : error.response?.data?.message || "Something went wrong";
    showError(messages);
  } finally {
    loading.value = false;
  }
};

const openPreview = (url) => {
  previewFile.value = url;
  previewDialog.value = true;
};

const openImage = (item) => {
 const imageUrl = item.documents?.[0]?.media?.[0]?.url;
  if (imageUrl) {
       openPreview(imageUrl);
  } else {
    showError("No image attached to this promotion.");
  }
};
watch(
  () => props.customer_id,
  async (newId) => {
    const force_fetch = true;
    if (newId) {
      const customer = await fetchCustomerById(newId,force_fetch);
      kycNotesList.value = customer.kyc_notes || [];
    }
  },
  { immediate: true }
);
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="d-flex align-center justify-space-between bg-grey">
          <h4 class="text-h5 py-3">KYC Notes</h4>
          <!-- 👉 Add user button -->
          <VBtn color="primary" variant="elevated" class="me-3" @click="notesss = true" v-if="permissionStore.hasPermission('kyc_notes.store')">
            Add Notes
          </VBtn>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="pb-0 px-0 pt-0">
      <PaginatedDataTable :headers="headers" :items="kycNotesList" :options="options" :loading="loading"
        @update:options="(val) => (options = val)">
        <template #item.attachment="{ item }">
            <div v-if="item.documents?.[0]?.media?.[0]?.url">
              <VBtn variant="text" color="primary" @click="openImage(item)">
                View
              </VBtn>
            </div>
            <div v-else>No Attachment</div>
        </template>

        <template #item.action="{ item }">
          <div class="d-flex gap-1">
            <VBtn icon variant="text" color="medium-emphasis">
              <VIcon icon="tabler-dots-vertical" />
              <VMenu activator="parent">
                <VList>
                  <VListItem :to="'customers/view'">
                    <VListItemTitle>View</VListItemTitle>
                  </VListItem>

                  <VListItem>
                    <VListItemTitle>Edit</VListItemTitle>
                  </VListItem>
                </VList>
              </VMenu>
            </VBtn>
          </div>
        </template>
      </PaginatedDataTable>
    </v-card-text>
  </v-card>
  <!---Add Notes pop up design by usman faiz -->
  <div class="text-center">
    <!-- Dialog -->
    <v-dialog v-model="notesss" max-width="800" persistent transition="scale-transition">
      <v-card>
        <VCardTitle class="d-flex align-center justify-space-between border-b-sm bg-grey">
          <h4 class="text-h4 pt-3 mb-0">Add Notes</h4>
          <VBtn icon variant="text" color="secondary" class="px-0" @click="notesss = false">
            <VIcon icon="tabler-x" />
          </VBtn>
        </VCardTitle>
        <VCardText class="pt-2">
          <VForm>
            <VRow>
              <VCol cols="12">
                <span class="fs-13 label-color" v-html="requiredLabel('Category')"></span>
                <v-autocomplete v-model="selectedCategory" :items="categories" placeholder="Please Select"
                  :rules="[requiredValidator]" />
              </VCol>
              <VCol cols="12" md="12">
                <span class="fs-13 label-color" v-html="requiredLabel('Note')"></span>
                <AppTextarea v-model="noteText" placeholder="Type here..." rows="2" />
              </VCol>

              <VCol cols="12 ps-1">
                <VCheckbox v-model="updateEKYC" v-html="requiredLabel('Note')"
                  label="Do you also want to update E-KYC status of the customer?" />
              </VCol>
              <VCol cols="12" v-if="updateEKYC">
                <span class="fs-13 label-color" v-html="requiredLabel('E-KYC Verified Status')"></span>
                <v-autocomplete :items="kycNotes" v-model="ekycVerifiedStatus" :rules="[requiredValidator]"
                  name="status" placeholder="Select status">
                </v-autocomplete>
              </VCol>
              <V-row class="verified-date" v-if="updateEKYC && ekycVerifiedStatus === 1">
                <VCol cols="6">
                  <span class="fs-13 label-color" v-html="requiredLabel('Verified Till')"></span>
                  <AppDialogDate v-model="verifiedTillDate" :rules="[requiredValidator]" placeholder="dd/mm/yyyy" />
                </VCol>
                <VCol cols="6">
                  <span class="fs-13 label-color">Verified Address Till</span>
                  <AppDialogDate v-model="verifiedAddressTillDate" placeholder="dd/mm/yyyy" />
                </VCol>
              </V-row>
              <v-col cols="12">
                <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Attachment')"></span>
                <VFileInput chips label="Choose File" v-model="files" />
              </v-col>
              <V-row v-if="files">
                <VCol cols="6">
                  <span class="fs-13 label-color" v-html="requiredLabel('Issuance Date')"></span>
                  <AppDialogDate v-model="issuanceDate" :rules="[requiredValidator]" placeholder="dd/mm/yyyy" />
                </VCol>
                <VCol cols="6">
                  <span class="fs-13 label-color" v-html="requiredLabel('Expiry Date')"></span>
                  <AppDialogDate v-model="expiryDate" :rules="[requiredValidator]" placeholder="dd/mm/yyyy" />
                </VCol>
              </V-row>
              <VCol cols="12 d-flex gap-3 justify-end">
                <VBtn color="secondary" variant="tonal" @click="notesss = false">Discard</VBtn>
                <VBtn variant="tonal" type="submit" class="me-3 login-btn" @click.prevent="saveNote"
                  :loading="loading">
                  Add Notes
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </v-card>
    </v-dialog>
  </div>

 <v-dialog v-model="previewDialog" max-width="1000" transition="scale-transition">
  <v-card>
    <v-card-title class="d-flex justify-space-between">
      <span>Attachment Preview</span>
      <v-btn icon @click="previewDialog = false">
        <v-icon icon="tabler-x" />
      </v-btn>
    </v-card-title>

    <v-card-text class="text-center">
      <template v-if="previewFile && previewFile.endsWith('.pdf')">
        <iframe :src="previewFile" width="100%" height="600" style="border: none"></iframe>
      </template>
      <template v-else>
        <img
          :src="previewFile"
          alt="Attachment Preview"
          style="max-width: 100%; max-height: 600px"
        />
      </template>
    </v-card-text>
  </v-card>
</v-dialog>
</template>
