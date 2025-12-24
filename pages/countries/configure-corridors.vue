<script setup>
import { useConfigureCorridors } from "@/composables/useConfigureCorridors";
import data from "@/views/demos/forms/tables/data-table/datatable";
import AuditLog from '@/components/AuditLog.vue'

import { ref } from 'vue';
const countryCurrencyStore = useCountryCurrencyStore();
const { countries } = storeToRefs(countryCurrencyStore);
const permissionStore = usePermissionStore()
definePageMeta({
  middleware: "auth",
  permission: "corridors.index"
})
const userList = ref([]);

const selectedId = ref(null)

const openAuditLog = (item) => {
  if (selectedId.value === item.id) {
    selectedId.value = null
  } else {
    selectedId.value = item.id
  }
}


const {

  fetchConfigureCorridors,
  corridorslist,
  form,
  saveConfigureCorridor,
  resetForm,
  deleteConfigureCorridor,
  loading,
  pagination,
} = useConfigureCorridors();

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(fetchConfigureCorridors, {
  initialPage: 1,
  initialPerPage: 10,
});


const headers = [
  {
    title: "#",
    key: "sr_no",
  },
  {
    title: "Sending Countries",
    key: "sending",
  },
  {
    title: "Receiving Countries",
    key: "receiving",
  },
  {
    title: "Promotional Rate",
    key: "rate",
  },

  {
    title: "Status",
    key: "status",
  },


  {
    title: "Action",
    key: "action",
  },
];

const resolveStatusVariant = (status) => {
  if (status === 1)
    return {
      color: "success",
      text: "Active",
    };
  else if (status === 2)
    return {
      color: "primary",
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


const submitForm = () => {
  saveConfigureCorridor(form.value);
};

</script>

<template>
  <v-card class="mt-5">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm  py-0">
          <h4 class="text-h5 py-6 mb-0">Configure Corridors</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="border-b-sm mb-6" v-if="permissionStore.hasPermission('corridors.create')">
      <VForm @submit.prevent="submitForm">
        <VRow>
          <VCol cols="9">
            <VRow>
              <VCol cols="6">
                <span class="fs-14 label-color font-weight-regular">Sending Country</span>
                <AppAutocomplete v-model="form.sending_country_id" :items="countries" item-title="name" item-value="id"
                  name="country" placeholder="Sending Country" autocomplete="off" />
              </VCol>
              <VCol cols="6">
                <span class="fs-14 label-color font-weight-regular">Receiving Country</span>
                <AppAutocomplete v-model="form.receiving_country_id" :items="countries" item-title="name"
                  item-value="id" name="country" placeholder="Receiving Country" autocomplete="off" />

              </VCol>
            </VRow>
          </VCol>
          <VCol cols="3" class="d-flex align-end justify-start">
            <div class="d-flex align-center justify-start align-center gap-2">
              <VBtn class="login-btn" variant="tonal" type="submit">Add</VBtn>
              <VBtn color="secondary" type="reset" variant="tonal" @click="resetForm">Reset</VBtn>
            </div>
          </VCol>
        </VRow>
      </VForm>
    </v-card-text>
    <VCardText class="d-flex flex-wrap gap-4 justify-between border-b-sm pb-4">
      <div class="me-3 d-flex gap-3 pt-2">
      <ItemsPerPageSelector
          v-model="itemsPerPage"
          @update:model-value="updateItemsPerPage"
        />
      </div>
      <VSpacer />
    </VCardText>

    <VCardText class="px-0">
      <VDatableComponent
        :headers="headers"
        :items="corridorslist"
        :loading="loading"
        :search="search"
        :pagination="pagination"
        :pageNo="pageNo"
        @update:pageNo="pageNo = $event"
      >


        <template #item.sending="{ item }">
          {{ item.sending_country.name }}

        </template>

        <template #item.receiving="{ item }">
          {{ item.receiving_country.name }}

        </template>


        <template #item.rate="{ item }">
          <p class="fs-13 mb-0 text-truncate text-disabled" style="color: #9e9e9e;">
            {{ item.rate ?? '0.00' }}
          </p>

        </template>
        <template #item.status="{ item }">
          <VChip :color="resolveStatusVariant(item.status).color" class="font-weight-medium" size="small">
            {{ resolveStatusVariant(item.status).text }}
          </VChip>
        </template>


        <!-- Actions -->
        <template #item.action="{ item }">
          <NuxtLink class="border-e-md border-secondary me-2 pe-2 text-disabled">Apply Rate</NuxtLink>
          <NuxtLink class="border-secondary me-2 pe-2 text-disabled">Active</NuxtLink>
          <NuxtLink class="me-2 pe-2 text-color cursor-pointer d-none" @click="deleteConfigureCorridor(item.id)">Delete
          </NuxtLink>
            <VBtn
                icon
                variant="text"
                color="medium-emphasis"
                @click="openAuditLog(item)"
              >
                <VIcon icon="tabler-history" />
              </VBtn>
        </template>
      </VDatableComponent>
    </VCardText>
  </v-card>
   <AuditLog
    v-if="selectedId"
    module="Corridor"
    :id="selectedId"
    class="mt-4"
  />
</template>
