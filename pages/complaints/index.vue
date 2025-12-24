<script setup>
import { useComplaints } from "@/composables/useComplaints";
import data from "@/views/demos/forms/tables/data-table/datatable";
import AuditLog from '@/components/AuditLog.vue'
import { ref } from "vue";
definePageMeta({
  middleware: "auth",
  permission: "complaints.index"
})
const permissionStore = usePermissionStore()
const sendingCountry = ref(null);
const receivingCountry = ref(null);
const userList = ref([]);
const complaintDetail = ref(false);
const complaintshowdata = ref(false);

const isReopened = ref(false);

const complaintComments = ref([]);

const {
  fetchComplaints,
  complaintslist,
  filterComplaints,
  filters,
  comment,
  showError,
  resetFilters,
  fetchComplaintById,
  updateComplaintStatus,
  submitComplainComments,
  pagination,
} = useComplaints();


const selectedId = ref(null)

const openAuditLog = (item) => {
  if (selectedId.value === item.id) {
    selectedId.value = null
  } else {
    selectedId.value = item.id
  }
}

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  fetchComplaints,
  {
    initialPage: 1,
    initialPerPage: 10,
  }
);

const searchfilter = () => {
  filterComplaints(filters.value);
};

const openComplaintsDialog = async (id) => {
  const data = await fetchComplaintById(id);
  if (data) {
    complaintshowdata.value = data.complaint;
    complaintComments.value = data.comments;
    complaintDetail.value = true;

    isReopened.value = data.complaint.status.toLowerCase() === "open";
  }
};

const toggleComplaintStatus = async () => {
  isReopened.value = !isReopened.value;

  const currentStatus = complaintshowdata.value.status?.toLowerCase();
  const newStatus = currentStatus === "open" ? "closed" : "open";
  console.log("new status:", newStatus);

  await updateComplaintStatus(complaintshowdata.value.id, newStatus);

  await fetchComplaints();

  const updatedComplaint = complaintslist.value.find(
    (Complaint) => Complaint.id === complaintshowdata.value.id
  );

  if (updatedComplaint) {
    complaintshowdata.value = { ...updatedComplaint };
    isReopened.value = updatedComplaint.status.toLowerCase() === "open";
  }

  console.log("Updated complaint status:", complaintshowdata.value);
};

const submitComments = async () => {
  if (!comment.value || comment.value.trim() === "") {
    return showError("Comment cannot be empty.");
  }

  try {
    const complaintId = complaintshowdata.value.id;
    const payload = {
      comment: comment.value,
    };

    console.log("comments", payload);
    await submitComplainComments(complaintId, payload);
    const data = await fetchComplaintById(complaintId);

    if (data) {
      complaintComments.value = data.comments;
      complaintDetail.value = true;
    }

    comment.value = "";
  } catch (err) {
    console.error(err);
  }
};

const country = ref([
  { title: "Pakistan", value: "Pakistan" },
  { title: "UK", value: "UK" },
  { title: "USA", value: "USA" },
]);

const statuses = ref([
  { title: "Open", value: "open" },
  { title: "Closed", value: "closed" },
]);
const options = ref({
  page: 1,
  itemsPerPage: 5,
  sortBy: [""],
  sortDesc: [false],
});

const headers = [
  {
    title: "#",
    key: "sr_no",
  },
  {
    title: "Complaint ID",
    key: "complaintid",
  },
  {
    title: "Customer ID	",
    key: "customerid",
  },
  {
    title: "Customers",
    key: "fullName",
  },
  {
    title: "Category",
    key: "category",
  },
  {
    title: "Description",
    key: "description",
  },

  {
    title: "Status",
    key: "status",
  },
  {
    title: "Created At",
    key: "created_at",
  },
  {
    title: "Updated At",
    key: "updated_at",
  },

  {
    title: "Details",
    key: "action",
  },
];
</script>

