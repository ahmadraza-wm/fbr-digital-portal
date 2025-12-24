<script setup>
import { useCustomer } from "@/composables/useCustomer";
import useUiFeedback from "@/composables/useUiFeedback";
import { onMounted, ref } from "vue";


const props = defineProps({
  documentIdProp: { type: [String, Number], required: true },

  documentTypesProp: {
    type: Array

  },
  isEditModalOpen: {
    type: Boolean
  }
});


const emit = defineEmits([
  "refetchSenderDocuments",
  "refetchAdditionalDocuments",
  "closeModal"
]);


function parseDateString(dateStr) {
  if (!dateStr) return "";
  const [day, month, year] = dateStr.split("-");
  return new Date(year, month - 1, day); // month is 0-indexed in JS
}

function formatDateToString(dateObj) {
  if (!dateObj) return "";
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}-${month}-${year}`;
}

const { $axios } = useNuxtApp();
const { documentTypes, countries } = useCustomer();
const { loading, showError, showSuccess } = useUiFeedback();

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
    const res = await $axios.get(`/view/customer/document/${props.documentIdProp}`);
    const doc = res.data.data;
    const IssuDateParts = doc.issue_date.split(' ');
    const ExpDateParts = doc.expiry_date.split(' ')
    form.value = {
      type: doc.type || "",
      number: doc.number || "",
      issue_date: IssuDateParts[0] || "",
      expiry_date: ExpDateParts[0] || "",
      issuer_authority: doc.issuer_authority || "",
      country_id: doc.country_id || null,
    };
    console.log('form data', form.value);
  } catch (err) {
    showError("Error fetching document data");
  } finally {
    loading.value = false;
  }
});

const updateDocument = async () => {
  try {

    await $axios.patch(`/customer/document/update/${props.documentIdProp}`, form.value);
    showSuccess("Document updated successfully.");
    emit("closeModal");
    console.log('modal boolean', props.isEditModalOpen);
    emit("refetchSenderDocuments");
    emit("refetchAdditionalDocuments");
  } catch (error) {
    const messages = error.response?.data?.errors
      ? Object.values(error.response.data.errors).flat()
      : error.response?.data?.message || "Error updating document";
    showError(messages);
  }
};
</script>

<template>
  <VForm @submit.prevent="updateDocument">
    <v-row class="ps-0">
      <v-col cols="12" sm="6">
        <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Type')"></span>
        <AppAutocomplete v-model="form.type" :items="props.documentTypesProp" item-value="title" placeholder="Type"
          :rules="[requiredValidator]" />
      </v-col>

      <v-col cols="12" sm="6" md="6">
        <span class="fs-15 label-color font-weight-medium">Document No
          <span class="text-red" v-if="form.type == 'Passport' || form.type == 'ID Card'">*</span>
        </span>
        <AppTextField v-model="form.number" placeholder="1234567"
          :rules="form.type == 'Passport' || form.type == 'ID Card' ? [requiredValidator] : []" />
      </v-col>

      <v-col cols="12" sm="6">
        <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Issuance Date')"></span>
        <AppDialogDate :model-value="form.issue_date" v-model="form.issue_date" />
      </v-col>

      <v-col cols="12" sm="6">
        <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Expiry Date')"></span>
        <AppDialogDate :model-value="form.expiry_date" v-model="form.expiry_date" />
      </v-col>

      <v-col cols="12" sm="6">
        <span class="fs-15 label-color font-weight-medium">Issuer Authority</span>
        <AppTextField v-model="form.issuer_authority" placeholder="Type..." />
      </v-col>

      <v-col cols="12" sm="6">
        <span class="fs-15 label-color font-weight-medium">Issuer Country<span class="text-red">*</span></span>
        <AppAutocomplete v-model="form.country_id" :items="countries" placeholder="Algeria" item-title="name"
          item-value="id" :rules="[requiredValidator]"/>
      </v-col>

      <v-col cols="12" class="d-flex justify-end gap-2">
        <VBtn type="reset" color="secondary" variant="tonal">Reset</VBtn>
        <VBtn type="submit" class="login-btn" variant="tonal">Update Documents</VBtn>
      </v-col>
    </v-row>
  </VForm>
</template>
