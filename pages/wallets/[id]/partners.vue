<script setup>
import BackNavigation from "@/@core/components/BackNavigation.vue";
import { useBanks } from "@/composables/useBanks";
import { useWallets } from "@/composables/useWallets";
import useUiFeedback from "@/composables/useUiFeedback";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
definePageMeta({
  middleware: "auth",
  permission: "wallet_partners.view"
})
const { fetchPartnerConstants, partnerConstant } = useBanks();
const {WalletsList,fetchWalletPartnersList,saveWalletPartner,statuses,deleteWalletPartner} = useWallets();
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

const form = ref({
  wallet_id: route.params.id,
  integration_method: '',
  reference_code: '',
  status: true,
})


const bankId = ref(route.params.id);
const bankName = ref(route.query.name);
const selectedMethod = ref(null);
const refrenceCode = ref("");

const isEdit = ref(false);
const editingItemId = ref(null);
const formRef = ref(null);
const formKey = ref(0)

onMounted(async () => {
  await fetchWalletPartnersList(route.params.id)
  await fetchPartnerConstants();
});
const deletePartner = async (partnerId) => {
  await deleteWalletPartner(route.params.id, partnerId);
};
const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});

const editPartner = (item) => {
  isEdit.value = true;
  editingItemId.value = item.id;
  form.value.integration_method = item.integration_method;
  form.value.reference_code = item.reference_code;
  form.value.status = item.status;
};
const headers = ref([
  { title: "#", key: "sr_no" },
  { title: "Partner Name", key: "integration_method" },
  { title: "Reference Code", key: "reference_code" },
  { title: "Status", key: "status" },
  { title: "Created At", key: "created_at" },
  { title: "Action", key: "action" },
]);

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate();

  if (!valid) {
    return;
  }
  const isSaved = await saveWalletPartner(isEdit.value, form.value, route.params.id, editingItemId.value);
  if (isSaved) {
    resetForm();
  }
};

const resetForm = () => {
  isEdit.value = false;
  editingItemId.value = null;

  form.value = {
    wallet_id: route.params.id,
    integration_method: '',
    reference_code: '',
    status: true,
  };

  formKey.value++
};


</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="d-flex align-center bg-primary">
          <BackNavigation color="tetx-white" />
          <h4 class="text-h5 py-3 text-white">Wallet Partner Code</h4>
        </v-card-title>
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">{{ isEdit ? 'Update' : 'Create' }} Partner</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <!-- Form with validation -->
    <v-form ref="formRef" v-if="permissionStore.hasPermission('wallet_partners.create') || isEdit" :key="formKey">
      <v-card-text class="pt-4 mb-4 pb-3">
        <v-row class="ps-0">
          <VCol cols="12" md="6">
            <AppTextField :value="bankName" label="Wallet Name" placeholder="ABP" readonly />
          </VCol>
          <VCol cols="12" md="6">
            <span class="fs-13 label-color" v-html="requiredLabel('Partner')"></span>
            <AppAutocomplete v-model="form.integration_method" :items="partnerConstant?.integration_methods"
              placeholder="Select Integration Method" :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12" md="6">
            <span class="fs-13 label-color" v-html="requiredLabel('Refrence Code')"></span>
            <AppTextField v-model="form.reference_code" placeholder="466899" :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12" md="6" v-if="isEdit">
            <span class="fs-13 label-color">Status<span class="text-red">*</span></span>
            <AppAutocomplete v-model="form.status" :items="statuses" item-title="text" item-value="value"
              placeholder="Select Status" :rules="[requiredValidator]" />
          </VCol>
          <VCol :class="['d-flex gap-2', isEdit ? 'justify-end' : 'pt-md-9 justify-start']">
            <VBtn type="button" class="login-btn" variant="tonal" @click="handleSubmit" :loading="loading">
              {{ isEdit ? "Update Partner Code" : "Create Partner Code" }}
            </VBtn>
            <VBtn type="reset" variant="tonal" color="secondary" @click="resetForm">Reset</VBtn>
          </VCol>
        </v-row>
      </v-card-text>
    </v-form>
    <v-divider></v-divider>
    <VCardText class="d-flex flex-wrap gap-4 py-4 bg-secondary">
      <h4 class="text-h5 py-1 text-white">Partner Code List</h4>
    </VCardText>

    <VCardText class="flex-wrap gap-4 d-flex justify-space-between align-center border-t-sm">
      <div class="d-flex gap-3 pt-6">
        <span class="fs-16 pt-2">Show</span>
        <AppAutocomplete v-model="options.itemsPerPage" :items="[
          { value: -1, title: 'All' },
          { value: 50, title: '50' },
          { value: 100, title: '100' },
        ]" style="inline-size: 6.25rem;" @update:model-value="itemsPerPage = parseInt($event, 10)" />
      </div>
    </VCardText>
    <VCardText class="px-0">
      <PaginatedDataTable :headers="headers" :items="WalletsList" :options="options" :loading="loading" :search="search"
        @update:options="options = $event">
        <template #item.integration_method="{ item }">
          <span class="text-capitalize">{{ item.integration_method }}</span>
        </template>
        <template #item.status="{ item }">
          <div>
            <VChip :color="item.status ? 'success' : 'error'" class="font-weight-light p-1" size="small"
              variant="elevated">
              {{ item.status ? 'Active' : 'Inactive' }}
            </VChip>
          </div>
        </template>
        <template #item.created_at="{ item }">
          {{ formatDate(item.created_at) }}
        </template>
        <!-- Actions -->
        <template #item.action="{ item }">
          <div class="d-flex gap-1">
            <IconBtn @click="editPartner(item)" v-if="permissionStore.hasPermission('wallet_partners.update')">
              <VIcon icon="tabler-edit" color="primary" />
            </IconBtn>

            <IconBtn @click="deletePartner(item.id)" v-if="permissionStore.hasPermission('wallet_partners.delete')">
              <VIcon icon="tabler-trash" color="error" />
            </IconBtn>
          </div>
        </template>
        <template #bottom>
          <VCardText class="pt-2 pb-0 border-t-sm">
            <div class="d-flex flex-wrap justify-space-between align-center gap-y-2 mt-2">
              <span class="text-muted">
                Showing
                {{ (options.page - 1) * options.itemsPerPage + 1 }}
                to
                {{ Math.min(options.page * options.itemsPerPage, WalletsList.length) }}
                of {{ WalletsList.length }} entries
              </span>
              <VPagination v-model="options.page" :total-visible="$vuetify.display.smAndDown ? 3 : 5"
                :length="Math.ceil(WalletsList.length / options.itemsPerPage)" />
            </div>
          </VCardText>
        </template>
      </PaginatedDataTable>
    </VCardText>
  </v-card>
</template>