<template>
  <v-card class="mt-5">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm py-0">
          <h4 class="text-h5 py-6 mb-0">Search Complaints</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="border-b-sm mb-7" v-if="permissionStore.hasPermission('complaints.search')">
      <VForm @submit.prevent="searchfilter">
        <VRow>
          <VCol cols="10">
            <VRow>
              <VCol cols="4">
                <span class="fs-14 label-color font-weight-regular"
                  >Complaint Id</span
                >
                <AppTextField
                  type="number"
                  name="complaintID"
                  placeholder="Complaint Id"
                  v-model="filters.complaint_id"
                />
              </VCol>

              <VCol cols="4">
                <span class="fs-14 label-color font-weight-regular"
                  >Customer Id</span
                >
                <AppTextField
                  type="number"
                  name="customerID"
                  placeholder="Customer Id"
                  v-model="filters.customer_id"
                />
              </VCol>
              <VCol cols="4">
                <span class="fs-14 label-color font-weight-regular"
                  >Status</span
                >
                <AppAutocomplete
                  placeholder="Status"
                  :items="statuses"
                  v-model="filters.status"
                />
              </VCol>
            </VRow>
          </VCol>
          <VCol cols="2" class="d-flex align-end">
            <div class="d-flex align-center justify-center align-center gap-2">
              <VBtn class="login-btn" variant="tonal" type="submit"
                >Search</VBtn
              >
              <VBtn
                color="secondary"
                type="reset"
                variant="tonal"
                @click="resetFilters"
                >Reset</VBtn
              >
            </div>
          </VCol>
        </VRow>
      </VForm>
    </v-card-text>
    <VCardText class="d-flex flex-wrap gap-4 justify-between pt-7 pb-3">
        <ItemsPerPageSelector
          v-model="itemsPerPage"
          @update:model-value="updateItemsPerPage"
        />
    </VCardText>

    <VCardText class="px-0 border-t-sm">
      <VDatableComponent
        :headers="headers"
        :items="complaintslist"
        :loading="loading"
        :search="search"
        :pagination="pagination"
        :pageNo="pageNo"
        @update:pageNo="pageNo = $event"
      >
        <template #item.complaintid="{ item }">
          <div>{{ item.id }}</div>
        </template>

        <template #item.customerid="{ item }">
          <div>{{ item.customer.id }}</div>
        </template>

        <template #item.fullName="{ item }">
          <NuxtLink :to="`/customers/view/${item.customer.id}`">{{
            item.full_name
          }}</NuxtLink>
        </template>

        <template #item.category="{ item }">
          <div>{{ item.type }}</div>
        </template>

        <template #item.description="{ item }">
          <div>{{ item.description }}</div>
        </template>

        <template #item.status="{ item }">
          <VChip
            :style="{
              backgroundColor:
                item.status === 'Open' ? '#FF9F4329' : '#28C76F29 ',
              color: item.status === 'Open' ?  '#FF9F43' : '#28C76F',
              marginTop: '2px',
            }"
            class="font-weight-light fs-12 p-1"
            size="small"
          >
            {{ item.status }}
          </VChip>
        </template>

        <template #item.created_at="{ item }">
          <div>{{ item.created_at }}</div>
        </template>

        <template #item.updated_at="{ item }">
          <div>{{ item.updated_at }}</div>
        </template>

        <!-- Actions -->
        <template #item.action="{ item }">
         
            <VBtn
                icon
                variant="text"
                color="medium-emphasis"
                @click="openAuditLog(item)"
              >
              <VIcon icon="tabler-history" />
            </VBtn>
          <IconBtn class="text-color">
            <NuxtLink class="menu-link" @click="openComplaintsDialog(item.id)">
              <VIcon icon="tabler-eye" />
            </NuxtLink>
          </IconBtn>
        </template>
      </VDatableComponent>
    </VCardText>
  </v-card>

  <div class="text-center">
    <V-dialog
      v-model="complaintDetail"
      max-width="1000"
      transition="scale-transition"
    >
      <v-card>
        <VForm>
          <v-row>
            <v-col cols="12">
              <v-card-title
                class="border-b-sm border-t-sm d-flex justify-space-between align-center"
                style="background-color: #fbfafa"
              >
                <h4 class="text-h5 py-3">Complain Details</h4>
                <VBtn
                  :color="isReopened ? 'error' : 'primary'"
                  @click="toggleComplaintStatus" v-if="permissionStore.hasPermission('complaints.status.update')"
                >
                  {{ isReopened ? "Mark as Close" : "Reopen Complaint" }}
                </VBtn>
              </v-card-title>
            </v-col>
          </v-row>
          <v-card-text class="px-3">
            <v-row class="px-5 border-b-sm">
              <v-col cols="6" sm="4" md="3" class="pb-1">
                <p class="font-weight-medium text-color mb-0 lh-22">
                  Complain ID
                </p>
                <p class="font-weight-medium mb-0 lh-22 text-color1">
                  {{ complaintshowdata?.id }}
                </p>
              </v-col>
              <v-col cols="6" sm="4" md="3" class="pb-1">
                <p class="font-weight-medium text-color mb-0 lh-22">
                  Complain Type
                </p>
                <p class="font-weight-medium mb-0 lh-22 text-color1">
                  {{ complaintshowdata?.type }}
                </p>
              </v-col>
              <v-col cols="6" sm="4" md="3" class="pb-1">
                <p class="font-weight-medium text-color mb-0 lh-22">
                  Transfer No
                </p>
                <p class="font-weight-medium mb-0 lh-22 text-color1">
                  {{ complaintshowdata?.transaction_code }}
                </p>
              </v-col>
              <v-col cols="6" sm="4" md="3" class="pb-1 px-0">
                <p class="font-weight-medium text-color mb-0 lh-22">
                  Description
                </p>
                <p class="font-weight-medium mb-0 lh-22 text-color1">
                  {{ complaintshowdata?.description }}
                </p>
              </v-col>
            </v-row>
            <v-row class="px-5 border-b-sm">
              <v-col cols="6" sm="4" md="3" class="pb-1">
                <p class="font-weight-medium text-color mb-0 lh-22">Status</p>
                <VChip color="success" variant="tonal" size="small">{{
                  complaintshowdata?.status
                }}</VChip>
              </v-col>
              <v-col cols="6" sm="4" md="3" class="pb-1">
                <p class="font-weight-medium text-color mb-0 lh-22">
                  Created At
                </p>
                <p class="font-weight-medium mb-0 lh-22 text-color1">
                  {{ complaintshowdata?.created_at }}
                </p>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text class="mb-5 pb-0 px-0">
            <h4 class="text-h5 text-color mb-0 pb-4 mt-1 border-b-sm px-4 font-weight-bold">
              Post a Comment
            </h4>
            <VRow class="px-4 mt-3 post-section border-b-sm" v-if="isReopened">
              <VCol cols="12">
                <span class="fs-14 label-color font-weight-regular"
                  >Description</span
                >
                <AppTextarea
                  rows="3"
                  name="description"
                  placeholder="Type here.."
                  v-model="comment"
                />
              </VCol>
              <VCol cols="12 text-end">
                <VBtn class="login-btn" variant="tonal" @click="submitComments">Post</VBtn>
              </VCol>
            </VRow>
            <!-- <v-row class="px-4 mt-3">
              <VCol cols="12">
                <h5 class="mb-0">Support Team (Atasam)</h5>
                <p class="mb-0 fs-12">Ticket has been closed.</p>
                <p class="mb-0 fs-10">
                  <VIcon icon="tabler-line-dashed"></VIcon> 07 Mar, 2025 08:13:04 AM
                </p>
              </VCol>
            </v-row>
            -->
            <v-row
              class="px-4 mt-3"
              v-for="(c, index) in complaintComments"
              :key="c.id || index"
            >
              <VCol cols="12">
                <h5 class="mb-0">{{ c.created_by || "Support Team" }}</h5>
                <p class="mb-0 fs-12">{{ c.comment }}</p>
                <p class="mb-0 fs-10">
                  <VIcon icon="tabler-line-dashed" /> {{ c.created_at }}
                </p>
              </VCol>
            </v-row>

            <VRow>
              <VCol cols="12 text-end px-5">
                <VBtn
                  color="secondary"
                  variant="tonal"
                  @click="complaintDetail = false"
                  >Close</VBtn
                >
              </VCol>
            </VRow>
          </v-card-text>
        </VForm>
      </v-card>
    </V-dialog>
  </div>
    <AuditLog
    v-if="selectedId"
    module="Complaint"
    :id="selectedId"
    class="mt-4"
  />
</template>
