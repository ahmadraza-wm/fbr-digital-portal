<script setup>
import BackNavigation from "@/@core/components/BackNavigation.vue";
import { onMounted, ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
definePageMeta({
  middleware: "auth",
  permission: "company_partner_mappings.show_by_company"
})
import { usePartnerMappings } from "@/composables/UsePartnerMappings";
const { PartnersMapList, fetchPartnersMapList, deleteCompanyPartnerMap, statuses, saveCompanyPartnerMap } = usePartnerMappings();
import { usePartners } from "@/composables/usePartners";
const { fetchPartners, PartnersList } = usePartners();
const permissionStore = usePermissionStore()
const route = useRoute();

const form = ref({
  company_id: route.params.id,
  partner_id: null,
  receiving_methods: [],
  status: true,
})

const CompanyName = ref(route.query.name);

const isEdit = ref(false);
const editingItemId = ref(null);
const formRef = ref(null);
const formKey = ref(0)

onMounted(async () => {
  await fetchPartnersMapList(route.params.id)
  fetchPartners();
});
const deletePartner = async (partnerId) => {
  await deleteCompanyPartnerMap(route.params.id, partnerId);
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
  form.value.partner_id = item.partner.id;
  form.value.receiving_methods = item.receiving_methods;
  form.value.status = item.status;
};
const headers = ref([
  { title: "#", key: "sr_no" },
  { title: "Partner Name", key: "partner" },
  { title: "Receiving Methods", key: "receiving_methods" },
  { title: "Status", key: "status" },
  { title: "Created At", key: "created_at" },
  { title: "Action", key: "action" },
]);

const selectedPartner = computed(() => {
  return PartnersList.value.find(
    partner => partner.id === form.value.partner_id
  )
})

const receivingMethodsList = computed(() => {
  return selectedPartner.value?.receiving_methods || []
})

watch(() => form.value.partner_id, () => {
  if (!isEdit.value) {
    form.value.receiving_methods = []
  }
})

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate();

  if (!valid) {
    return;
  }
  const isSaved = await saveCompanyPartnerMap(isEdit.value, form.value, route.params.id, editingItemId.value);
  if (isSaved) {
    resetForm();
  }
};

const resetForm = () => {
  isEdit.value = false;
  editingItemId.value = null;

  form.value = {
    company_id: route.params.id,
    partner_id: null,
    receiving_methods: [],
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
          <h4 class="text-h5 py-3 text-white">Company Partner Mappings</h4>
        </v-card-title>
        <v-card-title class="border-b-sm" v-if="permissionStore.hasPermission('company_partner_mappings.create') || isEdit">
          <h4 class="text-h5 py-3">{{ isEdit ? 'Update' : 'Create' }} Partner Mapping</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <!-- Form with validation -->
    <v-form ref="formRef" v-if="permissionStore.hasPermission('company_partner_mappings.create') || isEdit" :key="formKey">
      <v-card-text class="pt-4 mb-4 pb-3">
        <v-row class="ps-0">
          <VCol cols="12" md="6">
            <AppTextField :value="CompanyName" label="Company Name" placeholder="ABP" readonly />
          </VCol>
          <VCol cols="12" md="6">
            <span class="fs-13 label-color" v-html="requiredLabel('Partner')"></span>
            <AppAutocomplete v-model="form.partner_id" :items="PartnersList" item-title="name" item-value="id"
              placeholder="Select Partner" :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12" md="6">
            <span class="fs-13 label-color" v-html="requiredLabel('Receiving Methods')"></span>
            <AppAutocomplete v-model="form.receiving_methods" :items="receivingMethodsList"
              placeholder="Select Receiving Method" :rules="[requiredValidator]" chips multiple closable-chips
              :disabled="!form.partner_id" />
          </VCol>
          <VCol cols="12" md="6" v-if="isEdit">
            <span class="fs-13 label-color">Status<span class="text-red">*</span></span>
            <AppAutocomplete v-model="form.status" :items="statuses" item-title="text" item-value="value"
              placeholder="Select Status" :rules="[requiredValidator]" />
          </VCol>
          <VCol :class="['d-flex gap-2', isEdit ? 'justify-end' : 'pt-md-9 justify-start']">
            <VBtn type="button" class="login-btn" variant="tonal" @click="handleSubmit" :loading="loading">
              {{ isEdit ? "Update" : "Create" }} Partner Mapping
            </VBtn>
            <VBtn type="reset" variant="tonal" color="secondary" @click="resetForm">Reset</VBtn>
          </VCol>
        </v-row>
      </v-card-text>
    </v-form>
    <v-divider></v-divider>
    <VCardText class="d-flex flex-wrap gap-4 py-4 bg-secondary">
      <h4 class="text-h5 py-1 text-white">Partners Mapping List</h4>
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
      <PaginatedDataTable :headers="headers" :items="PartnersMapList" :options="options" :loading="loading"
        :search="search" @update:options="options = $event">
        <template #item.partner="{ item }">
          <span class="text-capitalize">{{ item.partner.name }}</span>
        </template>
        <template #item.receiving_methods="{ item }">
          <div v-if="item?.receiving_methods?.length">
            <VChip v-for="(method, index) in item.receiving_methods" :key="index" class="me-1 text-capitalize"
              color="primary" size="small">
              {{ method }}
            </VChip>
          </div>
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
            <IconBtn @click="editPartner(item)" v-if="permissionStore.hasPermission('company_partner_mappings.update')">
              <VIcon icon="tabler-edit" color="primary" />
            </IconBtn>

            <IconBtn @click="deletePartner(item.id)" v-if="permissionStore.hasPermission('company_partner_mappings.delete')">
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
                {{ Math.min(options.page * options.itemsPerPage, PartnersMapList.length) }}
                of {{ PartnersMapList.length }} entries
              </span>
              <VPagination v-model="options.page" :total-visible="$vuetify.display.smAndDown ? 3 : 5"
                :length="Math.ceil(PartnersMapList.length / options.itemsPerPage)" />
            </div>
          </VCardText>
        </template>
      </PaginatedDataTable>
    </VCardText>
  </v-card>
</template>
