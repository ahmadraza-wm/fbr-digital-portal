<script setup>
import AppDateTimePicker from "@/@core/components/app-form-elements/AppDateTimePicker.vue";
import AppSelect from "@/@core/components/app-form-elements/AppSelect.vue";
import { VFileInput } from "vuetify/components";
import data from "@/views/demos/forms/tables/data-table/datatable";
import BackNavigation from "@/@core/components/BackNavigation.vue";
import { useRoute } from "vue-router";
import { useCustomer } from "@/composables/useCustomer";
import CustomerDocuments from "@/components/customers/CustomerDocuments.vue";
import useUiFeedback from "@/composables/useUiFeedback";
import EditDocumentForm from "@/pages/customers/edit-documents/edit-form.vue";
import AuditLog from '@/components/AuditLog.vue';

const { fetchCustomerById, documents, fetchCustomerDocuments,updateDocumentStatus,documentTypes } = useCustomer();
const permissionStore = usePermissionStore()
definePageMeta({
  middleware: "auth",
  permission: "customers.view"
})
const {
  loading,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  confirmAction,
} = useUiFeedback();

const route = useRoute();

const userList = ref([]);
const customer = ref(null);


const selectedDocument = ref(null);
const verifyDialog = ref(false);

function openVerifyDialog(doc) {
  selectedDocument.value = doc;
  verifyDialog.value = true;
}


const isEditModalOpen = ref(false)

function openEditDialog(doc) {
  selectedDocument.value = doc.id
  isEditModalOpen.value = true
}

async function verifySelectedDocument() {
  if (!selectedDocument.value) return;

  try {
    await updateDocumentStatus(selectedDocument.value.id, selectedDocument.value.is_verified);
    showSuccess("Document verified successfully");
  } catch (err) {
    showError("Failed to verify document");
  } finally {
    verifyDialog.value = false;
  }
}



const logs = ref([
  {
    id: "1",
    remarks: "Document Passport Verified",
    number: "G739239",
    createdBy: "Muhammad Usman Faiz",
    createdAt: "27 Sep 2024 11:40 AM",
  },
  {
    id: "2",
    remarks: "Document Passport Verified",
    number: "G739239",
    createdBy: "Muhammad Usman Faiz",
    createdAt: "27 Sep 2024 11:40 AM",
  },
]);
const options = ref({
  page: 1,
  itemsPerPage: 3,
  sortBy: [""],
  sortDesc: [false],
});
const headers = [
  {
    title: "#",
    key: "id",
  },
  {
    title: "Remarks",
    key: "fullName",
  },
  {
    title: "Created By",
    key: "fullName",
  },
  {
    title: "Created At",
    key: "address",
  },
];

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

const customer_id = route.params.id;


