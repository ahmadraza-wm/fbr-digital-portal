<script setup>
import { useBeneficiary } from "@/composables/useBeneficiary";
import Companylogo from "@images/logos/logo.png";
import { ref, watch } from "vue";
const permissionStore = usePermissionStore()
const {
  fetchCustomerById,
  fetchCustomerDocuments,
  fetchCustomers,
  documentTypes,
  countries,
  uploadCustomerDocuments,
} = useBeneficiary();

const formRef = ref(null);
const customerDocumentsList = ref([]);
const emit = defineEmits(['refetchSenderDocuments']);


const documentType = ref("");
const documentNumber = ref("");
const issuanceDate = ref("");
const expiryDate = ref("");
const issuerAuthority = ref("");
const issueCountry = ref("");
const frontFiles = ref([]);
const backFiles = ref([]);
const customer = ref(null);
const beneficiaryDocument = ref(false);
const verifyDocument = ref(false);
const frontView = ref(false);
const backView = ref(false);

const frontImage = ref(null);
const backImage = ref(null);

const isVerified = ref(false);

function toggleVerification() {
  isVerified.value = !isVerified.value;
}
const props = defineProps({
  beneficiary: {
    type: Array,
    default: () => [],
  },
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
  actionBtn: {
    type: Boolean,
    default: false,
  },
  beneficiary_id: {
    type: [String, Number],
    required: true,
  },
});

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
    force_fetch:true
  };
  await uploadCustomerDocuments(props.beneficiary_id, payload);
  emit("refetchSenderDocuments");
  formRef.value.reset();
  beneficiaryDocument.value = false;
};

