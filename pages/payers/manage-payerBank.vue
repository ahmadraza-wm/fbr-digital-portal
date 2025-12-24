<script setup>
import BackNavigation from "@/@core/components/BackNavigation.vue";
import usePayerBankFields from "@/composables/usePayerBankFields";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
definePageMeta({
  middleware: "auth",
  permission: "bank.fields.list"
})
const permissionStore = usePermissionStore()
const route = useRoute();
const payerId = route.query.id;
const countryId = route.query.country_id;

const formData = ref({});
const formRef = ref(null);

const requiredValidator = (v) => v !== null && v !== undefined && v !== '' ? true : "This field is required";

const {
  payerBankFields,
  fetchPayerBankFields,
  createPayerBankField,
  deletePayerBankField,
  fetchBanksByCountry,
  isLoadingPayerBankFields,
  headers,
  inputName,
  inputType,
  inputRequired,
  banks,
} = usePayerBankFields();

// Form Models
const selectedInputName = ref(null);
const selectedInputType = ref(null);
const selectedInputRequired = ref(null);
const inputLabel = ref("");
const inputPlaceholder = ref("");
const minimumCharacter = ref("");
const maximumCharacter = ref("");
const inputHelpMessage = ref("");

// Form Submit
const addField = async () => {
  const payload = {
    payer_id: payerId,
    input_name: selectedInputName.value,
    input_label: inputLabel.value,
    input_placeholder: inputPlaceholder.value,
    input_type: selectedInputType.value,
    input_required: selectedInputRequired.value,
    input_min: minimumCharacter.value,
    input_max: maximumCharacter.value,
    input_help_message: inputHelpMessage.value,
  };

  const { success } = await createPayerBankField(payload);
  if (success) {
    await fetchPayerBankFields(payerId);
    // Reset form
    selectedInputName.value = null;
    selectedInputType.value = null;
    selectedInputRequired.value = null;
    inputLabel.value = "";
    inputPlaceholder.value = "";
    minimumCharacter.value = "";
    maximumCharacter.value = "";
    inputHelpMessage.value = "";

    if (formRef.value?.resetValidation) {
      formRef.value.resetValidation();
      formRef.value.reset();
    }
  }
};
const handleDeleteField = async (fieldId) => {
  await deletePayerBankField(fieldId, () => fetchPayerBankFields(payerId));
};

onMounted(async () => {
  await fetchPayerBankFields(payerId);
  await fetchBanksByCountry({ country_id: countryId });
});
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12 pb-0">
        <v-card-title class="d-flex align-center bg-grey">
          <BackNavigation />
          <h4 class="text-h5 py-3">Manage Payer Bank Fields</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3" v-if="permissionStore.hasPermission('bank.field.store')">
      <VForm ref="formRef" @submit.prevent="addField">
        <v-row class="ps-0">
          <v-col cols="12" sm="12">
            <span class="fs-13 label-color font-weight-regular">Input Name<span class="text-red">*</span></span>
            <AppAutocomplete v-model="selectedInputName" :items="inputName" :rules="[requiredValidator]"
              placeholder="Input Name" />
          </v-col>

          <v-col cols="12" sm="6">
            <span class="fs-13 label-color">Input Label<span class="text-red">*</span></span>
            <AppTextField v-model="inputLabel" name="inputLabel" :rules="[requiredValidator]"
              placeholder="Input Label" autocomplete="off" />
          </v-col>

          <v-col cols="12" sm="6">
            <span class="fs-13 label-color">Input Placeholder<span class="text-red">*</span></span>
            <AppTextField v-model="inputPlaceholder" name="inputPlaceholder" :rules="[requiredValidator]"
              placeholder="Input Placeholder" autocomplete="off" />
          </v-col>

          <v-col cols="12" sm="6">
            <span class="fs-13 label-color">Input Type<span class="text-red">*</span></span>
            <AppAutocomplete v-model="selectedInputType" :items="inputType" :rules="[requiredValidator]"
              placeholder="Input Type" />
          </v-col>

          <v-col cols="12" sm="6">
            <span class="fs-13 label-color">Input Required<span class="text-red">*</span></span>
            <AppAutocomplete v-model="selectedInputRequired" :items="inputRequired" :rules="[requiredValidator]"
              placeholder="Required?" />
          </v-col>

          <v-col cols="12" sm="6">
            <span class="fs-13 label-color">Minimum Character</span>
            <AppTextField v-model="minimumCharacter" type="number" placeholder="Min Characters" />
          </v-col>

          <v-col cols="12" sm="6">
            <span class="fs-13 label-color">Maximum Character</span>
            <AppTextField v-model="maximumCharacter" type="number" placeholder="Max Characters" />
          </v-col>

          <v-col cols="12">
            <span class="fs-13 label-color">Input Help Message</span>
            <AppTextarea v-model="inputHelpMessage" rows="2" placeholder="Help Message" />
          </v-col>

          <v-col cols="12 d-flex justify-end">
            <v-btn type="submit" variant="tonal" color="primary" class="login-btn">Add Field</v-btn>
          </v-col>
        </v-row>
      </VForm>
    </v-card-text>
    <v-card-title class="border-b-sm border-t-sm">
      <h4 class="text-h5 py-3">Form will look like this</h4>
    </v-card-title>

    <v-card-text>
      <v-row v-for="(field, index) in payerBankFields" :key="field.id" class="mt-2" align="start">
        <v-col cols="11">
          <span class="fs-13 label-color">
            <span v-html="field.input_label"></span>
            <span v-if="field.input_required == 1" class="text-red-600">*</span>
          </span>

          <!-- If it's the first field (index 0), show dropdown -->
          <template v-if="index === 0">
            <AppAutocomplete v-model="formData[field.input_name]" :items="banks" placeholder="Choose Bank" />
          </template>

          <!-- Else show text field -->
          <template v-else>
            <AppTextField v-model="formData[field.input_name]" :type="'text'"
              :inputmode="field.input_type === 'number' ? 'numeric' : 'text'"
              :pattern="field.input_type === 'number' ? '\\d*' : undefined" :placeholder="field.input_placeholder"
              :maxlength="field.input_max" :minlength="field.input_min" @input="
                (e) => {
                  if (field.input_type === 'number') {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    formData[field.input_name] = e.target.value;
                  }
                }
              " />
          </template>

          <p class="text-caption text-grey mt-0 mb-0">
            <template v-if="field.input_required == 1">
              <span class="text-red-600">*</span> Required.
            </template>
            <template v-if="field.input_type === 'number'">
              Digits: min {{ field.input_min }}, max {{ field.input_max }}.
            </template>
            <template v-else>
              Characters: min {{ field.input_min }}, max {{ field.input_max }}.
            </template>
          </p>
        </v-col>

        <!-- delete button only for fields except the first -->
        <v-col cols="1" class="d-flex justify-center pt-8" v-if="permissionStore.hasPermission('bank.field.delete')">
          <IconBtn v-if="index !== 0" class="bg-red" variant="tonal" rounded="sm" @click="handleDeleteField(field.id)">
            <VIcon icon="tabler-trash" />
          </IconBtn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
