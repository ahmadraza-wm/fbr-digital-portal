<script setup>
import { onMounted, computed } from "vue";
import CustomerFilter from "@/components/customers/CustomerFilter.vue";
import { usePayments } from "@/composables/usePayments";
import useUiFeedback from "@/composables/useUiFeedback";
definePageMeta({
  middleware: "auth",
  permission: "transactions.processing_transfer"
})
const permissionStore = usePermissionStore()
const { $axios } = useNuxtApp();

const {
  headers,
  payments,
  options,
  total_transactions,
  total_sending_amount,
  total_charges,
  total_receiving_amount,
  fetchTransactions,
  resolveStatusVariant,
  getPartnerLink,
  pagination,
} = usePayments();

const defaultFilters = { status: ["processing_transfer"] };

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  (params) => fetchTransactions({ ...defaultFilters, ...params }),
  {
    initialPage: 1,
    initialPerPage: 50,
  }
);

const {
  loading,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  confirmAction,
} = useUiFeedback();

const clearForm = ref(false);
const showAdvancedSearch = ref(false);
const selectedPartner = ref(null);
const isRelease = ref(0);

const releaseCompleted = ref(false);


const releaseFromLock = async () => {
        if (selected.value.length !== 1) {
            showError("Please select exactly one transaction to release.");
            return;
        }
        try {
            showLoading();
            const transactionId = selected.value[0].id;


            console.log('transactionid',transactionId);
            console.log('is_release',isRelease.value);

            const response = await $axios.post("/release/from/lock", {
              transaction_id: transactionId,
              is_release: isRelease.value,
            });

            console.log('lock response',response);

            showSuccess(response.data.message);

            releaseCompleted.value = true; 
            
        } catch (error) {
            const messages =
            error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Failed to release from lock.";
            showError(messages);
        } finally {
            hideLoading();
        }
        };



const formatText = (text) => {
  if (!text) return "";
  return text.replace(/_/g, " ").toUpperCase();
};

const isSelected = (item) => selected.value.includes(item);
const action = ref(false);
const selected = ref([]);
const partners = ref([]);

const toggleSelection = (item) => {
  const index = selected.value.findIndex((i) => i === item);
  if (index > -1) {
    selected.value.splice(index, 1);
  } else {
    selected.value.push(item);
  }
};

const fetchPartnersForTransactions = async () => {
  if (selected.value.length === 0) return;

  try {
    showLoading();
    const ids = selected.value.map((tx) => tx.id);
    const response = await $axios.get("/get/transaction/partners", {
      params: {
        transaction_ids: ids,
      },
    });
    partners.value = response.data.data;
  } catch (error) {
    showError("Failed to fetch partners.");
  } finally {
    hideLoading();
  }
};

const handleAction = async () => {

  const hasWithPartner = selected.value.some(tx => tx.partner_id && tx.partner_id !== "-");
  const hasWithoutPartner = selected.value.some(tx => !tx.partner_id || tx.partner_id === "-");

  if (hasWithPartner && hasWithoutPartner) {
    showError("Transaction cannot be processed");
    return;
  }
  if (selected.value.length > 0) {
    await fetchPartnersForTransactions();
    action.value = true;
  } else {
    showError("Please Select atleast one transaction to proceed.");
  }
};
onMounted(() => {
  loadPage();
});

const onFilterUpdated = (filters) => {
  fetchTransactions({ ...defaultFilters, ...filters });
};

const onFilterReset = () => {
  fetchTransactions(defaultFilters);
};