onMounted(async () => {
  const id = route.params.id;
  customer.value = await fetchCustomerById(id);
  fetchCustomerDocuments(customer_id);
  userList.value = JSON.parse(JSON.stringify(data));
});
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title
          class="d-flex align-center"
          style="background-color: lightgray"
        >
          <BackNavigation />
          <h4 class="text-h4 py-3">Customer view</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-row class="mt-0">
      <v-col cols="12">
        <v-card-title
          class="border-b-sm d-flex justify-space-between align-center"
        >
          <h4 class="text-h4 py-1 fw-bolder">Personal Details</h4>
          <div>
            <VBtn
              type="submit"
              variant="tonal"
              color="secondary"
               :to="`/customers/edit/${customer_id}`"
              class="me-3" v-if="permissionStore.hasPermission('customers.update')"
            >
              Edit Customer
            </VBtn>
            <VBtn
              type="submit"
              variant="elevated"
              prepend-icon="tabler-plus"
              :to="`/customers/documents/${customer_id}`" v-if="permissionStore.hasPermission('customer.document.upload')"
            >
              Add Documents
            </VBtn>
          </div>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="px-0">
      <v-row class="border-b-sm px-5">
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">First Name</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.first_name || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Last Name</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.last_name || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Email</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.email || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">
            Sending Country
          </p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.sending_country || "---" }}
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
          <p class="font-weight-medium text-color mb-0 lh-22">Phone</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.phone || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Type</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.channel || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Main Agent</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.main_agent || "---" }}
          </p>
        </v-col>
      </v-row>
      <v-row class="border-b-sm px-5">
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Sub Agent</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.sub_agent || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Timezone</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.timezone || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Customer ID</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.id || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Status</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            <VChip
              :color="customer?.status === 1 ? 'success' : 'error'"
              class="font-weight-medium"
              size="small"
            >
              {{ customer?.status === 1 ? "Active" : "Inactive" }}
            </VChip>
          </p>
        </v-col>
      </v-row>
      <v-row class="border-b-sm px-5">
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">DOB</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.dob || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Birth Country</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.place_of_birth || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">
            House # / Office
          </p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.address || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Street Address</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.street_address || "---" }}
          </p>
        </v-col>
      </v-row>
      <v-row class="border-b-sm px-5">
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Postal Code</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.postal_code || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Country</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.sending_country || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">State</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.state || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">City</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.city || "---" }}
          </p>
        </v-col>
      </v-row>
      <v-row class="border-b-sm px-5">
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Nationality</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.nationality || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Occupation</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.occupation || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">IP</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.ip_address || "---" }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Device Details</p>
          <p class="font-weight-medium  text-color1">
           <div v-if="customer?.device_details">
              <p><strong>Device:</strong> {{ customer.device_details.device_name }} | <strong>OS:</strong> {{ customer.device_details.os_name }} {{ customer.device_details.os_version }} | <strong>Model:</strong> {{ customer.device_details.model }}</p>
             
            </div>
            <div v-else>
              ---
            </div>

          </p>
        </v-col>
      </v-row>
      <v-row class="border-b-sm px-5">
        <!-- Blocked -->
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Blocked</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            <VChip
              :color="customer?.blocked === 1 ? 'success' : 'error'"
              class="font-weight-medium"
              size="small"
            >
              {{ customer?.blocked === 1 ? "Yes" : "No" }}
            </VChip>
          </p>
        </v-col>

        <!-- Verified -->
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Verified</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            <VChip
              :color="customer?.verified ? 'success' : 'error'"
              class="font-weight-medium"
              size="small"
            >
              {{ customer?.verified ? "Yes" : "No" }}
            </VChip>
          </p>
        </v-col>

        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">E-KYC Status</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            <VChip
              :color="customer?.e_kyc_status ? 'success' : 'error'"
              class="font-weight-medium"
              size="small"
            >
              {{ customer?.e_kyc_status ? "Yes" : "No" }}
            </VChip>
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">
            E-KYC Till Date
          </p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.e_kyc_till_date || "---" }}
          </p>
        </v-col>
      </v-row>

      <v-row class="border-b-sm px-5">
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Cards Used</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">No card used</p>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
    <CustomerDocuments :documents="documents" :updateDocumentStatus="updateDocumentStatus"  :openVerifyDialog="openVerifyDialog"  @editDocument="openEditDialog" v-if="permissionStore.hasPermission('customer.document.view')"/>

     <!-- Edit Document Modal -->
  <v-dialog v-model="isEditModalOpen" max-width="900">
  <v-card>
    <v-card-title class="d-flex justify-space-between pt-4 pb-2 px-6 border-b-sm">
      <h4 class="text-h4">Edit Document</h4>
      <VIcon icon="tabler-x" @click="isEditModalOpen = false" />
    </v-card-title>

    <v-card-text class="pt-4">
      <EditDocumentForm
        v-if="isEditModalOpen"
        :documentIdProp="selectedDocument"
        :documentTypesProp="documentTypes"
        @refetchSenderDocuments="fetchCustomerDocuments(customer_id)"
        @closeModal="isEditModalOpen = false"
      />
    </v-card-text>
  </v-card>
