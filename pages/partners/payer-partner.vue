<script setup>
import BackNavigation from "@/@core/components/BackNavigation.vue";
import PartnerDetail from "@/components/partners/PartnerDetail.vue";
import usePartnerPayer from "@/composables/usePartnerPayer";
import useUiFeedback from "@/composables/useUiFeedback";
import { storeToRefs } from "pinia";
import ItemsPerPageSelector from "@/components/ItemsPerPageSelector.vue";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
definePageMeta({
  middleware: "auth",
  permission: "partner.payers.list"
})
const permissionStore = usePermissionStore()
const {
  loading,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  confirmAction,
} = useUiFeedback();

const { $axios } = useNuxtApp();
const route = useRoute();

const partnerData = ref(null);
const payers = ref([]);
const pagination = ref({});
const selectedCountryId = ref(null);
const formRef = ref(null);

const countryCurrencyStore = useCountryCurrencyStore();
const { countries } = storeToRefs(countryCurrencyStore);

const {
  headers,
  payersDropDown,
  payerError,
  resolveStatusVariant,
  fetchPayers,
  UpdatePayerPartnerStatus,
  savePartnerPayer,
  deletePartnerPayer,
} = usePartnerPayer();

const formData = ref({
  partner_code: "",
  payer_id: "",
  partner_id: route.query.id || null,
});

const options = ref({
  itemsPerPage: 5,
  page: 1,
});
watch(selectedCountryId, (countryId) => {
  if (countryId) {
    fetchPayers({ country_id: countryId });
  }
});

const getPartnerInfo = async () => {
  try {
    const response = await $axios.get(`/partner/${route.query.id}`);
    partnerData.value = response.data.data;
  } catch (error) {
    console.error("Failed to fetch partner data", error);
  }
};

const getPartnerPayers = async (withPagination = true) => {
  showLoading("Fetching Payers...");
  try {
    const response = await $axios.get(`/partner/payers/list/${route.query.id}`, {
      params: {
        pagination: withPagination,
        page: pageNo.value,
        per_page: itemsPerPage.value,
      },
    });

    if (response.data.success) {
      if (withPagination && response.data.data?.data) {
        payers.value = response.data.data.data.map((item) => ({
          id: item.id ?? "--",
          name: item.name ?? "--",
          currency: item.currency ?? "--",
          country: item.country ?? "--",
          method: item.method ?? "--",
          partner_code: item.partner_code ?? "--",
          created_by: item.created_by ?? "--",
          status: item.status,
        }));

        pagination.value = response.data.data; // ✅ keep meta+links structure
      } else {
        payers.value = response.data.data.map((item) => ({
          id: item.id ?? "--",
          name: item.name ?? "--",
          currency: item.currency ?? "--",
          country: item.country ?? "--",
          method: item.method ?? "--",
          partner_code: item.partner_code ?? "--",
          created_by: item.created_by ?? "--",
          status: item.status,
        }));
      }
    } else {
      showError("Failed to fetch partner payers.");
    }
  } catch (error) {
    showError("Something went wrong while fetching partner payers.");
    console.error(error);
  } finally {
    hideLoading();
  }
};

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  getPartnerPayers,
  {
    initialPage: 1,
    initialPerPage: 10,
  }
);

const submitForm = async () => {
  formData.value.partner_id = route.query.id;

  await savePartnerPayer(formData.value);
  await getPartnerPayers();
  resetForm();
};

const resetForm = () => {
  selectedCountryId.value = null;
  formData.value.partner_code = "";
  formData.value.payer_id = "";

  if (formRef.value) {
    if (formRef.value) {
      formRef.value.resetValidation();
      formRef.value.reset();
    }
  }
};

const deleteUser = async (id) => {
  await deletePartnerPayer(id);
  await getPartnerPayers();
};


const UpdateStatus = async (id, currentStatus) => {
  const newStatus = currentStatus === 'Active' || currentStatus === 1 ? 0 : 1;
  await UpdatePayerPartnerStatus(id, { status: newStatus });
  await getPartnerPayers();
};

const updatePartnerCode = async (item) => {
  try {
    showLoading();
    await $axios.patch(`/partner/payer/update/${item.id}`, {
      partner_code: item.partner_code,
    });
    showSuccess("Partner code updated successfully");
    await getPartnerPayers(); // refresh the data list
  } catch (err) {
    showError("Failed to update partner code");
    console.error(err);
  } finally {
    hideLoading();
  }
};

