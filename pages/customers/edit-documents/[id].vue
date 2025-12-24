<script setup>
import { useCustomer } from "@/composables/useCustomer";
import useUiFeedback from "@/composables/useUiFeedback";
import EditDocumentForm from "@/pages/customers/edit-documents/edit-form.vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
const { $axios } = useNuxtApp();

const {
  fetchCustomerById,
  documents,
  fetchCustomerDocuments,
  uploadCustomerDocuments,
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


const props = defineProps({
  documentIdProp: { type: [String, Number], default: null }
});

const route = useRoute();
const documentId = props.documentIdProp || route.params.id;

console.log('documentId in edit-documents',documentId);

const documentData = ref(null);

// Form state
const form = ref({
  type: "",
  number: "",
  issue_date: "",
  expiry_date: "",
  issuer_authority: "",
  country_id: null,
});
onMounted(async () => {
  try {
    const res = await $axios.get(`/view/customer/document/${documentId}`);
    documentData.value = res.data.data;
    console.log(documentData.value);
    form.value = {
      type: documentData.value.type || "",
      number: documentData.value.number || "",
      issue_date: documentData.value.issue_date || "",
      expiry_date: documentData.value.expiry_date || "",
      issuer_authority: documentData.value.issuer_authority || "",
      country_id: documentData.value.country_id || null,
    };
  } catch (err) {
    showError("Error fetching document data:", err);
  } finally {
    loading.value = false;
  }
});

</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="d-flex align-center justify-space-between" style="background-color: lightgray;">
          <h4 class="text-h4 py-3">Edit Customer Document</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <V-card-text>
        <EditDocumentForm :documentIdProp="documentId" />
    </V-card-text>
  </v-card>
  <v-card class="mt-5 px-0">
    <v-row>
      <v-col cols="12">
        <v-card-title style="background-color: lightgray;">
          <h4 class="text-h5 py-3">Audit Log</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="py-0 px-0">
      <v-table class="text-no-wrap">
        <thead>
          <tr>
            <th>#</th>
            <th>Remarks</th>
            <th>Created By</th>
            <th>Cretaed At</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>01</td>
            <td>Document Passport was verified.</td>
            <td>Ali Arsal(Roze Remit)</td>
            <td>27 Sep, 2025 11:40 AM</td>
          </tr>
          <tr>
            <td>02</td>
            <td>Document Passport was verified.</td>
            <td>Ali Arsal(Roze Remit)</td>
            <td>27 Sep, 2025 11:40 AM</td>
          </tr>
          <tr>
            <td>03</td>
            <td>Document Passport was verified.</td>
            <td>Ali Arsal(Roze Remit)</td>
            <td>27 Sep, 2025 11:40 AM</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>