const sendToPartner = async () => {
  if (!selectedPartner.value) {
    showError("Please select a partner.");
    return;
  }

  try {
    showLoading();
    const transactionIds = selected.value.map((tx) => tx.id);
    console.log("selected transactions", transactionIds, selectedPartner.value);

    const res = await $axios.post("/send/to/partner", {
      transaction_ids: transactionIds,
      partner_id: selectedPartner.value,
    });
    
     if (res.data.success) {
      showSuccess(res.data.message);
    }
    else{
          showError(res.data.message);
    }

    // showSuccess("Transactions sent successfully.");
    action.value = false;
    fetchTransactions({ status: ["processing_transfer"] });
    selected.value = [];
    selectedPartner.value = null;
  } catch (error) {
    console.error(error);
    const messages = error.response?.data?.errors
      ? Object.values(error.response.data.errors).flat()
      : error.response?.data?.message || "Failed to send transaction to Partner";
    showError(messages);
  } finally {
    hideLoading();
  }
};
const totalSendingAmount = computed(() =>
  selected.value.reduce((sum, tx) => sum + parseFloat(tx.sending_amount || 0), 0)
);

const totalReceivingAmount = computed(() =>
  selected.value.reduce((sum, tx) => sum + parseFloat(tx.receiving_amount || 0), 0)
);

const hasPartner = computed(() => {
  return selected.value.some((tx) => {
    console.log("Transaction:", tx.id, "Partner ID:", tx.partner_id, "Status:", tx.status_value);
    return (
      tx.partner_id &&
      tx.partner_id !== "-" &&
      tx.status_value === "processing_transfer"
    );
  });
});

const resetActionModal = () => {
  action.value = false
  selected.value = []
  selectedPartner.value = null
  partners.value = []
  releaseCompleted.value = false
  isRelease.value = 0
}

</script>

<template>
  <div>
    <PaymentCard
      :totalTransactions="total_transactions"
      :totalSendingAmount="total_sending_amount"
      :totalCharges="total_charges"
      :totalReceivingAmount="total_receiving_amount"
    />
  </div>
  <v-card class="mt-5">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Search Processing Payments</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <V-row>
      <PaymentFilter
        :showPartner="true"
        @filter-updated="onFilterUpdated"
        @filter-reset="onFilterReset"
        :isView="false"
      />
    </V-row>
    <VCardText class="d-flex flex-wrap gap-4 justify-space-between pb-2">
      <div class="me-3 d-flex gap-3">
         <itemPerPage
          v-model="itemsPerPage"
          @update:model-value="updateItemsPerPage"
        />
      </div>
      <VBtn color="primary" variant="elevated" class="text-end" @click="handleAction"
        >Processed With Action
      </VBtn>
    </VCardText>

    <CustomDataTableComponent
      :headers="headers"
      :items="payments"
      :loading="loading"
      :search="search"
      :pagination="pagination"
      :pageNo="pageNo"
      @update:pageNo="pageNo = $event"
      class="border-t-sm"
    >
       <template #row-extra="{ item }">
  <template
    v-if="
      (item.partner_response_message && item.partner_response_message.trim() !== '' && permissionStore.hasPermission('partner_response')) && item.partner_response_message !== '-' ||
      (item.system_remarks && item.system_remarks.trim() !== '' && item.system_remarks !== '-') ||
      (item.customer_remarks && item.customer_remarks.trim() !== '' && item.customer_remarks !== '-') ||
      (item.partner_transaction_reference && permissionStore.hasPermission('partner_response'))
    "
  >
    <tr class="py-0">
      <td class="h-auto my-2"></td>

      <td :colspan="headers.length / 2" class="h-auto my-2">

        <!-- Partner Response -->
        <div
          v-if="item.partner_response_message && item.partner_response_message.trim() !== '' && permissionStore.hasPermission('partner_response') && item.partner_response_message !== '-'"
          class="fs-13"
        >
          <span style="color: red;" class="font-weight-bold">Partner Response: </span>
          <span style="color: red;">{{ item.partner_response_message }}</span>
        </div>

        <!-- System Remarks -->
        <p
          v-if="item.system_remarks && item.system_remarks.trim() !== '' && item.system_remarks !== '-'"
          class="fs-12 mb-0 text-truncate text-red"
        >
          Hold Remarks (System): {{ item.system_remarks }}
        </p>

        <!-- Customer Remarks -->
        <p
          v-if="item.customer_remarks && item.customer_remarks.trim() !== '' && item.customer_remarks !== '-'"
          class="fs-12 mb-0 text-truncate text-red"
        >
          Hold Remarks (For Customer): {{ item.customer_remarks }}
        </p>
      </td>

      <td :colspan="(headers.length - 1) / 2" class="h-auto my-2">
        <span class="fs-12 mb-0 text-truncate">
          {{
            item.sending_method === "Bank Transfer"
              ? "Bank Transfer:"
              : item.sending_method === "Cash"
              ? "Cash:"
              : item.sending_method === "Card"
              ? "Pay By Card(Debit/Credit):"
              : item.sending_method + ":"
          }}
        </span>

        <!-- Partner Transaction Reference -->
        <span
          v-if="item.partner_transaction_reference && permissionStore.hasPermission('partner_response') && item.partner_transaction_reference !== '-'"
          class="fs-13 mb-0"
        >
          {{ formatText(item.partner_transaction_reference) }}
        </span>
      </td>
    </tr>
  </template>
