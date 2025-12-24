<script setup>
import BackNavigation from "@/@core/components/BackNavigation.vue";
import { useDestinationCode } from "@/composables/useDestinationCode";
import useUiFeedback from "@/composables/useUiFeedback";
import { nextTick, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
definePageMeta({
  middleware: "auth",
  permission: "destination.partners.list"
})
const permissionStore = usePermissionStore()
const router = useRouter();
const route = useRoute();
const {
  loading,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  confirmAction,
} = useUiFeedback();


const {
  partners,
  fetchPartners,
} = usePartners();


const {
  headers,
  destinationCode,
  destinationName,
  isLoadingdestinationCode,
  payerError,
  deleteDestinationCode,
  fetchDestinationCode,
  createDestinationCode,
  updateDestinationCode,
} = useDestinationCode();

const bankId = ref(route.params.id);
const bankName = ref(route.query.name);
const selectedMethod = ref(null);
const refrenceCode = ref("");

const isEditMode = ref(false);
const editingItemId = ref(null);

onMounted(() => {
  if (bankId.value) {
    fetchDestinationCode(bankId.value);
  }
});
const deleteUser = async (id) => {
  await deleteDestinationCode(id);
};
const requiredValidator = (v) => !!v || "This field is required";

const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});

const editUser = (item) => {
  isEditMode.value = true;
  editingItemId.value = item.id;
  selectedMethod.value = item.partner_id;
  refrenceCode.value = item.reference_code;
};

const formRef = ref(null);

const handleSubmit = async () => {
  const isValid = await formRef.value.validate();
  if (!isValid) {
    errorMessage.value = "Please fill in all required fields";
    return;
  }

  const data = {
    cash_destination_id: bankId.value,
    partner_id: selectedMethod.value,
    reference_code: refrenceCode.value,
    status: 0,
  };

  try {
    if (isEditMode.value && editingItemId.value) {
      await updateDestinationCode(editingItemId.value, data);
      successMessage.value = "Destination Code updated successfully!";
    } else {
      await createDestinationCode(data);
      successMessage.value = "Destination Code created successfully!";
    }

    await fetchDestinationCode(bankId.value);
    resetForm();
  } catch (error) {
    errorMessage.value = "Error submitting form.";
    console.error(error);
  }
};

const resetForm = async () => {
  selectedMethod.value = null;
  refrenceCode.value = "";

  isEditMode.value = false;
  editingItemId.value = null;

  await nextTick();

  if (formRef.value) {
    formRef.value.resetValidation();
  }
};
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12 pb-0">
        <v-card-title class="d-flex align-center" style="background-color: lightgray;">
          <BackNavigation />
          <h4 class="text-h4 py-3">Cash Destination Code</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3" v-if="permissionStore.hasPermission('destination.partners.create') || isEditMode">
      <v-form ref="formRef">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="6">
            <span class="fs-13 label-color">Destination Name</span>

            <AppTextField v-model="bankName" name="name" Placeholder="AB BANK LIMITED" readonly />
          </v-col>
          <VCol cols="12" sm="6" md="6">
            <span class="fs-13 label-color" v-html="requiredLabel('Partner')"></span>
            <AppAutocomplete :items="partners" v-model="selectedMethod" item-title="name" item-value="id"
              placeholder="Select Partner" :rules="[requiredValidator]" />
          </VCol>
          <v-col cols="12" sm="6" md="6">
            <span class="fs-13 label-color" v-html="requiredLabel('Refrence Code')"></span>
            <AppTextField v-model="refrenceCode" name="name" :rules="[requiredValidator]" Placeholder="466899" autocomplete="off"/>
          </v-col>

          <VCol cols="12 d-flex gap-2 pt-9 justify-start" sm="10" md="6">
            <VBtn type="button" @click="handleSubmit" :loading="loading" variant="tonal" class="login-btn">
              {{
                isEditMode
                  ? "Update Destination Code"
                  : "Create Destination Code"
              }}
            </VBtn>
            <VBtn type="reset" variant="tonal" color="secondary" @click="resetForm">Reset</VBtn>
          </VCol>
        </v-row>
      </v-form>
    </v-card-text>
    <VCardText class="px-0 mt-0">
      <PaginatedDataTable :headers="headers" :items="destinationCode" :options="options" :loading="loading"
        :search="search" @update:options="options = $event">
        <!-- User Name -->
        <template #item.userName="{ item }">
          <div class="d-flex align-center">
            <div class="d-flex flex-column">
              <span class="text-truncate v-data-table__td">
                {{ item.fullName }}
              </span>
            </div>
          </div>
        </template>

        <!-- Status -->
        <template #item.status="{ item }">
          <VChip :color="resolveStatusVariant(item.status).color" class="font-weight-medium" size="small">
            {{ resolveStatusVariant(item.status).text }}
          </VChip>
        </template>

        <!-- Actions -->
        <template #item.action="{ item }">
          <div class="d-flex gap-1">
            <IconBtn @click="editUser(item)" v-if="permissionStore.hasPermission('destination.partners.update')">
              <VIcon icon="tabler-edit" />
            </IconBtn>

            <IconBtn @click="deleteUser(item.id)" v-if="permissionStore.hasPermission('destination.partners.delete')">
              <VIcon icon="tabler-trash" />
            </IconBtn>
          </div>
        </template>
      </PaginatedDataTable>
    </VCardText>
  </v-card>
</template>
