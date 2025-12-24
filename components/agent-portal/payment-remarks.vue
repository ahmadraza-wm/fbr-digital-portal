<script setup>
import AppTextarea from "@/@core/components/app-form-elements/AppTextarea.vue";
import { useAgentTransactions } from "@/composables/agentPortal/useTransctions";
import { requiredValidator } from "@/@core/utils/validators";
import { ref } from "vue";
const permissionStore = usePermissionStore()
const{transactionsRemarks,fetchTransactionsReamrksById,storeTransactionsRemarks} = useAgentTransactions();

const emit = defineEmits(["refetchSenderDocuments"]);

const transactionRemarks = ref(false);
const showTable = ref(false);

const toggleTable = () => {
  showTable.value = !showTable.value;
};

const props = defineProps({
  remarks: {
    type: Array,
    required: true,
  },
  transaction_id: {
    type: [String, Number],
    required: true,
  },
});

const statusOptions = ref([
  { title: "Internal", value: "internal" },
  { title: "Visible to Customer", value: "visible_to_customer" },
]);

const selectedCategory = ref("");
const description = ref("");

const categoryOptions = ref([
  { title: "Auto Cancel", value: "auto_cancel" },
  { title: "Webhooks", value: "webhooks" },
  { title: "Name Change", value: "name_change" },
  { title: "Document Upload", value: "document_upload" },
  { title: "Status Change", value: "status_change" },
  { title: "Compliance", value: "compliance" },
]);

function formatCategory(category) {
  return category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(date) {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const form = ref({
   transaction_id:'',
   category:'',
   remark_status:'',
   description:''
});

const handleSubmit = async () => {
  form.value.transaction_id = props.transaction_id;
  await storeTransactionsRemarks(form.value);
  transactionRemarks.value = false;
};

const headers = [
    { title: "#", key: "sr" },
    { title: "Type", key: "category" },
    { title: "Description", key: "description" },
    { title: "Added By", key: "created_by" },
    { title: "Added At", key: "created_at" },
  ];

watch(
  () => props.transaction_id,
  async (newId) => {
    if (newId) {
      await fetchTransactionsReamrksById(newId);
    }
  },
  { immediate: true }
);
</script>

<template>
  <VCard class="border">
    <v-card-title class="border-b-sm bg-grey d-flex align-center justify-space-between bg-grey">
      <VRow>
        <VCol cols="6">
          <h4 class="text-h5 py-3">Transaction Remarks</h4>
        </VCol>
      </VRow>
      <VCol cols="6" class="gap-5 text-end">
        <VBtn color="primary" class="me-3" variant="elevated" prepend-icon="tabler-plus"
          @click="transactionRemarks = true" v-if="permissionStore.hasPermission('agent.portal.transactions.remarks.store')">Add
          Remarks</VBtn>
        <VBtn :color="showTable ? 'error' : 'primary'" variant="elevated" @click="toggleTable">
          {{
            showTable ? "Hide Transaction Remarks" : "Show Transaction Remarks"
          }}
        </VBtn>
      </VCol>
    </v-card-title>
    <VCardText class="px-0 pb-0" v-if="showTable">
      <v-data-table :headers="headers" :items="transactionsRemarks" item-key="name" hide-default-footer
        class="border-t-sm border-b-sm">
        <template #item.sr="{ index }">
          {{ index + 1 }}
        </template>
        <template #item.category="{ item }">
          {{ formatCategory(item.category) }}
        </template>
        <template #item.created_by="{ item }">
          <span class="text-capitalize">
            {{ item.created_by?.name || "-" }}
          </span>
        </template>
        <template #item.created_at="{ item }">
          <span class="text-capitalize">
            {{ formatDate(item.created_at) }}
          </span>
        </template>
      </v-data-table>
    </VCardText>
  </VCard>
  <!--Sender Add Document  pop up design by usman faiz -->
  <div class="text-center">
    <!-- Dialog -->
    <v-dialog v-model="transactionRemarks" max-width="600" transition="scale-transition">
      <v-card>
        <v-row>
          <v-col cols="12">
            <v-card-title class="d-flex align-center border-b-sm justify-space-between">
              <h4 class="text-h4 py-3">Add Remarks</h4>
              <IconBtn @click="transactionRemarks = false">
                <VIcon icon="tabler-x" />
              </IconBtn>
            </v-card-title>
          </v-col>
        </v-row>
        <V-card-text class="pt-2">
          <VForm @submit.prevent="handleSubmit">
            <v-row class="ps-0 mt-0">
              <v-col cols="12">
                <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Category')"></span>
                <AppAutocomplete v-model="form.category" name="category" :items="categoryOptions"
                  placeholder="Select Category" :rules="[requiredValidator]" />
              </v-col>
              <v-col cols="12">
                <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Remarks Status')"></span>
                <AppAutocomplete v-model="form.remark_status" name="remarksStatus" :items="statusOptions"
                  placeholder="Select Remarks Status" :rules="[requiredValidator]" />
              </v-col>
              <v-col cols="12">
                <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Description')"></span>
                <AppTextarea v-model="form.description" name="description" rows="2" placeholder="Type here"
                  :rules="[requiredValidator]" />
              </v-col>

              <VCol cols="12" class="d-flex gap-2 align-end justify-end">
                <VBtn type="reset" color="secondary" variant="tonal" @click="transactionRemarks = false">Discard</VBtn>
                <VBtn type="submit" class="login-btn" variant="tonal">Add Remarks</VBtn>
              </VCol>
            </v-row>
          </VForm>
        </V-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
