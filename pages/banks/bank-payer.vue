<script setup>
import BackNavigation from "@/@core/components/BackNavigation.vue";
import data from "@/views/demos/forms/tables/data-table/datatable";

const userList = ref([]);
const partners = ref([
  { title: "Bank Transfer", value: "bank" },
  { title: "Cash Pickup", value: "cash" },
  { title: "Mobile Wallet", value: "wallet" },
]);
const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});

const headers = [
  {
    title: "ID",
    key: "id",
  },

  {
    title: "Company Name",
    key: "userName",
  },
  {
    title: "Payer Name",
    key: "userName",
  }, {
    title: "Added By",
    key: "userName",
  },
  {
    title: "Created at",
    key: "startDate",
  },

  {
    title: "Status",
    key: "action",
  },
];

const resolveStatusVariant = (status) => {
  if (status === 1)
    return {
      color: "primary",
      text: "Current",
    };
  else if (status === 2)
    return {
      color: "success",
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

onMounted(() => {
  userList.value = JSON.parse(JSON.stringify(data));
});
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="d-flex align-center" style="background-color: lightgray;">
          <BackNavigation />
          <h4 class="text-h4 py-3">Bank Payer</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-divider></v-divider>

    <v-card-text class="pt-1 my-4 pb-3">
      <v-row class="ps-0">
        <VCol cols="12" class="px-1">
          <h4 class="text-h5 py-3">Create Payer</h4>
        </VCol>
        <VCol cols="12" md="6">
          <AppTextField v-model="bankName" label="Bank Name" placeholder="ABP" />
        </VCol>
        <VCol cols="12" md="6">
          <span class="fs-13 label-color" v-html="requiredLabel('Company Name')"></span>
          <AppAutocomplete v-model="selectedMethod" :items="partners" placeholder="Roze Remit" />
        </VCol>
        <VCol cols="12" md="6">
          <span class="fs-13 label-color" v-html="requiredLabel('Payer')"></span>
          <AppAutocomplete v-model="selectedMethod" :items="partners" placeholder="Type" />
        </VCol>

        <VCol cols="12 d-flex gap-2 align-end justify-start" sm="10" md="6">
          <VBtn type="submit" variant="tonal" class="login-btn">Create Payer</VBtn>
          <VBtn type="reset " variant="tonal" color="secondary">
           Reset
          </VBtn>
        </VCol>
      </v-row>
    </v-card-text>
    <v-divider></v-divider>
    <VCardText class="d-flex flex-wrap gap-4">
      <h4 class="text-h5">Bank Payer List</h4>

    </VCardText>

    <VCardText class="px-0">
      <VDataTable class="partner-list" :headers="headers" :items="userList" :items-per-page="options.itemsPerPage"
        :page="options.page" :options="options">
        <!-- full name -->
        <template #item.fullName="{ item }">
          <div class="d-flex align-center">
            <VAvatar size="32" :color="item.avatar ? '' : 'primary'"
              :class="item.avatar ? '' : 'v-avatar-light-bg primary--text'"
              :variant="!item.avatar ? 'tonal' : undefined">
              <VImg v-if="item.avatar" :src="item.avatar" />
              <span v-else>{{ avatarText(item.fullName) }}</span>
            </VAvatar>
            <div class="d-flex flex-column">
              <span class="text-truncate v-data-table__td">{{
                item.fullName
              }}</span>
              <small>{{ item.post }}</small>
            </div>
          </div>
        </template>
        <!-- User name -->
        <template #item.userName="{ item }">
          <div class="d-flex align-center">
            <div class="d-flex flex-column">
              <span class="text-truncate v-data-table__td">{{
                item.fullName
              }}</span>
            </div>
          </div>
        </template>
        <!-- Currency -->
        <template #item.settlementCurrency="{ item }">
          <div class="d-flex align-center">
            <div class="d-flex flex-column">
              <span class="text-truncate v-data-table__td">{{
                item.city
              }}</span>
            </div>
          </div>
        </template>
        <!-- Currency -->
        <template #item.Country="{ item }">
          <div class="d-flex align-center">
            <div class="d-flex flex-column">
              <span class="text-truncate v-data-table__td">{{
                item.city
              }}</span>
            </div>
          </div>
        </template>

        <!-- status -->
        <template #item.status="{ item }">
          <VChip :color="resolveStatusVariant(item.status).color" class="font-weight-medium" size="small">
            {{ resolveStatusVariant(item.status).text }}
          </VChip>
        </template>
        <!-- Actions -->
        <template #item.action="{ item }">
          <div class="d-flex gap-1">

            <IconBtn>
              <VIcon icon="tabler-trash" />
            </IconBtn>


          </div>
        </template>

        <template #bottom>
          <VCardText class="pt-2">
            <div class="d-flex flex-wrap justify-end gap-y-2 mt-2">
              <VPagination v-model="options.page" :total-visible="$vuetify.display.smAndDown ? 3 : 5"
                :length="Math.ceil(userList.length / options.itemsPerPage)" />
            </div>
          </VCardText>
        </template>
      </VDataTable>
    </VCardText>
  </v-card>
</template>
