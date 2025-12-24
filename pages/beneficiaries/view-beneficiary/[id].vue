<script setup>
import BackNavigation from "@/@core/components/BackNavigation.vue";
import BeneficiaryBanks from "@/components/beneficiary/BeneficiaryBanks.vue";
import BeneficiaryDocuments from "@/components/beneficiary/BeneficiaryDocuments.vue";
import { useBeneficiary } from "@/composables/useBeneficiary";
import data from "@/views/demos/forms/tables/data-table/datatable";
import { useRoute } from "vue-router";
import AuditLog from '@/components/AuditLog.vue'
const permissionStore = usePermissionStore()
definePageMeta({
  middleware: "auth",
  permission: "customer.beneficiary.view"
})
const { fetchCustomerById, fetchCustomerDocuments } = useBeneficiary();
const route = useRoute();

const userList = ref([]);
const customer = ref({});
const banks = ref([]);
const documents = ref([]);
const customer_id = route.params.id;

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
        <v-card-title class="border-b-sm d-flex align-center" style="background-color: lightgrey">
          <BackNavigation />
          <h4 class="text-h5 py-4">Beneficiary Details</h4>
        </v-card-title>
        <v-card-title class="py-0 border-b-sm header-bg">
          <h4 class="text-h5 py-5">Beneficiary Personal Details</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="px-0 pt-0">
      <v-row class="border-b-md px-5 py-3">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Name</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.name || "---" }}
          </p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Email</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.customer_email || "---" }}
          </p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Phone</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.phone_number || "---" }}
          </p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Gender</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.gender || "---" }}
          </p>
        </v-col>
      </v-row>
      <v-row class="border-b-md px-5 py-3">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Beneficiary ID</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.id || "---" }}
          </p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">DOB</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.dob || "---" }}
          </p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Birth Country</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ "---" }}
          </p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Nationality</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ "---" }}
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12 pt-0">
          <v-card-title class="py-0 border-b-md header-bg">
            <h4 class="text-h5 py-5">Other Beneficiary Details</h4>
          </v-card-title>
        </v-col>
      </v-row>
      <v-row class="border-b-md px-5 py-3">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Relation</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.relation || "---" }}
          </p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Type</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.channel || "---" }}
          </p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Customer Name</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.customer_name || "---" }}
          </p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Status</p>
          <VChip :style="{
            backgroundColor:
              customer.status === 1 ? '#28C76F29' : '#FF9F4329',
            color: customer.status === 1 ? '#28C76F' : '#FF9F43',
            marginTop: '4px',
          }" class="font-weight-light fs-12 p-1 mt-1" size="small">
            {{ customer.status == 1 ? "Active" : "Inactive" }}
          </VChip>
        </v-col>
      </v-row>
      <v-row class="border-b-md px-5 py-3">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Birth State</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.state || "---" }}
          </p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Birth City</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.city || "---" }}
          </p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">
            House # / Office
          </p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.house_no || "---" }}
          </p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Street Address</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.address || "---" }}
          </p>
        </v-col>
      </v-row>
      <v-row class="border-b-md px-5 py-3">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Postal Code</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.postal_code || "---" }}
          </p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Country</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.country || "---" }}
          </p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">State</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.state || "---" }}
          </p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">City</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.city || "---" }}
          </p>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <VCard class="my-7">
    <BeneficiaryBanks :banks="banks" :beneficiary_id="customer_id" />
  </VCard>
  <BeneficiaryDocuments :documents="documents" />

  <AuditLog module="Beneficiary" :id="route.params.id" class="mt-4"/>
 


</template>
