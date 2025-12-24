<script setup>
import { onMounted } from "vue";
import CustomerFilter from "@/components/customers/CustomerFilter.vue";
import { usePayments } from "@/composables/usePayments";
import useUiFeedback from "@/composables/useUiFeedback";
definePageMeta({
  middleware: "auth",
  permission: "transactions.verifying_transfer"
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

const defaultFilters = { status: ["verifying_transfer"] };

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

const userList = ref([]);
const verifying = ref(false);
const hold = ref(false);
const sanction = ref(false);
const openPanel = ref(0);
const openPanel1 = ref(0);
const selectedTransactionID = ref(null);
const selectedTransactionCode = ref(null);
const selectedCustomerId = ref(null);
const reason_for_system = ref(null);
const reason_for_customer = ref(null);

const holdAction = ref(null); // "hold" or "hold_and_email"

const showAdvancedSearch = ref(false);
const holdPayment = ref(null);

const formatText = (text) => {
  if (!text) return "";
  return text.replace(/_/g, " ").toUpperCase();
};
onMounted(() => {
  loadPage();
});

const holdPayments = async () => {
  const { valid } = await holdPayment.value.validate();
  if (!valid) return;
  showLoading('Holding Payment in Process....');
  let responseSuccessful = false;
  
  const formData = new FormData();
  formData.append("transaction_id", selectedTransactionID.value);
  formData.append("reason_for_system", reason_for_system.value);
  formData.append("reason_for_customer", reason_for_customer.value);
  formData.append(
    "send_to_customer",
    holdAction.value === "hold_and_email" ? "1" : "0"
  );

  try {
   const res = await $axios.post("/compliance/held", formData);
   if(res.data.success){
    showSuccess(`Payment Hold - ${res.data.message}`);
    responseSuccessful = true;
   }
   else{
    showError(res.data.message);
   }
  } catch (error) {
    let messages = "Something went wrong";

    const res = error.response?.data;

    if (res?.errors) {
      messages = Object.values(res.errors).flat();
    } else if (typeof res?.message === "string" && res.message) {
      messages = res.message;
    } else if (typeof res?.data === "string") {
      messages = res.data;
    }

    showError(messages);
  }

  if (responseSuccessful) {
    // showSuccess("Payment Hold!");
    fetchTransactions({ status: ["verifying_transfer"] });

    hold.value = false;
    reason_for_system.value = "";
    reason_for_customer.value = "";
    holdPayment.value.resetValidation();
  }
};

const verifyPayments = async () => {
  showLoading('Verifying Payment in Process....');
  const formData = new FormData();
  formData.append("transaction_id", selectedTransactionID.value);
  try {
   const res = await $axios.post("/verify/transfer", formData);
   if(res.data.success === true){
    showSuccess(`Payment Verified - ${res.data.message}`);
   }
   else {
    showError(res.data.message);
   }
    fetchTransactions({ status: ["verifying_transfer"] });
  } catch (error) {
    if (error.response?.data?.message) {
      showError(error.response.data.message);
    } else {
      showError("Failed to verify payment.");
    }
    console.error(error);
  } finally {
    hideLoading();
  }
};

const onFilterUpdated = (filters) => {
  fetchTransactions({ ...defaultFilters, ...filters });
};

const onFilterReset = () => {
  fetchTransactions(defaultFilters);
};
</script>
<template>
  <div>
    <PaymentCard :totalTransactions="total_transactions" :totalSendingAmount="total_sending_amount"
      :totalCharges="total_charges" :totalReceivingAmount="total_receiving_amount" />
  </div>
  <v-card class="mt-5">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Search Verifying Payments</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <V-row>
      <PaymentFilter @filter-updated="onFilterUpdated" @filter-reset="onFilterReset" :isView="false" />
    </V-row>

    <VCardText class="d-flex flex-wrap gap-4 justify-space-between pb-2">
      <div class="me-3 d-flex gap-3">
        <itemPerPage v-model="itemsPerPage" @update:model-value="updateItemsPerPage" />
      </div>
    </VCardText>

    <VDatableComponent :headers="headers" :items="payments" :loading="loading" :search="search" :pagination="pagination"
      :pageNo="pageNo" @update:pageNo="pageNo = $event" class="border-t-sm">
      <template #item.date="{ item }">
        <div style="display: flex; align-items: center;">
          <span class="fs-13">{{ item.date }}</span>
        </div>
        <div class="fs-13">{{ item.transaction_id }}</div>
        <p v-if="
          item.system_remarks &&
          item.system_remarks.trim() !== '' &&
          item.system_remarks !== '-'
        " class="fs-12 mb-0 text-truncate text-red">
          Hold Remarks (System): {{ item.system_remarks }}
        </p>

        <!-- <p v-if="
          item.customer_remarks &&
          item.customer_remarks.trim() !== '' &&
          item.customer_remarks !== '-'
        " class="fs-12 mb-0 text-truncate text-red">
          Hold Remarks (For Customer): {{ item.customer_remarks }}
        </p> -->

        <p class="mb-0 text-truncate fs-12">
          <span class="text-red">Sanction Executed </span>
        </p>
      </template>
      <template #item.status="{ item }">
        <div>
          <VChip :style="{
            ...resolveStatusVariant(item.status_value),
            fontSize: '10px',
            marginTop: '2px',
          }" class="font-weight-light p-1" size="small">
            {{ resolveStatusVariant(item.status_value).text }}
          </VChip>
        </div>
        <div class="fs-13">{{ item.channel }}</div>
        <VChip size="x-small" :color="item.customer_verified ? 'success' : 'error'" variant="tonal"
          class="ms-1 py-0 px-1 mb-1 font-weight-light fs-10">
          {{ item.customer_verified ? "Verified" : "Not Verified" }}
        </VChip>
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
            <VChip v-if="item.first_transaction" color="success" class="ml-2" size="x-small" variant="elevated"
              style="font-size: 10px;">
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
          <p class="fs-12 mb-0 text-truncate">
            {{
              item.sending_method === "Bank Transfer"
                ? "Bank Transfer:"
                : item.sending_method === "Cash"
                  ? "Cash:"
                  : item.sending_method === "Card"
                    ? "Pay By Card(Debit/Credit):"
                    : item.sending_method + ":"
            }}
          </p>
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
          <VBtn color="success" variant="tonal" :to="getPartnerLink(item)" target="_blank" size="xsmall"
            class="fs-13 px-2 font-weight-regular">
            {{ item.other_info }}
          </VBtn>
          <p class="fs-13 mb-0">{{ item.account_number }}</p>
        </div>
      </template>
      <template #item.details="{ item }">
        <div>
          <VBtn color="secondary" type="button" variant="tonal" size="small" :to="`/payments/detail/${item.id}`"
            target="_blank" v-if="permissionStore.hasPermission('transactions.show')">Detail</VBtn>
          <NuxtLink @click="
            verifying = true;
          selectedTransactionID = item.id;
          selectedTransactionCode = item.transaction_id;
          " size="xsmall"
            class="fs-13 text-success cursor-pointer font-weight-regular text-decoration-underline d-flex flex-column" v-if="permissionStore.hasPermission('verify_transaction')">
            Verify</NuxtLink>
          <NuxtLink @click="
            hold = true;
          selectedTransactionID = item.id;
          selectedTransactionCode = item.transaction_id;
          selectedCustomerId = item.customer_id;
          " class="fs-13 text-red font-weight-regular text-decoration-underline cursor-pointer" target="_blank" v-if="permissionStore.hasPermission('compliance_held')">
            Hold
          </NuxtLink>
        </div>
      </template>
    </VDatableComponent>
  </v-card>
  <!--Verifying Payemnt pop up design by usman faiz -->
  <div class="text-center pa-4">
    <!-- Dialog -->
    <v-dialog v-model="verifying" max-width="800" transition="scale-transition">
      <v-card>
        <VCardTitle class="border-b-sm d-flex align-center justify-space-between">
          <h4 class="text-h4 pt-3">Verify Payment</h4>
          <IconBtn @click="verifying = false">
            <VIcon icon="tabler-x" />
          </IconBtn>
        </VCardTitle>
        <VCardText class="pt-2">
          <VForm ref="verifyPayment" @submit.prevent="verifyPayments">
            <VRow>
              <VCol cols="12">
                <span class="fs-13 label-color">Transfer Code </span>
                <AppTextField name="code" :model-value="selectedTransactionCode" placeholder="12345678" readonly
                  style="background-color: #fafafa;" />
              </VCol>

              <VCol class="text-end">
                <VBtn color="white" variant="elevated" type="submit" class="login-btn" @click="verifying = false">
                  Verify Payment</VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </v-card>
    </v-dialog>
  </div>
  <!--Block Payemnt pop up design by usman faiz -->
  <div class="text-center pa-4">
    <!-- Dialog -->
    <v-dialog v-model="hold" max-width="800" persistent transition="scale-transition">
      <v-card>
        <VCardTitle class="border-b-sm d-flex align-center justify-space-between">
          <h4 class="text-h4 pt-3">Hold Payment Remarks</h4>
          <IconBtn @click="hold = false">
            <VIcon icon="tabler-x" />
          </IconBtn>
        </VCardTitle>
        <VCardText class="pt-2">
          <VForm ref="holdPayment" @submit.prevent="holdPayments">
            <VRow>
              <VCol cols="12 pb-1">
                <span class="fs-13 label-color">Transfer Code </span>
                <AppTextField :model-value="selectedTransactionCode" name="code" readonly placeholder="12345678" />
              </VCol>
              <VCol cols="12 pb-1">
                <span class="fs-13 label-color">Reason For Hold (For System)</span>
                <AppTextarea v-model="reason_for_system" name="systemReason" rows="2"
                  :rules="[(v) => !!v || 'System reason is required']" placeholder="Type here..." />
              </VCol>
              <VCol cols="12 pb-1" class="pb-0">
                <span class="fs-13 label-color">Reason For Hold (For Customer)</span>
                <AppTextarea v-model="reason_for_customer" rows="2"
                  :rules="[(v) => !!v || 'Customer reason is required']" placeholder="Type here..." />
              </VCol>
              <VCol cols="12 pb-0">
              <p class="text-red fs-11">
                NOTE: This description will be sent to customer via email.
              </p>
              </VCol>
              <VCol class="text-end pt-1">
                <VBtn color="transparent" variant="elevated" class="me-3" type="submit" @click="holdAction = 'hold'"
                  style="background-color: #fe5f574f; color: #fe5f57;">
                  Hold Payment
                </VBtn>

                <VBtn color="white" variant="elevated" type="submit" class="login-btn text-end"
                  @click="holdAction = 'hold_and_email'">
                  Hold and Send Email to customer
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </v-card>
    </v-dialog>
  </div>

  <!--Sanction Pop up design by usman faiz--->
  <div class="text-center pa-4">
    <!-- Dialog -->
    <v-dialog v-model="sanction" max-width="1200" transition="scale-transition">
      <v-card class="pa-3 my-2">
        <v-row>
          <v-col cols="6">
            <div class="border my-3" :elevation="16">
              <VCardTitle style="background-color: #ececec;">
                <h4 class="text-h4 py-1">Sender Sanction</h4>
              </VCardTitle>
              <VCardText class="pa-0">
                <div class="d-flex align-center py-2 px-3">
                  <img :src="CheckSign" width="50" />

                  <div class="ms-3 my-3">
                    <p class="fs-14 mb-0 d-block font-weight-medium text-high-emphasis text-truncate">
                      Denis Agyemang Agyemang
                    </p>
                    <VChip size="small" color="success" class="fs-11 py-1 font-weight-regular">
                      Verified
                    </VChip>
                    <NuxtLink color="primary" class="fs-12 d-block cursor-pointer">View in Sanction List
                    </NuxtLink>
                  </div>
                </div>
                <VForm @submit.prevent="" class="px-3">
                  <span class="fs-15 label-color">Remarks</span>
                  <AppTextarea rows="2" name="remarks" placeholder="Type here" />

                  <v-row class="d-flex align-cneter mt-0">
                    <v-col cols="9">
                      <span class="fs-15 label-color">Status<span class="text-red">*</span></span>
                      <AppAutocomplete name="status" placeholder="status" :rules="[requiredValidator]" />
                    </v-col>
                    <v-col cols="3" class="d-flex align-center justify-end mt-5">
                      <VBtn type="submit" class="login-btn" color="white" variant="elevated">
                        Proceed
                      </VBtn>
                    </v-col>
                  </v-row>
                </VForm>

                <VExpansionPanels v-model="openPanel" class="mt-7">
                  <VExpansionPanel>
                    <VExpansionPanelTitle class="light-bg text-h5 font-weight-regular">Remarks History
                    </VExpansionPanelTitle>
                    <VExpansionPanelText>
                      <VTable class="text-no-wrap">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Status</th>
                            <th>Remarks</th>
                            <th>Added By</th>
                            <th>Date & Time</th>
                          </tr>
                        </thead>

                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>
                              <Vchip color="success" variant="tonal" size="small">
                                Passport
                              </Vchip>
                            </td>
                            <td>Auto Sanction Verified</td>
                            <td>System User</td>
                            <td>28 Apr, 2025 11:51 am</td>
                          </tr>
                          <tr>
                            <td>1</td>
                            <td>
                              <Vchip color="success" variant="tonal" size="small">
                                Passport
                              </Vchip>
                            </td>
                            <td>Auto Sanction Verified</td>
                            <td>System User</td>
                            <td>28 Apr, 2025 11:51 am</td>
                          </tr>
                        </tbody>
                      </VTable>
                    </VExpansionPanelText>
                  </VExpansionPanel>
                </VExpansionPanels>
              </VCardText>
            </div>
          </v-col>
          <v-col cols="6">
            <div class="border my-3" :elevation="16">
              <VCardTitle style="background-color: #ececec;">
                <h4 class="text-h4 py-1">Receiver Sanction</h4>
              </VCardTitle>
              <VCardText class="pa-0">
                <div class="d-flex align-center py-2 px-3">
                  <img :src="CheckSign" width="50" />

                  <div class="ms-3 my-3">
                    <p class="fs-14 mb-0 d-block font-weight-medium text-high-emphasis text-truncate">
                      Denis Agyemang Agyemang
                    </p>
                    <VChip size="small" color="success" class="fs-11 py-1 font-weight-regular">
                      Verified
                    </VChip>
                    <NuxtLink color="primary" class="fs-12 d-block cursor-pointer">View in Sanction List
                    </NuxtLink>
                  </div>
                </div>
                <VForm @submit.prevent="" class="px-3">
                  <span class="fs-15 label-color">Remarks</span>
                  <AppTextarea rows="2" name="remarks" placeholder="Type here" />
                  <v-row class="d-flex align-cneter mt-0">
                    <v-col cols="9">
                      <span class="fs-15 label-color">Status<span class="text-red">*</span></span>
                      <AppAutocomplete name="status" placeholder="status" :rules="[requiredValidator]" />
                    </v-col>
                    <v-col cols="3" class="d-flex align-center justify-end mt-5">
                      <VBtn type="submit" class="login-btn" color="white" variant="elevated">
                        Proceed
                      </VBtn>
                    </v-col>
                  </v-row>
                </VForm>

                <VExpansionPanels v-model="openPanel1" class="mt-7">
                  <VExpansionPanel>
                    <VExpansionPanelTitle class="light-bg text-h5 font-weight-regular">Remarks History
                    </VExpansionPanelTitle>
                    <VExpansionPanelText>
                      <VTable class="text-no-wrap">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Status</th>
                            <th>Remarks</th>
                            <th>Added By</th>
                            <th>Date & Time</th>
                          </tr>
                        </thead>

                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>
                              <Vchip color="success" variant="tonal" size="small">
                                Passport
                              </Vchip>
                            </td>
                            <td>Auto Sanction Verified</td>
                            <td>System User</td>
                            <td>28 Apr, 2025 11:51 am</td>
                          </tr>
                          <tr>
                            <td>1</td>
                            <td>
                              <Vchip color="success" variant="tonal" size="small">
                                Passport
                              </Vchip>
                            </td>
                            <td>Auto Sanction Verified</td>
                            <td>System User</td>
                            <td>28 Apr, 2025 11:51 am</td>
                          </tr>
                        </tbody>
                      </VTable>
                    </VExpansionPanelText>
                  </VExpansionPanel>
                </VExpansionPanels>
              </VCardText>
            </div>
          </v-col>
        </v-row>
        <V-col cols="12 d-flex justify-end">
          <VBtn color="secondary" variant="tonal" @click="sanction = false">Close</VBtn>
        </V-col>
      </v-card>
    </v-dialog>
  </div>
</template>
