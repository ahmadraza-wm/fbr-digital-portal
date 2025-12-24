<script setup>
import { useCustomer } from "@/composables/useCustomer";
import useUiFeedback from "@/composables/useUiFeedback";
import EditDocumentForm from "@/pages/customers/edit-documents/edit-form.vue";
import { defineProps, ref, watch } from "vue";
const permissionStore = usePermissionStore()
const { $axios } = useNuxtApp();

const {
  fetchCustomerById,
  documents,
  fetchCustomerDocuments,
  uploadCustomerDocuments,
  senderdocumentTypes,
  documentTypes,
  countries,
} = useCustomer();

const {
  loading,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  confirmAction,
} = useUiFeedback();

const emit = defineEmits(["refetchSenderDocuments"]);

const props = defineProps({
  colorClass: {
    type: String,
    default: "bg-grey",
  },
  showSQC: {
    type: Boolean,
    default: false,
  },
  showView: {
    type: Boolean,
    default: false,
  },
  showStatus: {
    type: Boolean,
    default: false,
  },
  customer: {
    type: Array,
    required: true,
  },
  customer_id: {
    type: [String, Number],
    required: true,
  },
});

const customerDocumentsList = ref([]);

const senderDocument = ref(false);
const customerID = ref(null);
const documentType = ref("");
const documentNumber = ref("");
const issuanceDate = ref("");
const expiryDate = ref("");
const issuerAuthority = ref("");
const issueCountry = ref("");
const frontFiles = ref([]);
const backFiles = ref([]);
const selectedDocument = ref(null);


const isEditModalOpen = ref(false);
const selectedDocumentId = ref(null);

const customer = ref(null);
const formRef = ref(null);

function openVerifyDialog(doc) {
  selectedDocument.value = doc;
  verifyDocument.value = true;
}


// function openFrontView(doc) {
//   selectedDocument.value = doc;
//   frontView.value = true;
// }

// function openBackView(doc) {
//   selectedDocument.value = doc;
//   backView.value = true;
// }

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


const openEditModal = (id) => {
  selectedDocument.value = id;
  isEditModalOpen.value = true;
};

console.log('selected document id', selectedDocument.value);

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
  const success = await uploadCustomerDocuments(props.customer_id, payload);
  console.log('success', success);
  if (success) {
    emit("refetchSenderDocuments");
    formRef.value.reset();
    senderDocument.value = false;
  }
};

const verifyDocument = ref(false);
const frontView = ref(false);
const backView = ref(false);
const isVerified = ref(false);

async function verifySelectedDocument() {
  if (!selectedDocument.value) return;

  const isVerified = selectedDocument.value.is_verified !== "Yes";

  try {
    await $axios.patch(
      `/customer/document/verify/${selectedDocument.value.id}`,
      {
        is_verified: isVerified,
      }
    );
    showSuccess("Document verified ");

    verifyDocument.value = false;
    emit("refetchSenderDocuments");
  } catch (err) {
    console.error("Verification failed", err);
  }
}

const deletePartner = async (id) => {
  confirmAction("Are you sure you want to delete this document?", async () => {
    try {
      await $axios.delete(`/customer/document/delete/${id}`);
      showSuccess("Document deleted successfully");
      emit("refetchSenderDocuments");
    } catch (error) {
      showError("Failed to delete document.");
      console.error(error);
    } finally {
      hideLoading();
    }
  });
};

function toggleVerification() {
  isVerified.value = !isVerified.value;
}

watch(
  () => props.customer_id,
  async (newId) => {
    if (newId) {
      customer.value = await fetchCustomerById(newId);
      const SenderDocuments = await fetchCustomerDocuments(newId);
      customerDocumentsList.value = SenderDocuments.filter(doc => doc.category === 'Identification');

    }
  },
  { immediate: true }
);


async function refetchSenderDocuments() {
  console.log("Refetching with ID:", props.customer_id);
  const SenderDocuments = await fetchCustomerDocuments(props.customer_id);
  customerDocumentsList.value = SenderDocuments.filter(doc => doc.category === 'Identification');
}

</script>

