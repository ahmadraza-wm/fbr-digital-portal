<script setup>
import SearchFilter from "@/components/modification/search-filter.vue"
import { useBeneficiaryUpdate } from "@/composables/useBeneficiaryUpdate"

import { usePayments } from "@/composables/usePayments"
import data from "@/views/demos/forms/tables/data-table/datatable"
import { onMounted, reactive, ref, watch } from 'vue'
const permissionStore = usePermissionStore()
definePageMeta({
  middleware: "auth",
  permission: "modification.change.beneficiary.details"
})
const {
  payments,
  pagination,
  options,
  filters,
  bankList,
  showLoading,
  showError,
  hideLoading,
  partners,
  total_transactions,
  total_sending_amount,
  total_charges,
  total_receiving_amount,
  getPartnerStatus,
  transactionDetail,
  fetchBanks,
  fetchBeneficiaryBanks,
  beneficiaryBankList,
  fetchPayers,
  payersList,
  fetchTransactions,
  walletList,
  fetchWallets,
  updateBeneficiary,
  fetchCashDestinations,
  cashDestinations,
} = useBeneficiaryUpdate()

const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  fetchTransactions,
  {
    initialPage: 1,
    initialPerPage: 10,
  }
);

const { resolveStatusVariant } = usePayments()

const methodOptions = [
  { title: "Bank", value: "bank" },
  { title: "Cash", value: "cash" },
  { title: "Wallet", value: "mobile_wallet" },
]

const editBeneficiary = ref(false)
const userList = ref([])

const headers = [
  { title: "#", key: "sr_no" },
  { title: "Payment Date", key: "date" },
  { title: "Code", key: "paymentstatus" },
  { title: "Sender", key: "sender" },
  { title: "Beneficiary", key: "beneficiary" },
  { title: "Amount", key: "amount" },
  { title: "Action", key: "action" },
]

const formState = reactive({
  selectedMethod: '',
  selectedPayer: '',
  transferCode: '',
  firstName: '',
  lastName: '',
  dob: '',
  phone: '',
  address: '',
  houseNo: '',
  streetName: '',
  postalCode: '',
  city: '',
  relation: '',
  selectedBeneficiaryBank: '',
  selectedBank: '',
  branchName: '',
  branchCode: '',
  accountNo: '',
  iban: '',
  wallet: '',
  selectedcashDestination: '',
  countryId: '',
})

watch(
  () => formState.selectedMethod,
  async (newMethod) => {
    if (!newMethod || !formState.countryId) return

    await fetchPayers({ method: newMethod })
    formState.selectedPayer = ''

    if (newMethod === 'bank') {
      await fetchBanks({ country_id: formState.countryId })
    } else if (newMethod === 'cash') {
      await fetchCashDestinations({ country_id: formState.countryId })
    } else if (newMethod === 'mobile_wallet') {
      await fetchWallets({ country_id: formState.countryId })
    }
  }
)

const editBeneficiaryForm = async (item) => {
  editBeneficiary.value = true;
  Object.assign(formState, {
    selectedMethod: item.receiving_method,
    transferCode: item.code,
    firstName: item.beneficiary_first_name,
    lastName: item.beneficiary_last_name,
    dob: item.beneficiary_dob,
    phone: item.beneficiary_phone,
    address: item.beneficiary_address,
    houseNo: item.beneficiary_houseno,
    streetName: item.beneficiary_street,
    postalCode: item.beneficiary_postalcode,
    city: item.beneficiary_city,
    relation: item.beneficiary_relation,
    countryId: item.country_id,
  });

  if (item.receiving_method) {
    await fetchPayers({ method: item.receiving_method });
  }

  // fetch dependent list based on method
  if (item.receiving_method === 'bank') {
    await fetchBanks({ country_id: item.country_id });
    await fetchBeneficiaryBanks(item.beneficiary_id);
  } else if (item.receiving_method === 'cash') {
    await fetchCashDestinations({ country_id: item.country_id });
  } else if (item.receiving_method === 'mobile_wallet') {
    await fetchWallets({ country_id: item.country_id });
  }

  // now set dependent fields (after lists loaded!)
  Object.assign(formState, {
    selectedPayer: item.payer_id ?? '',

    selectedBeneficiaryBank: item.beneficiary_bank_id ?? '',
    // selectedBank: item.bank_id ?? '',
    selectedBank: item.beneficiary_bank_id ?? '',


    branchName: item.beneficiary_branch,
    branchCode: item.beneficiary_branch_code,
    accountNo: item.beneficiary_account,
    iban: item.beneficiary_iban,

    wallet: item.wallet_id ?? '',
    selectedcashDestination: item.cash_destination_id ?? '',
  });
};