</template>


      <template #item.sr_no="{ item }">
        <div style="display: flex; align-items: center;">
          <VCheckbox
            :model-value="isSelected(item)"
            @update:model-value="toggleSelection(item)"
          />
          {{ item.index }}
        </div>
      </template>

      <template #item.date="{ item }">
        <div style="display: flex; align-items: center">
          <span class="fs-13">{{ item.date }}</span>
        </div>
        <div class="fs-13">{{ item.transaction_id }}</div>
      </template>
      <template #item.status="{ item }">
        <div>
          <VChip
            :style="{
              ...resolveStatusVariant(item.status_value),
              fontSize: '10px',
              marginTop: '2px',
            }"
            class="font-weight-light p-1"
            size="small"
          >
            {{ resolveStatusVariant(item.status_value).text }}
          </VChip>
        </div>
        <div class="fs-13">{{ item.channel }}</div>
      </template>
     
       <template #item.ban="{ item }">
        <!-- Sender Sanction -->
        <div class="d-flex align-items-center">
          <div class="fs-13" :class="item.sender_sanction == 1 ? 'text-success' : 'text-danger'">
            <template v-if="item.sender_sanction == 1"> 
              <NuxtLink :to="`/compliance/sanction-list?name=${item.customer_name}`" target="_blank"  class="text-success">Pass</NuxtLink>
            </template>
            <template v-else>
              <NuxtLink :to="`/compliance/sanction-list?name=${item.customer_name}`" target="_blank" class="link-color">Ban</NuxtLink>
            </template>
          </div>
          <span class="mx-2">-</span>
          <p class="mb-0 fs-13">{{ item.customer_id }}</p>
        </div>

        <!-- Beneficiary Sanction -->
        <div class="d-flex align-items-center">
          <div class="fs-13" :class="item.beneficiary_sanction == 1 ? 'text-success' : 'text-danger'
            ">
            <template v-if="item.beneficiary_sanction == 1"> 
                <NuxtLink :to="`/compliance/sanction-list?name=${item.beneficiary_name}`" target="_blank"  class="text-success">Pass</NuxtLink>
            </template>
            <template v-else>
              <NuxtLink :to="`/compliance/sanction-list?name=${item.beneficiary_name}`" target="_blank" class="link-color">Ban</NuxtLink>
            </template>
          </div>
          <span class="mx-2">-</span>
          <p class="mb-0 fs-13">{{ item.beneficiary_id }}</p>
        </div>
      </template>
      <!---Address-->
      <template #item.customer_name="{ item }">
        <div class="d-flex flex-column ms-3">
          <div class="d-flex align-items-center">
            <span class="fs-13 font-weight-regular text-high-emphasis text-truncate">
              {{ item.customer_name }}
            </span>
            <VChip
              v-if="item.first_transaction"
              color="success"
              class="ml-2"
              size="x-small"
              variant="elevated"
              style="font-size: 10px"
            >
              1st Transaction
            </VChip>
          </div>
          <span class="fs-13">{{ item.beneficiary_name }}</span>
        </div>
      </template>
      <template #item.customer_phone="{ item }">
        <div class="d-flex flex-column">
          <p class="fs-13 mb-0">{{ item.customer_phone }}</p>
          <p class="fs-13 mb-0">{{ item.beneficiary_phone }}</p>
        </div>
      </template>
      <template #item.sending_country="{ item }">
        <div>
          <P class="fs-13 mb-0">{{ item.sending_country }}</P>
          <P class="fs-13 mb-0">{{ item.receiving_country }}</P>
        </div>
      </template>
      <template #item.sending_method="{ item }">
        <div class="d-flex flex-column">
          <p class="fs-13 mb-0 text-truncate">{{ item.sending_method }}</p>
          <p class="fs-13 mb-0">{{ formatText(item.receiving_method) }}</p>
        </div>
      </template>
      <template #item.sending_rate="{ item }">
        <div>
          <p class="fs-13 mb-0 text-truncate">
            {{ item.sending_currency }} {{ item.sending_rate }}
          </p>
          <p class="fs-13 mb-0 text-truncate">
            {{ item.receiving_currency }} {{ item.receiving_rate }}
          </p>
        </div>
      </template>
      <template #item.sending_amount="{ item }">
        <div>
          <p class="fs-13 mb-0 text-truncate">
            {{ item.sending_currency }} {{ item.sending_amount }}
          </p>
          <p class="fs-13 mb-0 text-truncate">
            {{ item.receiving_currency }} {{ item.receiving_amount }}
          </p>
        </div>
      </template>
      <template #item.partner_name="{ item }">
        <div class="d-flex flex-column">
          <p class="fs-13 mb-0">testing</p>
        </div>
      </template>
      <template #item.other_info="{ item }">
        <div>
          <VBtn
            color="success"
            variant="tonal"
            :to="getPartnerLink(item)"
            target="_blank"
            size="xsmall"
            class="fs-13 px-2 font-weight-regular"
          >
            {{ item.other_info }}
          </VBtn>
          <p class="fs-13 mb-0">{{ item.account_number }}</p>
        </div>
      </template>
      <template #item.details="{ item }">
        <div class="py-1">
          <NuxtLink
            class="fs-13 text-truncate d-block cursor-pointer"
            :to="'/payments/partner-rate'"
            target="_blank" v-if="permissionStore.hasPermission('partner.rates')"
          >
            Add Partner Rate
          </NuxtLink>
          <VBtn
            color="secondary"
            type="button"
            :to="`/payments/detail/${item.id}`"
            target="_blank"
            variant="tonal"
            size="small" v-if="permissionStore.hasPermission('transactions.show')"
          >
            Detail
          </VBtn>
        </div>
      </template>
    </CustomDataTableComponent>
  </v-card>

  <!--Process payments pop up design by usman faiz -->
  <div class="text-center pa-4">
    <!-- Dialog -->
    <v-dialog v-model="action" max-width="1000" persistent transition="scale-transition">
      <v-card>
        <VCardTitle class="border-b-sm d-flex align-center justify-space-between">
          <h4 class="text-h4 pt-3">1. Send to Partner</h4>
          <IconBtn @click="resetActionModal">
            <VIcon icon="tabler-x" />
          </IconBtn>
        </VCardTitle>
        <v-card-text class="border-b-sm px-1 py-3">
          <!-- HEADINGS ROW -->
          <div class="d-flex justify-space-between flex-wrap mb-2">
            <div
              class="text-subtitle-2 font-weight-bold"
              :style="{ flex: '1 0 20%', maxWidth: '20%' }"
            >
              #Code
            </div>
            <div
              class="text-subtitle-2 font-weight-bold"
              :style="{ flex: '1 0 20%', maxWidth: '20%' }"
            >
              Sending Country
            </div>
            <div
              class="text-subtitle-2 font-weight-bold"
              :style="{ flex: '1 0 20%', maxWidth: '20%' }"
            >
              Receiving Country
            </div>
            <div
              class="text-subtitle-2 font-weight-bold"
              :style="{ flex: '1 0 20%', maxWidth: '20%' }"
            >
              Sending Amount
            </div>
            <div
              class="text-subtitle-2 font-weight-bold"
              :style="{ flex: '1 0 20%', maxWidth: '20%' }"
            >
              Receiving Amount
            </div>
          </div>

          <!-- DATA ROWS -->
          <div
            v-for="tx in selected"
            :key="tx.id"
            class="d-flex justify-space-between align-center flex-wrap py-2"
            style="border-block-end: 1px solid #f0f0f0"
          >
            <div :style="{ flex: '1 0 20%', maxWidth: '20%' }">
              <p class="fs-15 font-weight-semibold mb-0">{{ tx.transaction_id }}</p>
            </div>
            <div :style="{ flex: '1 0 20%', maxWidth: '20%' }">
              <p class="fs-15 font-weight-semibold mb-0">
                {{ tx.sending_country }}
              </p>
            </div>
            <div :style="{ flex: '1 0 20%', maxWidth: '20%' }">
              <p class="fs-15 font-weight-semibold mb-0">
                {{ tx.receiving_country }}
              </p>
            </div>
            <div :style="{ flex: '1 0 20%', maxWidth: '20%' }">
              <p class="fs-15 font-weight-semibold mb-0">
                {{ tx.sending_currency }}
                {{ parseFloat(tx.sending_amount).toFixed(2) }}
              </p>
            </div>
            <div :style="{ flex: '1 0 20%', maxWidth: '20%' }">
              <p class="fs-15 font-weight-semibold mb-0">
                {{ tx.receiving_currency }}
                {{ parseFloat(tx.receiving_amount).toFixed(2) }}
              </p>
            </div>
          </div>
        </v-card-text>

        <v-card-text class="border-b-sm pb-3">
          <v-row class="pt-3">
            <v-col cols="8 ps-0">
              <p class="fs-16 font-weight-medium mb-0 float-start text-dark">
                Total Sending
              </p>
              <p class="fs-16 font-weight-medium mb-0 float-end text-dark">
                {{ totalSendingAmount.toFixed(2) }}
              </p>
            </v-col>
            <v-col cols="4">
              <p class="fs-16 font-weight-medium mb-0 text-dark text-center ps-3">
                {{ totalReceivingAmount.toFixed(2) }}
              </p>
            </v-col>
          </v-row>
        </v-card-text>

        <VForm @submit.prevent="">
          <VCardText class="pt-3">
            <VRow class="pt-3 d-flex align-end">
              <VCol cols="10 pb-1">
                <span class="fs-13 label-color">Choose Partner  </span>
                <AppAutocomplete
                  v-model="selectedPartner"
                  name="partner"
                  :items="partners"
                  item-title="name"
                  item-value="id"
                  placeholder="Choose Partner"
                />
              </VCol>
              <VCol cols="2 pb-1">
                <VBtn
                  color="primary"
                  variant="elevated"
                  class="me-3"
                  @click="sendToPartner" 
                  :disabled="hasPartner && !releaseCompleted" v-if="permissionStore.hasPermission('send_to_partner')"
                >
                  Send to Partner
                </VBtn>
              </VCol>
            </VRow>
          </VCardText>
         <!-- Release from Lock section -->
        <VCol
          v-if="hasPartner"
          class="border-b-sm px-0 mt-2"
          style="background-color: #fbfafa"
        >
          <h4 class="text-h5 px-5">2. Release from Lock</h4>
        </VCol>

        <VCol v-if="hasPartner">
          <VCheckbox v-model="isRelease" :true-value="1" :false-value="0">
            <template #label>
              <span style="color: red">
                I have verified that the payment did not go through on the partner's
                platform.
              </span>
            </template>
          </VCheckbox>
        </VCol>

        <VCol v-if="hasPartner" class="d-flex justify-end">
          <VBtn
            color="primary"
            variant="elevated"
            class="mb-2"
            @click="releaseFromLock" v-if="permissionStore.hasPermission('release_from_lock')"
          >
            Release from lock
          </VBtn>
        </VCol>

        </VForm>
      </v-card>
    </v-dialog>
  </div>
</template>
