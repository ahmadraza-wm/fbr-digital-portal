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
  { title: "Date", key: "date" },
  { title: "Transfer Code", key: "trans_code" },
  { title: "Customer", key: "customer" },
  { title: "Complaint", key: "complaint" },
  { title: "Status", key: "status" },
];
const Complaints = ref([
  {
    sr_no: 1,
    date: "2025-01-10",
    trans_code: "TR-202401",
    customer: "Ali Khan",
    complaint: "Incorrect amount received",
    status: "Open",
  },
  {
    sr_no: 2,
    date: "2025-01-12",
    trans_code: "TR-202402",
    customer: "Ahmed Raza",
    complaint: "Delay in transfer processing",
    status: "Closed",
  },
  {
    sr_no: 3,
    date: "2025-01-15",
    trans_code: "TR-202403",
    customer: "Usman Tariq",
    complaint: "Wrong beneficiary details",
    status: "Open",
  },
  {
    sr_no: 4,
    date: "2025-01-18",
    trans_code: "TR-202404",
    customer: "Bilal Ahmed",
    complaint: "Transfer reversed automatically",
    status: "Closed",
  },
  {
    sr_no: 5,
    date: "2025-01-20",
    trans_code: "TR-202405",
    customer: "Hamza Yousaf",
    complaint: "Customer unable to track payment",
    status: "Open",
  },
]);

</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex align-center" style="background-color: lightgrey;">
          <BackNavigation />
          <h4 class="text-h5 py-3">Complaints</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <VCardText class="d-flex flex-wrap gap-4 justify-space-between mt-0 pb-2">
      <div class="me-3 d-flex gap-3">
        <ItemsPerPageSelector v-model="itemsPerPage" @update:model-value="updateItemsPerPage" />
      </div>
    </VCardText>


    <VDatableComponent :headers="headers" :items="Complaints" :loading="loading" :search="search"
      :pagination="pagination" :pageNo="pageNo" @update:pageNo="pageNo = $event" class="border-t-sm">
      <template #item.status="{ item }">
        <div class="d-flex gap-2">
          <VChip :style="{
            backgroundColor:
              item.status === 'Open' ? '#FF9F4329' : '#28C76F29 ',
            color: item.status === 'Open' ? '#FF9F43' : '#28C76F',
            marginTop: '2px',
          }" class="font-weight-light fs-12 p-1" size="small">
            {{ item.status }}
          </VChip>
        </div>
      </template>
    </VDatableComponent>
  </v-card>
</template>
