<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title>
          <h4 class="text-h5 py-3">Search Banks</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-divider></v-divider>

    <v-card-text class="pt-1 my-4 pb-3">
      <v-row class="ps-0">
        <v-col cols="12" sm="10" md="10" class="ps-1">
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <span class="fs-16 label-color">Bank Name</span>
              <AppTextField v-model="filters.name" name="name" placeholder="Bank Name" autocomplete="off"/>
            </v-col>
            <VCol cols="12" sm="6" md="6">
              <span class="fs-16 label-color">Country</span>
              <AppAutocomplete v-model="filters.country_id" :items="countries" item-title="name" item-value="id"
                placeholder="Select Country" />
            </VCol>
          </v-row>
        </v-col>
        <v-col cols="12 d-flex gap-2 align-end" sm="10" md="2">
          <VBtn @click="search" variant="tonal" class="login-btn">Search</VBtn>
          <VBtn @click="resetFilters" variant="tonal" color="secondary">Reset</VBtn>
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider></v-divider>
    <VCardText class="d-flex flex-wrap gap-4 pb-2">
      <div class="me-3 d-flex gap-3">
        <ItemsPerPageSelector v-model="itemsPerPage" @update:model-value="updateItemsPerPage" />
      </div>
      <VSpacer />
      <VBtn color="secondary" variant="tonal" to=""> Export CSV </VBtn>
      <VBtn color="primary" variant="elevated" @click="addBank = true" prepend-icon="tabler-plus" v-if="permissionStore.hasPermission('banks.store')">
        Add Bank
      </VBtn>
    </VCardText>
    <VCardText class="px-0 border-t-sm">
      <VDatableComponent :headers="headers" :items="bankList" :loading="loading" :search="filters.name"
        :pagination="pagination" :pageNo="pageNo" @update:pageNo="pageNo = $event">
        <!-- Name -->
         <template #item.bank_code="{ item }">
          {{ item.id }}
          <!-- <span v-for="item in item.bank_code">{{ item.reference_code }}, </span> -->
        </template>

        <template #item.name="{ item }">
          <span>{{ item.name }}</span>
        </template>

        <!-- Country -->
        <template #item.country="{ item }">
          <span>{{ item.country }}</span>
        </template>

        <!-- Actions -->
        <template #item.action="{ item }">
          <div class="d-flex gap-1">
              <VBtn
                icon
                variant="text"
                color="medium-emphasis"
                @click="openAuditLog(item)"
              >
              <VIcon icon="tabler-history" />
            </VBtn>
            <IconBtn @click="deleteUser(item.id)" class="d-none">
              <VIcon icon="tabler-trash" />
            </IconBtn>

            <VBtn icon variant="text" color="medium-emphasis">
              <VIcon icon="tabler-dots-vertical" />
              <VMenu activator="parent">
                <VList>
                  <!-- <VListItem to="">
                    <VListItemTitle>Bank Branches</VListItemTitle>
                  </VListItem> -->

                  <VListItem :to="`/banks/partner-code/${item.id}?name=${item.name}`" v-if="permissionStore.hasPermission('bank.partners.list')">
                    <VListItemTitle>Partner Code</VListItemTitle>
                  </VListItem>
                  <!-- <VListItem :to="`/banks/bank-payer`">
                    <VListItemTitle>Payers</VListItemTitle>
                  </VListItem> -->

                  <!-- Future option
            <VListItem to="banks/bank-payer">
              <VListItemTitle>Payers</VListItemTitle>
            </VListItem>
            -->
                </VList>
              </VMenu>
            </VBtn>
          </div>
        </template>
      </VDatableComponent>
    </VCardText>
  </v-card>
  <!---Add Bank pop up design by usman faiz -->
  <div class="text-center pa-4">
    <!-- Dialog -->
    <v-dialog v-model="addBank" max-width="800" persistent transition="scale-transition">
      <v-card>
        <VCardTitle class="border-b-sm d-flex justify-space-between align-center">
          <h4 class="text-h4">Add Bank</h4>
          <VIcon icon="tabler-x" @click="handleDiscard" />
        </VCardTitle>
        <VCardText class="pt-3">
          <VForm ref="formRef">
            <VRow>
              <VCol cols="6">
                <span class="fs-13 label-color" v-html="requiredLabel('Bank Name')"></span>
                <AppTextField v-model="newBank.name" placeholder="Name" :rules="[requiredValidator]" name="bankName"
                  autocomplete="off" />
              </VCol>
              <VCol cols="12" md="6">
                <span class="fs-13 label-color" v-html="requiredLabel('Country')"></span>
                <v-autocomplete v-model="newBank.country_id" name="country" :items="countries" item-title="name"
                  item-value="id" :rules="[requiredValidator]" placeholder="Country" autocomplete="off" />
              </VCol>
              <VCol class="d-flex justify-end gap-3">
                <VBtn color="secondary" variant="tonal" @click="handleDiscard">
                  Discard
                </VBtn>
                <VBtn color="white" variant="elevated" class="login-btn" @click="handleSubmit">
                  Create Bank</VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </v-card>
    </v-dialog>
  </div>
     <AuditLog
      v-if="selectedId"
      module="Bank"
      :id="selectedId"
      class="mt-4"
    />
</template>

<script setup>
import { useBank } from "@/composables/useBank";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import AuditLog from '@/components/AuditLog.vue'
definePageMeta({
  middleware: "auth",
  permission: "banks.index"
})
const permissionStore = usePermissionStore()
const { bankList, fetchBanks, options, headers, deleteBank, submitForm, pagination } = useBank();
const countryCurrencyStore = useCountryCurrencyStore();
const { countries, currencies } = storeToRefs(countryCurrencyStore);

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(fetchBanks, {
  initialPage: 1,
  initialPerPage: 10,
});
const addBank = ref(false);
const formRef = ref();
const dialog = ref(false);

const route = useRoute();

const handleDiscard = () => {
  addBank.value = false;
  newBank.value = {
    name: "",
    country_id: null,
  };
  if (formRef.value) formRef.value.resetValidation();
};

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate();
  if (valid) {
    await submitForm(newBank.value);
    addBank.value = false;

    newBank.value = {
      name: "",
      country_id: null,
    };
  }
};

const newBank = ref({
  name: "",
  country_id: "",
});

const filters = ref({
  name: "",
  country_id: "",
});

const search = () => {
  fetchBanks({ ...filters.value, ...options.value });
};

const resetFilters = () => {
  filters.value = { name: "", country_id: "" };
  fetchBanks();
};

const deleteUser = async (id) => {
  await deleteBank(id);
};

const selectedId = ref(null)

const openAuditLog = (item) => {
  if (selectedId.value === item.id) {
    selectedId.value = null
  } else {
    selectedId.value = item.id
  }
}

onMounted(() => {
  const queryBankName = route.query.bank_name;
  const queryCountryId = route.query.rec_country_id;

  filters.value.name = queryBankName || "";
  filters.value.country_id = queryCountryId ? Number(queryCountryId) : "";

  fetchBanks({ ...filters.value });
});

watch(
  () => route.query,
  (query) => {
    const queryBankName = route.query.bank_name;
    const queryCountryId = route.query.rec_country_id;

    filters.value.name = queryBankName || "";
    filters.value.country_id = queryCountryId ? Number(queryCountryId) : "";

    fetchBanks({ ...filters.value });
  },
  { immediate: true }
);
</script>
