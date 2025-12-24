<script setup>
import { useCustomerStatement } from "@/composables/reports/useCustomerStatement";
import { useDate } from "@/composables/useDate";
import { computed, reactive, ref } from "vue";

const { formatDate } = useDate();

definePageMeta({
  middleware: "auth",
  permission: "customer.statement.report",
});

const { userList, loading, fetchCustomerStatement } = useCustomerStatement();
const formkey = ref(0);
const set_date_format = (input_date) => {
  if (!input_date) return "--"; // 
  const now = new Date(input_date.replace(/-/g, "/"));
  if (isNaN(now)) return "--";
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
};
const form = reactive({
  from_date: "",
  to_date: "",
  customer_id: "",
});


const documentsOptions = reactive({
  page: 1,
  itemsPerPage: 5,
});

const beneficiariesOptions = reactive({
  page: 1,
  itemsPerPage: 5,
});

const transactionsOptions = reactive({
  page: 1,
  itemsPerPage: 5,
});

const transactions = computed(() => userList.value?.transactions || []);
const documents = computed(() => userList.value?.customer_documents || []);
const beneficiaries = computed(() => userList.value?.beneficiaries || []);

const beneficiaryItems = computed(() => {
  const start = (beneficiariesOptions.page - 1) * beneficiariesOptions.itemsPerPage;
  const end = start + beneficiariesOptions.itemsPerPage;
  return beneficiaries.value.slice(start, end);
})
const documentItems = computed(() => {
  const start = (documentsOptions.page - 1) * documentsOptions.itemsPerPage;
  const end = start + documentsOptions.itemsPerPage;
  return documents.value.slice(start, end);
});
const transactionItems = computed(() => {
  const start = (transactionsOptions.page - 1) * transactionsOptions.itemsPerPage;
  const end = start + transactionsOptions.itemsPerPage;
  return transactions.value.slice(start, end);
});
const headers = [
  { title: "Name", key: "type" },
  { title: "Number", key: "number" },
  { title: "Issuance", key: "issue_date" },
  { title: "Expiry", key: "expiry_date" },
];

const headers_1 = [
  { title: "Id", key: "id" },
  { title: "Name", key: "name" },
  { title: "Address", key: "address" },
  { title: "Country", key: "country" },
  { title: "Phone", key: "phone_number" },
  { title: "Total Amount", key: "transactions_sum_receiving_amount" },
];

const headers_2 = [
  { title: "Creation Date", key: "created_at" },
  { title: "Dest. Country", key: "payer.country_name" },
  { title: "Trans. Ref", key: "transaction_code" },
  { title: "Trans. Status", key: "status" },
  { title: "Trans. Type", key: "channel" },
  { title: "Beneficiary", key: "beneficiary.name" },
  { title: "Source Amount", key: "sending_amount" },
  { title: "Total Commission", key: "commission" },
  { title: "Other Fees/taxes", key: "taxes" },
  { title: "Remitter To Pay", key: "remiter_pay" },
  { title: "Rate", key: "customer_rate" },
  { title: "Dest. Amount", key: "receiving_amount" },
];

const resetFilters = () => {
  form.from_date = "";
  form.to_date = "";
  form.customer_id = "";
  formkey.value += 1;
  documentsOptions.page = 1;
  beneficiariesOptions.page = 1;
  transactionsOptions.page = 1;
};

const handleSearch = async () => {
  await fetchCustomerStatement(form);
  documentsOptions.page = 1;
  beneficiariesOptions.page = 1;
  transactionsOptions.page = 1;
};
</script>