<template>
  <VCard class="my-5 border">
    <v-card-title :class="[
      'border-b-sm',
      'd-flex',
      'align-center',
      'justify-space-between',
      colorClass, 'bg-grey'
    ]">
      <h4 class="text-h5 py-3">Sender Documents</h4>
      <VBtn color="primary" variant="elevated" prepend-icon="tabler-plus" @click="senderDocument = true" v-if="permissionStore.hasPermission('customer.document.upload')">
        Add Documents
      </VBtn>
    </v-card-title>
    <VCardText class="px-0 pb-0">
      <VTable class="text-no-wrap" :height="customerDocumentsList.length > 5 ? '310px' : '100%'" fixed-header

>
        <thead>
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>ID Ref No.</th>
            <th>Issuance date</th>
            <th>Expiry date</th>
            <th>Issuer Country</th>
            <th>Created At</th>
            <th v-if="showSQC">SQC.</th>
            <th>Status</th>

            <th>View</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody class="text-color font-weight-medium">
          <tr v-for="(doc, index) in customerDocumentsList" :key="doc.id">
            <td>{{ index + 1 }}</td>
            <td>
              {{ doc.type }}
              <p :style="{ color: '#28C76F' }" class="font-weight-light fs-12 mb-0">
                <VIcon icon="tabler-point-filled" /> Primary
              </p>
            </td>
            <td>
              {{ doc.number }}
              <p :style="{ color: '#28C76F' }" class="font-weight-light fs-12 mb-0">
                <VIcon icon="tabler-point-filled" /> Active
              </p>
            </td>
            <td>{{ doc.issue_date }}</td>
            <td>{{ doc.expiry_date }}</td>
            <td>{{ doc.country }}</td>
            <td>{{ doc.created_at }}</td>
            <td v-if="showSQC">P</td>
            <td>
              <VChip :style="{
                backgroundColor:
                  doc.is_verified == 'Yes' ? '#28C76F29' : '#FF9F4329',
                color: doc.is_verified == 'Yes' ? '#28C76F' : '#FF9F43',
              }" class="font-weight-light fs-12 p-1" size="small">
                {{ doc.is_verified === "Yes" ? "Verified" : "Unverified" }}
              </VChip>
            </td>

            <td>
              <!-- <template v-if="doc.media && doc.media.length">
                <NuxtLink v-for="(mediaItem, mediaIndex) in doc.media" :key="mediaIndex" :to="mediaItem.url"
                  target="_blank" class="cursor-pointer me-2">
                  <VIcon icon="tabler-credit-card" />
                </NuxtLink>
              </template>
