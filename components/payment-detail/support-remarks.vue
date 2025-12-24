<script setup>
import { ref } from "vue";
import axios from "axios";
import AppTextField from "@/@core/components/app-form-elements/AppTextField.vue";
import { requiredValidator } from "@/@core/utils/validators";
import useUiFeedback from "@/composables/useUiFeedback";
import { usePayments } from "@/composables/usePayments";
const permissionStore = usePermissionStore()

const {
  loading,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  confirmAction,
} = useUiFeedback();

const {
  fetchSupportRemarks,
} = usePayments();

const { $axios } = useNuxtApp();
const emit = defineEmits(["refetchSenderDocuments"]);

const props = defineProps({
  support_remarks: {
    type: Array,
    required: true,
  },
  transaction_id: {
    type: [String, Number],
    required: true,
  },
});

const supportRemarks = ref(false);
const supportRemarksList = ref([]);
const showTable = ref(false);
const newSupportRemark = ref(""); // <-- bind this to input

const toggleTable = () => {
  showTable.value = !showTable.value;
};

const country = ref([
  { title: "United States", value: "US" },
  { title: "Pakistan", value: "PAK" },
  { title: "Ireland", value: "IE" },
]);

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

// 🔽 Handle Support Remarks Form Submit
const handleSupportSubmit = async () => {
  try {
    if (!newSupportRemark.value) return;

    const payload = {
      transaction_id: props.transaction_id,
      remarks: newSupportRemark.value,
    };

    await $axios.post("/transaction/support/remarks", payload);
    showSuccess("Remarks Added successfully.");
    emit("refetchSenderDocuments");

    newSupportRemark.value = "";
    supportRemarks.value = false;
  } catch (error) {
    console.error("Failed to add support remark:", error);
  }
};

watch(
  () => props.transaction_id,
  async (newId) => {
    if (newId) {
      const remarks = await fetchSupportRemarks(newId);
      supportRemarksList.value = remarks.data || [];
    }
  },
  { immediate: true }
);
</script>

<template>
  <VCard class="my-5 border">
    <v-card-title
      class="border-b-sm bg-grey d-flex align-center justify-space-between bg-grey"
    >
      <VRow>
        <VCol cols="6">
          <h4 class="text-h5 py-3">Support Remarks</h4>
        </VCol>
      </VRow>
      <VCol cols="6" class="gap-5 text-end">
        <VBtn
          color="primary"
          class="me-3"
          variant="elevated"
          prepend-icon="tabler-plus"
          @click="supportRemarks = true" v-if="permissionStore.hasPermission('transactions.support.store')"
        >
          Add Support Remarks</VBtn
        >
        <VBtn
          :color="showTable ? 'error' : 'primary'"
          variant="elevated"
          @click="toggleTable"
        >
          {{ showTable ? "Hide Support Remarks" : "Show Support Remarks" }}
        </VBtn>
      </VCol>
    </v-card-title>
    <VCardText class="px-0 pb-0" v-if="showTable">
      <VTable class="text-no-wrap">
        <thead>
          <tr>
            <th>#</th>
            <th>Remarks</th>
            <th>Added By</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody class="pb-2 text-color font-weight-medium">
          <tr v-for="(remark, index) in supportRemarksList" :key="remark.id">
            <td>{{ index + 1 }}</td>
            <td>{{ remark.remarks }}</td>
            <td>{{ remark.created_by?.name || "-" }}</td>
            <td>{{ formatDate(remark.created_at) }}</td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>
  <div class="text-center">
    <!-- Dialog -->
    <v-dialog
      v-model="supportRemarks"
      max-width="600"
      transition="scale-transition"
    >
      <v-card>
        <v-row>
          <v-col cols="12">
            <v-card-title
              class="d-flex align-center border-b-sm justify-space-between"
            >
              <h4 class="text-h4 py-3">Add Support Remarks</h4>
              <IconBtn @click="supportRemarks = false">
                <VIcon icon="tabler-x" />
              </IconBtn>
            </v-card-title>
          </v-col>
        </v-row>
        <V-card-text class="pt-2">
          <VForm @submit.prevent="handleSupportSubmit">
            <v-row class="ps-0 mt-0">
              <v-col cols="12" sm="12" md="12">
                <span
                  class="fs-15 label-color font-weight-medium"
                  v-html="requiredLabel('Remarks')"
                ></span>
                <AppTextField
                  v-model="newSupportRemark"
                  name="supportRemarks"
                  placeholder="Support Remarks"
                  :rules="[requiredValidator]"
                />
              </v-col>

              <VCol
                cols="12"
                md="12"
                class="d-flex gap-2 align-end justify-end"
              >
              <VBtn
                  type="reset"
                  color="secondary"
                  variant="tonal"
                  @click="supportRemarks = false"
                >
                  Discard
                </VBtn>
                <VBtn type="submit" class="login-btn" variant="tonal">
                  Add Support Remarks
                </VBtn>
              </VCol>
            </v-row>
          </VForm>
        </V-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