watch(
  () => props.beneficiary_id,
  async (newId) => {
    const force_fetch = true;
    if (newId) {
      customer.value = await fetchCustomerById(newId, force_fetch);
      customerDocumentsList.value = await fetchCustomerDocuments(newId, force_fetch);
      fetchCustomers({force_fetch});
    }
  },
  { immediate: true }
);
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
      <h4 class="text-h5 py-3">Beneficiary Documents</h4>
      <VBtn color="primary" variant="elevated" prepend-icon="tabler-plus" @click="beneficiaryDocument = true" v-if="permissionStore.hasPermission('beneficiary.document.upload')">Add
        Documents</VBtn>
    </v-card-title>
    <VCardText class="px-0 pb-0">
      <VTable class="text-no-wrap" :height="customerDocumentsList.length > 5 ? '310px' : '100%'" fixed-header>
        <thead>
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>Number</th>
            <th>Issuance date</th>
            <th>Expiry date</th>
            <th>Issuer Country</th>
            <th v-if="showSQC">SQC.</th>
            <!-- <th>Status</th> -->
            <th>View</th>
            <th v-if="actionBtn">Action</th>
          </tr>
        </thead>
        <tbody class="pb-2 text-color font-weight-medium">
          <tr v-for="(doc, index) in customerDocumentsList" :key="doc.id">
            <td>{{ index + 1 }}</td>
            <td>
              {{ doc.type }}
              <p :style="{
                color: doc.type === 'Passport' ? '#28C76F' : '#FF9F43',
              }" class="font-weight-light fs-12 mb-0" size="small">
                <VIcon icon="tabler-point-filled" />
                {{ doc.type === "Passport" ? "Primary" : "Not Primary" }}
              </p>
            </td>
            <td>
              {{ doc.number }}
              <p :style="{
                color: 'active' === 'active' ? '#28C76F' : '#FF9F43',
              }" class="font-weight-light fs-12 mb-0" size="small">
                <VIcon icon="tabler-point-filled" />
                Active
              </p>
            </td>
            <td>{{ doc.issue_date }}</td>
            <td>{{ doc.expiry_date }}</td>
            <td>{{ doc.country }}</td>
            <td v-if="showSQC">P</td>
            <!-- <td>
              <VChip
                :style="{
                  backgroundColor:
                    doc.is_verified === 'Yes' ? '#28C76F29' : '#FF9F4329',
                  color: doc.is_verified === 'Yes' ? '#28C76F' : '#FF9F43',
                  marginLeft: '8px',
                  marginTop: '5px',
                }"
                class="font-weight-light fs-12 p-1"
                size="small"
              >
                {{ doc.is_verified === "Yes" ? "Verified" : "Unverified" }}
              </VChip>
            </td> -->
            <td>
              <NuxtLink @click="
                frontImage = doc.media[0]?.url;
              frontView = true;
              " class="cursor-pointer me-2" v-if="doc.media[0]?.url">
                <VIcon icon="tabler-credit-card" />
              </NuxtLink>
              <NuxtLink @click="
                backImage = doc.media[1]?.url;
              backView = true;
              " class="cursor-pointer" v-if="doc.media[1]?.url">
                <VIcon icon="tabler-credit-card" />
              </NuxtLink>
            </td>
            <td v-if="actionBtn">
              <div class="d-flex gap-1">
                <NuxtLink class="pt-2 cursor-pointer" :class="isVerified ? 'text-error' : 'text-success'"
                  @click="verifyDocument = true">
                  {{ isVerified ? "Unverify" : "Verify" }}
                </NuxtLink>
                <VBtn icon variant="text" :to="`/customers/documents/edit-document/${doc.id}`" target="_blank"
                  color="medium-emphasis">
                  <VIcon icon="tabler-edit" />
                </VBtn>
                <VBtn icon variant="text" color="medium-emphasis">
                  <VIcon icon="tabler-trash" />
                </VBtn>
              </div>
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>
  <!--Beneficiary Add Document  pop up design by usman faiz -->
  <div class="text-center">
    <!-- Dialog -->
    <v-dialog v-model="beneficiaryDocument" max-width="1000" transition="scale-transition">
      <v-card>
        <v-row>
          <v-col cols="12">
            <v-card-title class="d-flex align-center justify-space-between" style="background-color: lightgray;">
              <h4 class="text-h4 py-3">Beneficiary Documents</h4>
              <IconBtn @click="beneficiaryDocument = false">
                <VIcon icon="tabler-x" />
              </IconBtn>
            </v-card-title>
          </v-col>
        </v-row>

        <v-card-text class="px-0">
          <v-row class="border-b-sm px-5">
            <v-col cols="12" sm="6" md="3" class="pb-1">
              <p class="font-weight-medium text-color mb-0 lh-22">
                Beneficiary ID
              </p>
              <p class="font-weight-medium mb-0 lh-22 text-color1">
                {{ customer?.id || "---" }}
              </p>
            </v-col>
            <v-col cols="12" sm="6" md="3" class="pb-1">
              <p class="font-weight-medium text-color mb-0 lh-22">Name</p>
              <p class="font-weight-medium mb-0 lh-22 text-color1">
                {{ customer?.name || "---" }}
              </p>
            </v-col>
            <v-col cols="12" sm="6" md="3" class="pb-1">
              <p class="font-weight-medium text-color mb-0 lh-22">Phone</p>
              <p class="font-weight-medium mb-0 lh-22 text-color1">
                {{ customer?.phone_number || "---" }}
              </p>
            </v-col>
            <v-col cols="12" sm="6" md="3" class="pb-1">
              <p class="font-weight-medium text-color mb-0 lh-22">Address</p>
              <p class="font-weight-medium mb-0 lh-22 text-color1">
                {{ customer?.address || "---" }}
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
                {{ customer?.country || "---" }}
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
                  item-value="title" placeholder="Type" :rules="[requiredValidator]" />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <span class="fs-15 label-color font-weight-medium">Document No
                      <span class="text-red" v-if="documentType == 'Passport' || documentType == 'ID Card'">*</span>
                </span>
                <AppTextField name="documentNumber" v-model="documentNumber" placeholder="1234567" 
                 :rules="documentType == 'Passport' || documentType == 'ID Card' ? [requiredValidator] : []"
                />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Issuance Date')"></span>
                <AppDialogDate name="issuanceDate" v-model="issuanceDate" placeholder="Issuance Date" :rules="[requiredValidator]"  />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Expiry Date')"></span>
                <AppDialogDate name="expiryDate" v-model="expiryDate" placeholder="Expiry Date" :rules="[requiredValidator]"  />
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
                <AppTextField name="issuerAuthority" v-model="issuerAuthority" placeholder="Type..." />
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
                  Add Documents
                </VBtn>
              </VCol>
            </v-row>
          </VForm>
        </V-card-text>
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
            <div class="d-flex justify-center">
              <ImageViewer :imageUrl="frontImage" v-if="frontView" class="w-100" />
            </div>
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
            <div class="d-flex justify-center">
              <ImageViewer :imageUrl="backImage" v-if="backView" class="w-100" />
            </div>
          </VCol>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
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
                <th>Issuance date</th>
                <th>Expiry date</th>
              </tr>
            </thead>
            <tbody class="pb-2">
              <tr>
                <td>Id Card</td>
                <td>G3799231</td>
                <td>28 Sep, 2022</td>
                <td>27 Sep, 2032</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Passport</td>
                <td>G3799231</td>
                <td>MONZO</td>
                <td>28 Sep, 2022</td>
              </tr>
            </tbody>
          </VTable>
        </v-card-text>
        <v-card-text>
          <VCol cols="12">
            <p class="fs-16 font-weight-medium">Front</p>
            <img :src="Companylogo" alt="Logo Image" class="ma-auto" />
          </VCol>
          <VCol cols="12">
            <p class="fs-16 font-weight-medium">Back</p>
            <img :src="Companylogo" alt="Logo Image" class="ma-auto" />
          </VCol>
        </v-card-text>
        <v-card-text>
          <VCol class="text-end">
            <VBtn color="primary" @click="
              () => {
                toggleVerification();
                verifyDocument = false;
              }
            ">Approve</VBtn>
          </VCol>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