<template>
  <v-card>
    <v-card-title class="border-b-sm">
      <h4 class="text-h5 py-3">Customer Statement Report</h4>
    </v-card-title>

    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="handleSearch" :key="formkey">
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <span>Date From <span class="text-red">*</span></span>
            <AppDateTimePicker v-model="form.from_date" placeholder="dd-mm-yyyy" :config="{ dateFormat: 'd-m-Y' }"
              :rules="[requiredValidator]" />
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <span>Date To <span class="text-red">*</span></span>
            <AppDateTimePicker v-model="form.to_date" placeholder="dd-mm-yyyy" :config="{ dateFormat: 'd-m-Y' }"
              :rules="[requiredValidator]" />
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <span>Customer ID <span class="text-red">*</span></span>
            <AppTextField v-model="form.customer_id" placeholder="Customer ID" autocomplete="off" />
          </v-col>

          <v-col cols="12" sm="6" md="3" class="d-flex align-center pt-md-8">
            <VBtn @click="handleSearch" class="me-2" variant="tonal" color="primary">Search</VBtn>
            <VBtn @click="resetFilters" color="secondary" variant="tonal">Reset</VBtn>
          </v-col>
        </v-row>
      </VForm>
    </v-card-text>
    <v-card-text class="px-0 pb-3">
      <v-row class="mt-0 px-6" style="background-color: #f5f5f5;">
        <v-col cols="6" md="2" class="py-6">
          <p class="font-weight-bold text-color fs-16 mb-0 lh-22">Period</p>
        </v-col>
        <v-col cols="6" md="4" class="py-6">
          <p class="font-weight-medium mb-0 fs-16 lh-22 text-color1">
            {{ userList.from_date ?? "--" }} - {{ userList.to_date ?? "--" }}
          </p>
        </v-col>
        <v-col cols="6" md="2" class="py-6">
          <p class="font-weight-bold text-color fs-16 mb-0 lh-22">
            Date of Issue
          </p>
        </v-col>
        <v-col cols="6" md="4" class="py-6">
          <p class="font-weight-medium mb-0 fs-16 lh-22 text-color1">
            {{ set_date_format(userList.issue_date) ?? "--" }}
          </p>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-container fluid class="px-0">
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="h-100">
          <v-card-text class="px-0 pt-0">
            <v-row class="mt-0">
              <v-col cols="12 pt-0">
                <v-card-title class="py-4 d-flex justify-space-between align-center" style="background-color: #f5f5f5;">
                  <h4 class="text-h5 fw-bolder">Customer Details</h4>
                </v-card-title>
              </v-col>
            </v-row>
            <v-row class="border-b-sm px-6">
              <v-col cols="12" sm="6" md="4" class="pb-1">
                <p class="font-weight-medium text-color mb-0 lh-22">
                  Customer Id
                </p>
                <p class="font-weight-medium mb-0 lh-22 text-color1">
                  <NuxtLink class="text-decoration-none text-center" color="primary" target="_blank"
                    :to="`/customers/view/${userList.id}`">
                    <u>{{ userList.id ?? '--' }}</u>
                  </NuxtLink>
                </p>
              </v-col>
              <v-col cols="12" sm="6" md="4" class="pb-1">
                <p class="font-weight-medium text-color mb-0 lh-22">Name</p>
                <p class="font-weight-regular fs-14 mb-0 lh-22 text-color1">
                  {{ userList.name ?? '--' }}
                </p>
              </v-col>
              <v-col cols="12" sm="6" md="4" class="pb-1">
                <p class="font-weight-medium text-color mb-0 lh-22">Email</p>
                <p class="font-weight-regular fs-14 mb-0 lh-22 text-color1">
                  {{ userList.email ?? '--' }}
                </p>
              </v-col>
            </v-row>
            <v-row class="px-6 border-b-sm">
              <v-col cols="12" sm="6" md="4" class="pb-1">
                <p class="font-weight-medium text-color mb-0 lh-22">Phone</p>
                <p class="font-weight-regular fs-14 mb-0 lh-22 text-color1">
                  {{ userList.phone_number ?? '--' }} </p>
              </v-col>
              <v-col cols="12" sm="6" md="4" class="pb-1">
                <p class="font-weight-medium text-color mb-0 lh-22">
                  Date of Birth
                </p>
                <p class="font-weight-regular fs-14 mb-0 lh-22 text-color1">
                  {{ userList.dob ?? '--' }}
                </p>
              </v-col>
              <v-col cols="12" sm="6" md="4" class="pb-1">
                <p class="font-weight-medium text-color mb-0 lh-22">
                  Nationality
                </p>
                <p class="font-weight-regular fs-14 mb-0 lh-22 text-color1">
                  {{ userList.nationality ?? '--' }} </p>
              </v-col>
            </v-row>
            <v-row class="px-6">
              <v-col cols="12" class="pb-1">
                <p class="font-weight-medium text-color mb-0 lh-22">Address</p>
                <p class="font-weight-medium mb-0 lh-22 text-color1">
                  {{ userList.address ?? '--' }} </p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="h-100">
          <v-card-text class="px-0 pt-0">
            <v-row class="mt-0">
              <v-col cols="12 pt-0">
                <v-card-title class="py-4 d-flex justify-space-between align-center" style="background-color: #f5f5f5;">
                  <h4 class="text-h5 fw-bolder">Overall Summary</h4>
                </v-card-title>
              </v-col>
            </v-row>
            <v-row class="border-b-sm px-6">
              <v-col cols="12" sm="6" class="pb-1">
                <p class="font-weight-medium text-color mb-0 lh-22">
                  Total Source Amount Transferred
                </p>
                <p class="font-weight-medium mb-0 lh-22 text-color1">
                  {{ userList.total_amount_transferred ?? '--' }}
                </p>
              </v-col>
              <v-col cols="12" sm="6" class="pb-1">
                <p class="font-weight-medium text-color mb-0 lh-22">
                  Total Destination Amounts Transferred
                </p>
                <p class="font-weight-medium mb-0 lh-22 text-color1">
                  {{ userList.total_received_amount ?? '--' }}
                </p>
              </v-col>
            </v-row>
            <v-row class="px-6 border-b-sm">
              <v-col cols="12" sm="6" class="pb-1">
                <p class="font-weight-medium text-color mb-0 lh-22">Country
                </p>
                <p class="font-weight-medium mb-0 lh-22 text-color1">
                  {{ userList.country ?? "--" }}
                </p>
              </v-col>
              <v-col cols="12" sm="6" class="pb-1">
                <p class="font-weight-medium text-color mb-0 lh-22">
                  Total Number of Transactions
                </p>

                <p class="font-weight-medium mb-0 lh-22 text-color1">
                  <NuxtLink variant="text" color="primary" target="_blank" :to="{
                    path: '/payments/search',
                    query: { customer_id: userList.id, from_date: userList.from_date, to_date: userList.to_date }
                  }">
                    <u>{{ userList.total_transactions ?? "--" }}</u>
                  </NuxtLink>
                </p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-card class="mt-3">
    <v-row class="mt-0">
      <v-col cols="12 pt-0">
        <v-card-title class="py-4 d-flex justify-space-between align-center" style="background-color: #f5f5f5;">
          <h4 class="text-h5 fw-bolder">Customer Documents Summary</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <VCardText class="px-0 pt-0">
      <VDataTable :headers="headers" :items="documentItems" :loading="loading" :search="search" hide-default-footer>
        <template #item.issue_date="{ item }">
          <td>{{ formatDate(item.issue_date) }}</td>
        </template>
        <template #item.expiry_date="{ item }">
          <td>{{ formatDate(item.expiry_date) }}</td>
        </template>
      </VDataTable>
      <div class="d-flex justify-space-between align-center mt-4 px-3">
        <small>
          Showing
          {{
            (documentsOptions.page - 1) * documentsOptions.itemsPerPage + 1
          }}
          to
          {{
            Math.min(
              documentsOptions.page * documentsOptions.itemsPerPage,
              documents.length
            )
          }}
          of {{ documents.length }} entries
        </small>

        <v-pagination v-model="documentsOptions.page"
          :length="Math.ceil(documents.length / documentsOptions.itemsPerPage)" rounded="circle" density="comfortable"
          variant="tonal" color="primary" />
      </div>
    </VCardText>
  </v-card>
  <v-card class="mt-7">
    <v-row class="mt-0">
      <v-col cols="12 pt-0">
        <v-card-title class="py-4 d-flex justify-space-between align-center" style="background-color: #f5f5f5;">
          <h4 class="text-h5 fw-bolder">Beneficiaries Summary</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <VCardText class="px-0 pt-0">
      <VDataTable :headers="headers_1" :items="beneficiaryItems" :loading="loading" :search="search"
        hide-default-footer>


      </VDataTable>
      <div class="d-flex justify-space-between align-center mt-4 px-3">
        <small>
          Showing
          {{
            (beneficiariesOptions.page - 1) * beneficiariesOptions.itemsPerPage + 1
          }}
          to
          {{
            Math.min(
              beneficiariesOptions.page * beneficiariesOptions.itemsPerPage,
              beneficiaries.length
            )
          }}
          of {{ beneficiaries.length }} entries
        </small>

        <v-pagination v-model="beneficiariesOptions.page"
          :length="Math.ceil(beneficiaries.length / beneficiariesOptions.itemsPerPage)" rounded="circle"
          density="comfortable" variant="tonal" color="primary" />
      </div>
    </VCardText>
  </v-card>

  <v-card class="mt-7">
    <v-card-title class="py-4 d-flex justify-space-between align-center" style="background-color: #f5f5f5;">
      <h4 class="text-h5 fw-bolder">Transactions</h4>
    </v-card-title>

    <v-card-text class="px-0 pt-0">
      <VDataTable :headers="headers_2" :items="transactionItems" :loading="loading" class="border-t"
        density="comfortable" item-value="id" hide-default-footer>
        <template #item.created_at="{ item }">
          {{ formatDate(item.created_at) }}
        </template>

        <template #item.sending_amount="{ item }">
          {{ item.sending_currency }} {{ item.sending_amount }}
        </template>

        <template #item.remiter_pay="{ item }">
          {{ item.sending_currency }} {{ item.sending_amount - item.discounted_amount }}
        </template>

        <template #item.receiving_amount="{ item }">
          {{ item.receiving_currency }} {{ item.receiving_amount }}
        </template>

        <template #item.commission>--</template>
        <template #item.taxes>--</template>
      </VDataTable>

      <div class="d-flex justify-space-between align-center mt-4 px-3">
        <small>
          Showing
          {{
            (transactionsOptions.page - 1) * transactionsOptions.itemsPerPage + 1
          }}
          to
          {{
            Math.min(
              transactionsOptions.page * transactionsOptions.itemsPerPage,
              transactions.length
            )
          }}
          of {{ transactions.length }} entries
        </small>

        <v-pagination v-model="transactionsOptions.page"
          :length="Math.ceil(transactions.length / transactionsOptions.itemsPerPage)" rounded="circle"
          density="comfortable" variant="tonal" color="primary" />
      </div>
    </v-card-text>
  </v-card>
</template>
