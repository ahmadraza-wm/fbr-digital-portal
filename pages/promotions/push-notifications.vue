<script setup>
import { usePushNotification } from "@/composables/usePushNotification";
import data from "@/views/demos/forms/tables/data-table/datatable";
import AuditLog from '@/components/AuditLog.vue'
definePageMeta({
  middleware: "auth",
  permission: "push.notifications"
})
const permissionStore = usePermissionStore()

const viewPlayload = ref(false)
const payloaddetails = ref(false);
const userList = ref([]);


const {
  fetchNotifications,
  loading,
  notificationlists,
  pagination
} = usePushNotification()

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(fetchNotifications, {
  initialPage: 1,
  initialPerPage: 10,
});

const headers = [
  {
    title: "#",
    key: "sr_no",
  },
  {
    title: "Customer",
    key: "customer",
  },
  {
    title: "Notification Title",
    key: "title",
  },
  {
    title: "Notification Body",
    key: "body",
  },
  {
    title: "Created At",
    key: "created_at",
  },
  {
    title: "ACTION",
    key: "action",
  },
];

const openPayload = (id) => {
  const payloaddata = notificationlists.value.find((notification) => notification.id === id);
  if (payloaddata) {
    payloaddetails.value = payloaddata
    viewPlayload.value = true 
  }


}



const selectedId = ref(null)

const openAuditLog = (item) => {
  if (selectedId.value === item.id) {
    selectedId.value = null
  } else {
    selectedId.value = item.id
  }
}
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Search Notifications</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <VCardText class="flex-wrap gap-4 d-flex justify-space-between align-center pb-2">
      <div class="me-3 d-flex gap-3">
        <ItemsPerPageSelector
          v-model="itemsPerPage"
          @update:model-value="updateItemsPerPage"
        />
      </div>
      <div class="gap-3" v-if="permissionStore.hasPermission('send.notification')">
        <VBtn variant="elevated" color="primary" to="/promotions/send-push-notification">
          Send Notifications
        </VBtn>
      </div>
    </VCardText>

    <VCardText class="px-0 border-t-sm">
      <VDatableComponent
        :headers="headers"
        :items="notificationlists"
        :loading="loading"
        :search="search"
        :pagination="pagination"
        :pageNo="pageNo"
        @update:pageNo="pageNo = $event"
      >
        <template #item.customer="{ item }">
          <div class="fs-13 text-wrap">{{ item.customer?.user?.name }}</div>
        </template>
        <template #item.title="{ item }">
          <div class="fs-13 text-wrap">
            {{ item.title }}
          </div>
        </template>
        <template #item.body="{ item }">
          <div class="fs-13 text-wrap">
            {{ item.body }}
          </div>
        </template>
        <template #item.created_at="{ item }">
          <div class="fs-13 text-wrap">
            {{ item.created_at }}
          </div>
        </template>
        <template #item.action="{ item }">
          <div class="d-flex gap-1">
            
            <VBtn variant="text" color="primary" @click="openPayload(item.id)">
              <u>View Payload</u>
            </VBtn>
             <VBtn
                icon
                variant="text"
                color="medium-emphasis"
                @click="openAuditLog(item)"
              >
              <VIcon icon="tabler-history" />
            </VBtn>
          </div>
        </template>
      </VDatableComponent>
    </VCardText>
  </v-card>
  <div class="text-center">
    <v-dialog v-model="viewPlayload" max-width="800" transition="scale-transition">
      <v-card>
        <v-row>
          <v-col cols="12">
            <v-card-title class="d-flex align-center border-b-sm justify-space-between">
              <h4 class="text-h4 py-1">Payload

              </h4>
              <IconBtn @click="viewPlayload = false">
                <VIcon icon="tabler-x" />
              </IconBtn>
            </v-card-title>
          </v-col>
        </v-row>
        <V-card-text class="pt-0 px-0 pb-2">
          <VDataTable hide-default-footer class="Tablebody border-b">
            <tbody>
              <tr>
                <td class="font-weight-bold">
                  Customer Name
                </td>
                <td>
                  {{ payloaddetails?.payload?.customer }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold">
                  Sending Countries
                </td>
                <td>
                  {{  payloaddetails?.payload?.sending_country }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold">
                  Receiving Countries
                </td>
                <td>
                  {{ payloaddetails?.payload?.receiving_country }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold">
                  Customer Register From
                </td>
                <td>
                  {{  payloaddetails?.payload?.customer_register_from }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold">
                  Customer Register To
                </td>
                <td>
                  {{  payloaddetails?.payload?.customer_register_to  }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold">
                  Added By
                </td>
                <td>
                  {{ payloaddetails?.payload?.added_by }} 
                </td>
              </tr>
            </tbody>
          </VDataTable>
        </V-card-text>
      </v-card>
    
    </v-dialog>
    
  </div>
    <AuditLog
      v-if="selectedId"
      module="PushNotification"
      :id="selectedId"
      class="mt-4"
    />
</template>
<style lang="scss">
.Tablebody tr:nth-child(odd) {
  background-color: #f8f7fa;
}
</style>