onMounted(async () => {
  await getPartnerInfo();
  await getPartnerPayers();
});
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex align-center bg-grey">
          <BackNavigation />
          <h4 class="text-h5 py-3">Payer Partner</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="px-0">
      <PartnerDetail v-if="partnerData" :partner="partnerData" />
    </v-card-text>
  </v-card>
  <v-card class="mt-6 px-0">
    <v-row>
      <v-col cols="12" v-if="permissionStore.hasPermission('partner.payer.store')">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Add Payer</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text v-if="permissionStore.hasPermission('partner.payer.store')">
      <VForm ref="formRef" @submit.prevent="submitForm">
        <v-row class="ps-0">
          <v-col cols="12" sm="10" md="10" class="ps-1">
            <v-row>
              <VCol cols="12" sm="6" md="4">
                <span class="fs-16 label-color" v-html="requiredLabel('Country')"></span>
                <AppAutocomplete v-model="selectedCountryId" :items="countries" item-title="name" item-value="id"
                  placeholder="Select Country" :rules="[requiredValidator]" />
              </VCol>
              <VCol cols="12" sm="6" md="4">
                <span class="fs-16 label-color" v-html="requiredLabel('Add Payer')"></span>
                <AppAutocomplete v-model="formData.payer_id" :items="payersDropDown" :item-title="(item) => {
                  const n = item?.name ?? '';
                  const m = item?.method ?? '';
                  return n && m ? `${n} - ${m}` : n || m;
                }" item-value="id" placeholder="AFF" :rules="[requiredValidator]">
                  <template #item="{ item, props, selected }">
                    <div v-bind="props" class="px-3 py-1 mb-2" :class="selected ? 'bg-primary text-white' : 'text-body'"
                      style="border-radius: 4px;">
                      {{ item?.name || item?.raw?.name }} - <b class="bg-primary px-1 py-1 rounded text-capitalize">{{ item?.method === 'mobile_wallet' ? 'mobile wallet' : item?.method  || item?.raw?.method === 'mobile_wallet' ? 'mobile wallet' : item?.raw?.method
                        }}</b>
                    </div>
                  </template>

                  <template #selection="{ item }">
                    <span v-if="item">
                      {{ item?.name || item?.raw?.name }} - <b class="text-primary text-capitalize">{{ item?.method === 'mobile_wallet' ? 'mobile wallet' : item?.method  || item?.raw?.method === 'mobile_wallet' ? 'mobile wallet' : item?.raw?.method
                        }}</b>
                    </span>
                    <span v-else>Select method</span>
                  </template>
                </AppAutocomplete>
              </VCol>

              <v-col cols="12" sm="6" md="4">
                <span class="fs-16 label-color">Partner Code</span>
                <AppTextField v-model="formData.partner_code" name="name" Placeholder="Partner Code" />
              </v-col>
            </v-row>
          </v-col>
          <VCol cols="12 gap-2 pt-sm-8" sm="6" md="2">
            <VBtn type="submit" class="login-btn" variant="tonal" color="white">
              Add Payer
            </VBtn>
          </VCol>
        </v-row>
      </VForm>
    </v-card-text>

    <v-card-text class="px-0">
      <VDatableComponent :headers="headers" :items="payers" :loading="loading" :pagination="pagination" :pageNo="pageNo"
        @update:pageNo="pageNo = $event">
        <!-- Partner Code Input and Save Button -->
        <template #item.partner_code="{ item }">
          <div class="d-flex gap-2 align-center">
            <VTextField v-model="item.partner_code" dense hide-details variant="outlined" class="ma-0 pa-0"
              style="max-inline-size: 150px;" :readonly="!permissionStore.hasPermission('partner.payer.updateCode')" />
            <VBtn size="small" icon variant="flat" color="primary" @click="updatePartnerCode(item)"
              v-if="permissionStore.hasPermission('partner.payer.updateCode')">
              <VIcon icon="tabler-check" />
            </VBtn>
          </div>
        </template>

        <!-- Status Chip -->
        <template #item.status="{ item }">
          <VChip :color="resolveStatusVariant(item.status).color" class="font-weight-medium" size="small">
            {{ resolveStatusVariant(item.status).text }}
          </VChip>
        </template>

        <!-- Action Buttons -->
        <template #item.action="{ item }">
          <!-- <div class="d-flex gap-1">
          
          </div> -->

          <div class="d-flex gap-1">
            <!-- <IconBtn @click="deleteUser(item.id)">
              <VIcon icon="tabler-trash" />
            </IconBtn> -->
            <VBtn :color="item.status ? 'error' : 'success'" @click="UpdateStatus(item.id, item.status)" size="small"
              v-if="permissionStore.hasPermission('partner.payers.status')">
              {{ item.status ? 'inactive' : 'Active' }}
            </VBtn>
          </div>
        </template>
      </VDatableComponent>
    </v-card-text>
  </v-card>
</template>
