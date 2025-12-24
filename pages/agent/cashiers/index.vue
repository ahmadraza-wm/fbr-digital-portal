<script setup>
// definePageMeta({
//   middleware: "auth",
//   permission: ""
// })
// const permissionStore = usePermissionStore()
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const headers = [
  { title: "#", key: "sr_no" },
  { title: "Name", key: "name" },
  { title: "Prefix", key: "prefix" },
  { title: "Email", key: "email" },
  { title: "Status", key: "status" },
];
const Cashiers = ref([
  {
    sr_no: 1,
    name: "Ali Khan",
    prefix: "AK-01",
    email: "ali.khan@example.com",
    status: 1,
  },
  {
    sr_no: 2,
    name: "Ahmed Raza",
    prefix: "AR-05",
    email: "ahmed.raza@example.com",
    status: 0,
  },
  {
    sr_no: 3,
    name: "Usman Tariq",
    prefix: "UT-03",
    email: "usman.tariq@example.com",
    status: 1,
  },
  {
    sr_no: 4,
    name: "Bilal Ahmed",
    prefix: "BA-02",
    email: "bilal.ahmed@example.com",
    status: 1,
  },
  {
    sr_no: 5,
    name: "Hamza Yousaf",
    prefix: "HY-09",
    email: "hamza.yousaf@example.com",
    status: 0,
  },
]);

</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm" style="background-color: lightgrey;">
          <h4 class="text-h5 py-3">Cashiers</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <VCardText class="d-flex flex-wrap gap-4 justify-space-between mt-0 pb-2">
      <div class="me-3 d-flex gap-3">
        <ItemsPerPageSelector v-model="itemsPerPage" @update:model-value="updateItemsPerPage" />
      </div>
    </VCardText>


    <VDatableComponent :headers="headers" :items="Cashiers" :loading="loading" :search="search" :pagination="pagination"
      :pageNo="pageNo" @update:pageNo="pageNo = $event" class="border-t-sm border-b-sm">
      <template #item.status="{ item }">
        <div class="d-flex gap-2">
          <VChip :color="item.status === 1 ? 'success' : 'error'" class="font-weight-light fs-12 p-1" size="small">
            {{ item.status === 1 ? 'Active' : 'Inactive' }}
          </VChip>
        </div>
      </template>
    </VDatableComponent>
    <v-card-text class="py-3">
      <h4 class="text-error mb-0">Note : If you want to add/Edit any information of Cashier, Please contact support team.</h4>
    </v-card-text>
  </v-card>
</template>