</v-dialog>

  <AuditLog module="CustomerDetail" :id="customer_id" class="mt-4"/>
     
  <!-- <v-card class="mt-7 px-0">
    <v-row>
      <v-col cols="12">
        <v-card-title style="background-color: lightgray">
          <h4 class="text-h4 py-3">Audit Log</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="pb-10 px-0 pt-0">
      <VDataTable
        class="partner-list"
        :headers="headers"
        :items="userList"
        :items-per-page="options.itemsPerPage"
        :page="options.page"
        :options="options"
      >
        <template #item.nameWithId="{ item }">
          <div style="display: flex; align-items: center">
            <span>{{ item.id }}.</span>
            <VChip
              :style="{
                backgroundColor:
                  item.status === 'verified' ? '#28C76F29' : '#FF9F4329',
                color: item.status === 'verified' ? '#28C76F' : '#FF9F43',
                marginLeft: '8px',
                marginTop: '5px',
              }"
              class="font-weight-light fs-12 p-1"
              size="small"
            >
              {{ item.status === "verified" ? "Verified" : "Unverified" }}
            </VChip>
          </div>
          <div class="fs-13">{{ item.fullName }}</div>
        </template>
        <template #item.contact="{ item }">
          <div>
            <div>{{ item.email }}</div>
            <div class="fs-13">{{ item.city }}</div>
          </div>
        </template>
        <template #item.address="{ item }">
          <div>
            <div>{{ item.email }}</div>
            <div class="fs-13">{{ item.city }}</div>
          </div>
        </template>
        <template #item.channel="{ item }">
          <div class="fs-13">{{ item.city }}</div>

          <div style="display: flex; align-items: center">
            <VChip
              :style="{
                backgroundColor: item.status === 1 ? '#28C76F29' : '#FF9F4329',
                color: item.status === 1 ? '#28C76F' : '#FF9F43',

                marginTop: '2px',
              }"
              class="font-weight-light fs-12 p-1"
              size="small"
            >
              {{ item.status === 1 ? "Active" : "Inactive" }}
            </VChip>
          </div>
        </template>
        <template #item.status="{ item }">
          <VChip
            :color="resolveStatusVariant(item.status).color"
            class="font-weight-medium"
            size="small"
          >
            {{ resolveStatusVariant(item.status).text }}
          </VChip>
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

        <template #bottom>
          <VCardText class="pt-2">
            <div class="d-flex flex-wrap justify-end gap-y-2 mt-2">
              <VPagination
                v-model="options.page"
                :total-visible="$vuetify.display.smAndDown ? 3 : 5"
                :length="Math.ceil(userList.length / options.itemsPerPage)"
              />
            </div>
          </VCardText>
        </template>
      </VDataTable>
    </v-card-text>
  </v-card> -->




  <div class="text-center">
      <v-dialog v-model="verifyDialog" max-width="1000" transition="scale-transition">
      <v-card>
        <v-row>
          <v-col cols="12">
            <v-card-title class="d-flex align-center justify-space-between" style="background-color: lightgray;">
              <h4 class="text-h4 py-3">Attention</h4>
              <IconBtn @click="verifyDialog = false">
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
            Verifying the primary document will also verify the customer profile.
          </p>
          <p class="text-red mb-0 fs-14 font-weight-bold text-center">
            (The customer will not be able to edit their profile.)
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
            <tbody>
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
              <img :src="selectedDocument?.media?.[0]?.url" alt="Front Image" class="rounded border"
                style="max-inline-size: 100%;" />
            </div>
          </VCol>

          <VCol cols="12" v-if="selectedDocument?.media?.[1]?.url">
            <p class="fs-16 font-weight-medium">Back</p>
            <div class="d-flex justify-center">
              <img :src="selectedDocument?.media?.[1]?.url" alt="Back Image" class="rounded border"
                style="max-inline-size: 100%;" />
            </div>
          </VCol>
        </v-card-text>

        <v-card-actions class="d-flex gap-3 justify-end">
           <VBtn class="px-2" variant="tonal" color="secondary" @click="verifyDialog = false">
            Discard
          </VBtn>
          <VBtn class="login-btn" variant="tonal" color="white" @click="verifySelectedDocument">
            Approve
          </VBtn>

        </v-card-actions>
      </v-card>
    </v-dialog>
    </div>  

</template>



