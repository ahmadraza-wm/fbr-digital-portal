<script setup>
import BackNavigation from "@/@core/components/BackNavigation.vue";
import useBankPartner from "@/composables/useBankPartner";
import useUiFeedback from "@/composables/useUiFeedback";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
definePageMeta({
  middleware: "auth",
  permission: "bank.partners.list"
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
  bankPartners,
  fetchBankPartners,
  createBankPartner,
  deleteBankPartner,
  updateBankPartner,
} = useBankPartner();

const bankId = ref(route.params.id);
const bankName = ref(route.query.name);
const selectedMethod = ref(null);
const refrenceCode = ref("");

const isEditMode = ref(false);
const editingItemId = ref(null);

onMounted(() => {
  if (bankId.value) {
    fetchBankPartners(bankId.value);
  }
});
const deleteUser = async (id) => {
  await deleteBankPartner(id);
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
    showError("Please fill in all required fields");
    return;
  }
  const data = {
    bank_id: bankId.value,
    partner_id: selectedMethod.value,
    reference_code: refrenceCode.value,
    status: 1,
  };
  try {
    if (isEditMode.value && editingItemId.value) {
      await updateBankPartner(editingItemId.value, data);
    } else {
      await createBankPartner(data);
    }
    await fetchBankPartners(bankId.value);
    resetForm();
  } catch (error) {
    showError("Error submitting form.");
    console.error(error);
  }
};

const resetForm = () => {
  selectedMethod.value = null;
  refrenceCode.value = "";
  isEditMode.value = false;
  editingItemId.value = null;

  if (formRef.value) {
    formRef.value.reset();
  }
};

</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="d-flex align-center" style="background-color: lightgray;">
          <BackNavigation />
          <h4 class="text-h4 py-3">Partner Code</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-divider></v-divider>

    <!-- Form with validation -->
    <v-form ref="formRef" v-if="permissionStore.hasPermission('bank.partners.create') || isEditMode">
      <v-card-text class="pt-1 my-4 pb-3">
        <v-row class="ps-0">
          <VCol cols="12" class="px-1">
            <h4 class="text-h5 py-3">Create Partner</h4>
          </VCol>
          <VCol cols="12" md="6">
            <AppTextField :value="bankName" label="Bank Name" placeholder="ABP" readonly />
          </VCol>
          <VCol cols="12" md="6">
            <span class="fs-13 label-color" v-html="requiredLabel('Partner')"></span>
            <AppAutocomplete v-model="selectedMethod" :items="partners" item-title="name" item-value="id"
              placeholder="Select Partner" :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12" md="6">
            <span class="fs-13 label-color" v-html="requiredLabel('Refrence Code')"></span>
            <AppTextField v-model="refrenceCode" placeholder="466899" :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12" class="d-flex gap-2 pt-md-9 justify-start" sm="10" md="6">
            <VBtn type="button" class="login-btn" @click="handleSubmit" :loading="loading">
              {{ isEditMode ? "Update Partner Code" : "Create Partner Code" }}
            </VBtn>
            <VBtn type="reset" variant="tonal" color="secondary" @click="resetForm">Reset</VBtn>
          </VCol>
        </v-row>
      </v-card-text>
    </v-form>
    <v-divider></v-divider>
    <VCardText class="d-flex flex-wrap gap-4 py-4 bg-grey">
      <h4 class="text-h5">Partner Code List</h4>
    </VCardText>

    <VCardText class="d-flex flex-wrap gap-4 pb-2">
      <div class="me-3 d-flex gap-3 mt-5">
        <ItemsPerPageSelector v-model="options.itemsPerPage" @update:model-value="updateItemsPerPage" />
      </div>
      <VSpacer />
    </VCardText>

    <VCardText class="px-0">
      <PaginatedDataTable :headers="headers" :items="bankPartners" :options="options" :loading="loading"
        :search="search" @update:options="options = $event">
        <!-- Actions -->
        <template #item.action="{ item }">
          <div class="d-flex gap-1">
            <IconBtn @click="editUser(item)" v-if="permissionStore.hasPermission('bank.partners.update')">
              <VIcon icon="tabler-edit" />
            </IconBtn>

            <IconBtn @click="deleteUser(item.id)" v-if="permissionStore.hasPermission('bank.partners.delete')">
              <VIcon icon="tabler-trash" />
            </IconBtn>
          </div>
        </template>
      </PaginatedDataTable>
    </VCardText>
  </v-card>
</template>