<span v-else>-</span> -->
              <template v-if="doc.media && doc.media.length">
                  <VBtn icon @click="openFrontView(doc)" class="me-2" variant="text"  v-if="doc.media[0]?.url">
                  <VIcon icon="tabler-credit-card" />
                </VBtn>
                <VBtn icon @click="openBackView(doc)" variant="text"  v-if="doc.media[1]?.url">
                  <VIcon icon="tabler-credit-card" />
                </VBtn>
              </template>
              <span v-else>-</span>
            </td>

            <td>
              <div class="d-flex gap-1">
                <NuxtLink class="pt-2 cursor-pointer" :class="doc.is_verified == 'Yes' ? 'text-error' : 'text-success'
                  " @click="openVerifyDialog(doc)" v-if="permissionStore.hasPermission('customer.documents.verify')">
                  {{ doc.is_verified == "Yes" ? "Unverify" : "Verify" }}
                </NuxtLink>

                <VBtn icon variant="text" @click="openEditModal(doc.id)" color="medium-emphasis" v-if="permissionStore.hasPermission('customer.document.update')">
                  <VIcon icon="tabler-edit" />
                </VBtn>

                <VBtn icon variant="text" color="medium-emphasis" @click="deletePartner(doc.id)" class="d-none">
                  <VIcon icon="tabler-trash" />
                </VBtn>


              </div>
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>

  <v-dialog v-model="isEditModalOpen" max-width="900">
    <v-card>
      <v-card-title class="d-flex justify-space-between pt-4 pb-2 px-6 border-b-sm">
        <h4 class="text-h4"> Edit Document
        </h4>
        <VIcon icon="tabler-x" @click="isEditModalOpen = false" />
      </v-card-title>
      <v-card-text class="pt-4">
        <!-- Use the same edit-documents page component -->
        <EditDocumentForm :documentIdProp="selectedDocument" :documentTypesProp="senderdocumentTypes"
          @refetchSenderDocuments="refetchSenderDocuments" @closeModal="isEditModalOpen = false" />
      </v-card-text>
    </v-card>
  </v-dialog>
  <!--Sender Add Document  pop up design by usman faiz -->
  <div class="text-center">
    <!-- Dialog -->
    <v-dialog v-model="senderDocument" max-width="1000" transition="scale-transition">
      <v-card>
        <v-row>
          <v-col cols="12">
            <v-card-title class="d-flex align-center justify-space-between" style="background-color: lightgray;">
              <h4 class="text-h4 py-3">Customer Documents</h4>
              <IconBtn @click="senderDocument = false">
                <VIcon icon="tabler-x" />
              </IconBtn>
            </v-card-title>
          </v-col>
        </v-row>

        <v-card-text class="px-0">
          <v-row class="border-b-sm px-5">
            <v-col cols="12" sm="6" md="3" class="pb-1">
              <p class="font-weight-medium text-color mb-0 lh-22">
                Customer ID
              </p>
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
                <AppAutocomplete name="documentType" v-model="documentType" :items="senderdocumentTypes"
                  item-title="title" item-value="title" placeholder="Type" :rules="[requiredValidator]"
                  autocomplete="off" />
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
                <AppDialogDate name="issuanceDate" v-model="issuanceDate" placeholder="dd/mm/yyyy"
                  :rules="[requiredValidator]" autocomplete="off" />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Expiry Date')"></span>
                <AppDialogDate name="expiryDate" v-model="expiryDate" placeholder="dd/mm/yyyy"
                  :rules="[requiredValidator]" autocomplete="off" />
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
                <AppTextField name="issuerAuthority" v-model="issuerAuthority" placeholder="Type..."
                  autocomplete="off" />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Issue Country')"></span>
                <AppAutocomplete name="issueCountry" v-model="issueCountry" placeholder="Algeria" :items="countries"
                  item-title="name" item-value="id" :rules="[requiredValidator]" autocomplete="off" />
              </v-col>
              <VCol cols="12" md="12" class="d-flex gap-2 align-end justify-end">
                <VBtn type="reset" color="secondary" variant="tonal">
                  Reset
                </VBtn>
                <VBtn type="submit" class="login-btn" variant="tonal">
                  Add Documents
                </VBtn>
              </VCol>
            </v-row>
          </VForm>
        </V-card-text>
      </v-card>
    </v-dialog>
  </div>
  <!--Verify Document pop up design by usman faiz -->
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
          <VCol class="text-end">
            <VBtn color="primary" @click="verifySelectedDocument">
              Approve
            </VBtn>
          </VCol>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
  <!---Front View of document show in pop up--->
  <div class="text-center">
    <!-- Dialog -->
    <v-dialog v-model="frontView" max-width="1000" transition="scale-transition">
      <v-card>
        <v-row>
          <v-col cols="12">
            <v-card-title class="d-flex align-center justify-space-between" style="background-color: lightgray;">
              <h4 class="text-h4 py-3">Front View</h4>
              <IconBtn @click="frontView = false">
                <VIcon icon="tabler-x" />
              </IconBtn>
            </v-card-title>
          </v-col>
        </v-row>
        <v-card-text>
          <VCol cols="12">
            <!-- <img :src="selectedDocument?.media?.[0]?.url || ''" alt="Logo Image" class="ma-auto" /> -->
            <ImageViewer :imageUrl="selectedDocument?.media?.[0]?.url || ''" />
          </VCol>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
  <!---BackView of document show in pop up--->
  <div class="text-center">
    <!-- Dialog -->
    <v-dialog v-model="backView" max-width="1000" transition="scale-transition">
      <v-card>
        <v-row>
          <v-col cols="12">
            <v-card-title class="d-flex align-center justify-space-between" style="background-color: lightgray;">
              <h4 class="text-h4 py-3">Back View</h4>
              <IconBtn @click="backView = false">
                <VIcon icon="tabler-x" />
              </IconBtn>
            </v-card-title>
          </v-col>
        </v-row>
        <v-card-text>
          <VCol cols="12">
            <!-- <img :src="selectedDocument?.media?.[1]?.url || ''" alt="Logo Image" class="ma-auto" /> -->
            <ImageViewer :imageUrl="selectedDocument?.media?.[1]?.url || ''" />
          </VCol>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