const buildUpdatePayload = () => {
  const payload = { ...formState }

  delete payload.existing_beneficiary_bank_id
  delete payload.cash_destination_id
  delete payload.wallet_id

  if (formState.selectedMethod === 'bank') {
      payload.bank_id = formState.selectedBank  
  } else if (formState.selectedMethod === 'cash') {
    payload.cash_destination_id = formState.selectedcashDestination
  } else if (formState.selectedMethod === 'mobile_wallet') {
    payload.wallet_id = formState.wallet
  }

  return payload
}

const submitForm = async () => {
  const result = await updateBeneficiary(buildUpdatePayload())
  if (result.success) {
    editBeneficiary.value = false
    fetchTransactions()
  }
}

const onFilterUpdated = (filters) => {
  fetchTransactions({ ...filters })
}

const onFilterReset = (filters) => {
   fetchTransactions({ ...filters })
}

</script>



<style scoped>
::v-deep(.bold-icon svg) {
  stroke-width: 3.5;
}
</style>
<template>
  <v-card class="mt-5">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Beneficiary Payments</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <V-row>
      <SearchFilter @filter-updated="onFilterUpdated" @filter-reset="onFilterReset" />
    </V-row>

    <VCardText class="d-flex flex-wrap gap-4 justify-between pb-2">
      <div class="me-3 d-flex gap-3">
        <ItemsPerPageSelector
          v-model="itemsPerPage"
          @update:model-value="updateItemsPerPage"
        />
      </div>
      <VSpacer />
    </VCardText>

    <VCardText class="px-0 border-t-sm">
     <VDatableComponent
        :headers="headers"
        :items="payments"
        :loading="loading"
        :search="search"
        :pagination="pagination"
        :pageNo="pageNo"
        @update:pageNo="pageNo = $event"
      >
        <template #item.sr_no="{ item }">
          <div style="display: flex; align-items: center;">
            <span>{{ item.index }}</span>
          </div>
        </template>
        <!----Date-->
        <template #item.date="{ item }">
          <div style="display: flex; align-items: center;">
            <span>{{ item.date }}</span>
          </div>
        </template>
        <template #item.paymentstatus="{ item }">
          <div>
            <p class="fs-12 pt-1 mb-1">{{ item.code }}</p>
            <div class="d-flex">
              <VChip size="small" color="success" variant="tonal" class="ms-1 fs-11 py-1 mb-0 font-weight-semibold">
                {{ item.channel }}
              </VChip>
            </div>
            <VChip :style="{
              ...resolveStatusVariant(item.status_value),
              fontSize: '12px',
              marginTop: '4px',
              marginBottom: '5px',
            }" class="font-weight-regular p-1" size="small">
              {{ resolveStatusVariant(item.status_value).text }}
            </VChip>
          </div>
        </template>
        <template #item.sender="{ item }">
          <p class="mb-0 fs-13 d-flex">
            <NuxtLink to="payments/sanction" target="_blank">
              <p :class="item.sender_sanction == 1 ? 'verify-user' : 'unverify-user'">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                  :stroke="item.sender_sanction == 1 ? '#ffffff' : '#fdf7f7'" stroke-width="3" stroke-linecap="round"
                  stroke-linejoin="round">
                  <path v-if="item.sender_sanction == 1" d="M5 12l5 5l10 -10" />
                  <g v-else>
                    <path d="M18 6l-12 12" />
                    <path d="M6 6l12 12" />
                  </g>
                </svg>
              </p>
            </NuxtLink>

            {{ item.customer_id }}- {{ item.customer_name ?? "-"}}
          </p>
          <p class="mb-0 fs-13">{{ item.customer_phone }}</p>
          <p class="mb-0 fs-13">
            {{ item.sending_country }}
            <span class="fs-12">
              <VChip color="warning py-1" size="small" class="fs-12 font-weight-regular">{{ item.sending_method }}
              </VChip>
            </span>
          </p>
        </template>
        <template #item.beneficiary="{ item }">
          <p class="mb-0 fs-13 d-flex">
          <p :class="item.beneficiary_sanction == 1 ? 'verify-user' : 'unverify-user'">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              :stroke="item.sender_sanction == 1 ? '#ffffff' : '#fdf7f7'" stroke-width="3" stroke-linecap="round"
              stroke-linejoin="round">
              <path v-if="item.sender_sanction == 1" d="M5 12l5 5l10 -10" />
              <g v-else>
                <path d="M18 6l-12 12" />
                <path d="M6 6l12 12" />
              </g>
            </svg>
          </p>
          {{ item.beneficiary_id }}- {{ item.beneficiary_first_name }}  {{ item.beneficiary_last_name }} 
          </p>
          <p class="mb-0 fs-13">{{ item.beneficiary_phone }}</p>
          <p class="mb-0 fs-13">
            {{ item.beneficiary_country }}
            <span>
              <VChip color="warning py-1" size="small" class="fs-12 font-weight-regular">
                {{item.receiving_method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}}
              </VChip>
            </span>
          </p>
        </template>

        <!----Payment Rate-->
        <template #item.amount="{ item }">
          <div>
            <p class="fs-13 mb-0 text-truncate">{{ item.sending_amount }} {{ item.sending_currency }}</p>
            <p class="fs-13 mb-0 text-truncate">1 {{ item.sending_currency }} = {{ item.sending_rate }} {{
              item.receiving_currency }}</p>
            <p class="fs-13 mb-0 text-truncate">{{ item.receiving_amount }} {{ item.receiving_currency }}</p>
          </div>
        </template>

        <!-- Actions -->
        <template #item.action="{ item }">
          <IconBtn class="text-color">
            <NuxtLink class="menu-link">
              <VIcon icon="tabler-edit" @click="editBeneficiaryForm(item)" v-if="permissionStore.hasPermission('modification.update.beneficiary.details')" />

            </NuxtLink>
          </IconBtn>
        </template>
      </VDatableComponent>
    </VCardText>
  </v-card>

  <!--edit beneficiary Pop up design by usman faiz--->
  <div class="text-center pa-4">
    <!-- Dialog -->
    <v-dialog v-model="editBeneficiary" max-width="1200" transition="scale-transition">
      <v-card>
        <VCardTitle class="bg-grey d-flex align-center justify-space-between">
          <h4 class="text-h4 py-2">Edit Beneficiary Payments</h4>
          <IconBtn @click="editBeneficiary = false">
            <VIcon icon="tabler-x" />
          </IconBtn>
        </VCardTitle>
        <v-card-text>
          <VForm @submit.prevent="submitForm">
            <VRow>
              <VCol cols="6">
                <span>Receiving Method</span>
                <AppAutocomplete v-model="formState.selectedMethod" :items="methodOptions" name="receivingMethod"
                  placeholder="Receiving Method" />
              </VCol>
              <VCol cols="6">
                <span>Payers</span>
                <AppAutocomplete v-model="formState.selectedPayer" :items="payersList" item-title="name" item-value="id"
                  name="payers" placeholder="Payers" />
              </VCol>
            </VRow>



            <VRow>

              <VCol cols="6" v-if="formState.selectedMethod === 'cash'">
                <span>Pickup Location</span>
                <AppAutocomplete v-model="formState.selectedcashDestination" :items="cashDestinations"
                  item-title="destination_name" item-value="id" placeholder="Select Pick up location" />
              </VCol>

              <VCol cols="6">
                <span>Transfer Code</span>
                <AppTextField v-model="formState.transferCode" name="transferCode" placeholder="RPL75505" disabled />
              </VCol>
              <VCol cols="6">
                <span>Beneficiary First Name</span>
                <AppTextField v-model="formState.firstName" name="firstName" placeholder="First Name" />
              </VCol>
            </VRow>

            <VRow>
              <VCol cols="6">
                <span>Beneficiary Last Name</span>
                <AppTextField v-model="formState.lastName" name="lastName" placeholder="Last Name" autocomplete="off"/>
              </VCol>
              <VCol cols="6">
                <span>Beneficiary Date of Birth</span>
                <AppDateTimePicker v-model="formState.dob" name="dob" placeholder="dd/mm/yyyy"
                  :config="{ dateFormat: 'd-m-Y' }" />
              </VCol>
            </VRow>

            <VRow>
              <VCol cols="6">
                <span>Beneficiary Phone</span>
                <AppTextField v-model="formState.phone" name="phone" persistent-placeholder placeholder="Phone Number"
                  :rules="[regexValidator(formState.phone, '^\\+?[0-9]{7,15}$')]" />
              </VCol>
              <VCol cols="6">
                <span>Beneficiary Address</span>
                <AppTextField v-model="formState.address" name="address" placeholder="Type.." />
              </VCol>
            </VRow>

            <VRow>
              <VCol cols="6">
                <span>Beneficiary House No</span>
                <AppTextField v-model="formState.houseNo" name="houseNo" placeholder="Type..." />
              </VCol>
              <VCol cols="6">
                <span>Beneficiary Street Name</span>
                <AppTextField v-model="formState.streetName" name="streetName" placeholder="Type.." />
              </VCol>
            </VRow>

            <VRow>
              <VCol cols="6">
                <span>Beneficiary Postal Code</span>
                <AppTextField v-model="formState.postalCode" name="postalCode" placeholder="Type..." />
              </VCol>
              <VCol cols="6">
                <span>Beneficiary City</span>
                <AppTextField v-model="formState.city" name="city" placeholder="Type.." />
              </VCol>
            </VRow>

            <VRow>
              <VCol cols="6">
                <span>Beneficiary Relation</span>
                <AppTextField v-model="formState.relation" name="relation" placeholder="Beneficiary Relation" />
              </VCol>
            </VRow>

            <VRow v-if="formState.selectedMethod === 'bank'" class="banks-detail">
              <VCol cols="6">
                <span>Existing Beneficiary Banks</span>
                <AppAutocomplete v-model="formState.selectedBeneficiaryBank" :items="beneficiaryBankList"
                  item-title="name" item-value="id" name="bank" placeholder="Bank" />
              </VCol>
              <VCol cols="6">
                <span>Bank</span>
                <AppAutocomplete v-model="formState.selectedBank" :items="bankList" item-title="name" item-value="id"
                  name="bank" placeholder="Bank" />
              </VCol>
              <VCol cols="6">
                <span>Branch Name</span>
                <AppTextField v-model="formState.branchName" name="branchName" placeholder="Type..." />
              </VCol>
              <VCol cols="6">
                <span>Branch Code</span>
                <AppTextField v-model="formState.branchCode" name="branchCode" placeholder="Type..." />
              </VCol>
              <VCol cols="6">
                <span>Account #</span>
                <AppTextField v-model="formState.accountNo" name="accountNo" placeholder="0668848562" />
              </VCol>
              <VCol cols="6">
                <span>IBAN</span>
                <AppTextField v-model="formState.iban" name="iban" placeholder="Type..." />
              </VCol>
            </VRow>

            <VRow v-if="formState.selectedMethod === 'mobile_wallet'">
              <VCol cols="6">
                <span>Wallet</span>
                <AppAutocomplete v-model="formState.wallet" :items="walletList" item-title="name" item-value="id"
                  name="wallet" placeholder="Select Wallet" />
              </VCol>
            </VRow>



            <VRow>
              <VCol cols="12">
                <div class="d-flex gap-3 justify-end">
                  <VBtn color="secondary" variant="tonal" @click="editBeneficiary = false">
                    Discard
                  </VBtn>
                  <VBtn type="submit" class="login-btn" color="white">
                    Update
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>

        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
