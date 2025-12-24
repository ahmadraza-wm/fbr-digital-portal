<script setup>
import { ref } from 'vue'
const currentDate = new Date();
const previousMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate() + 1);
const rows = ref([])
const formkey = ref(null)
const id = ref(null)
const from = ref(previousMonthDate)
const to = ref(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()))

const search = () => {

}

const resetFilters = () => {
  id.value = null
  from.value = null
  to.value = new Date().toLocaleDateString()
  formkey.value += 1
};

const addRow = () => {
  rows.value.push({
    sr: rows.value.length + 1 ,
    date: new Date().toLocaleDateString(),
    description: 'REWARD GRANTED',
    addedBy: 'SYSTEM USER',
    customer: 'James Emmanuel',
    trans: '123456',
    debit: '90.00',
    credit: '10.00',
    balance: '90.00',
  })
}
const openingBalance = computed(() => {
  return rows.value.length ? parseFloat(rows.value[0].balance) - parseFloat(rows.value[0].debit) + parseFloat(rows.value[0].credit) : 0;
});

const closingBalance = computed(() => {
  return rows.value.length ? parseFloat(rows.value[rows.value.length - 1].balance) : 0;
});

const totalDebit = computed(() => {
  return rows.value.reduce((acc, curr) => acc + parseFloat(curr.debit), 0).toFixed(2);
});

const totalCredit = computed(() => {
  return rows.value.reduce((acc, curr) => acc + parseFloat(curr.credit), 0).toFixed(2);
});
addRow()
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Customer Wallet Ledger</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="" :key="formkey">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Date From<span class="text-red">*</span></span>
            <AppDateTimePicker name="from" v-model="from" placeholder="dd/mm/yyyy" :config="{ dateFormat: 'd/m/Y' }"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Date To<span class="text-red">*</span></span>
            <AppDateTimePicker name="to" v-model="to" placeholder="dd/mm/yyyy" :config="{ dateFormat: 'd/m/Y' }"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Customer Id<span class="text-red">*</span></span>
            <AppTextField name="id" type="text" v-model="id" placeholder="Customer id" :rules="[requiredValidator]" autocomplete="off" />
          </v-col>
          <v-col cols="12 d-flex gap-2 pt-md-8 justify-start" sm="6" md="3">
            <VBtn @click="search" type="submit" class="login-btn" variant="tonal">
              search
            </VBtn>
            <VBtn @click="resetFilters" type="reset" color="secondary" variant="tonal">
              Reset
            </VBtn>
          </v-col>
        </v-row>
      </VForm>
    </v-card-text>
    <v-card-text class="px-0">
      <v-row class="mt-0">
        <v-col cols="12">
          <v-card-title class="border-b-sm border-t-sm py-4 d-flex justify-space-between align-center"
            style="background-color: #F5F5F5;">
            <h4 class="text-h5">Customer Details</h4>
          </v-card-title>
        </v-col>
      </v-row>
      <v-row class="border-b-sm px-6">
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">
            Customer Id</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            <VBtn variant="text" color="primary" target="_blank" to="/customers/view/1">
              <u>23458</u>
            </VBtn>
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Customer Name</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            James Emmanuel </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Customer Email</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            jemman012@gmail.com
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">
            Customer Phone
          </p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            +447496881726
          </p>
        </v-col>
      </v-row>
      <v-row class="px-6">
        <v-col cols="12" sm="6" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Customer Address</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            ---
          </p>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-card class='mt-5'>
    <v-row class="mt-0">
      <v-col cols="12 pt-0">
        <v-card-title class="py-4 d-flex justify-space-between align-center" style="background-color: #F5F5F5;">
          <h4 class="text-h5 fw-bolder">Customer Wallet Ledger List</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <VTable class="text-no-wrap">
      <thead>
        <tr>
          <th>#</th>
          <th>Date</th>
          <th>Added By</th>
          <th>Customer</th>
          <th>Transaction Id</th>
          <th>Desicription</th>
          <th>Debit</th>
          <th>Credit</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody class="ledgertbody">
        <tr id="">
          <td colspan="8" class="font-weight-bold">Opening Balance</td>
          <td>{{ openingBalance.toFixed(2) }}</td>
        </tr>
        <tr v-for="(item, index) in rows" :key="index">
          <td>{{ item.sr }}</td>
          <td>{{ item.date }}</td>
          <td>{{ item.addedBy }}</td>
          <td>
            <VBtn variant="text" color="primary" target="_blank" to="/customers/view/1">
              <u>{{ item.customer }}</u>
            </VBtn>
          </td>
          <td>
            <VBtn variant="text" color="primary" target="_blank" to="/payments/detail/9f228f50-ea0f-4bfe-b054-2296a5737007">
              <u>{{ item.trans }}</u>
            </VBtn>
          </td>
          <td>{{ item.description }}</td>
          <td>{{ item.debit }}</td>
          <td>{{ item.credit }}</td>
          <td>{{ item.balance }}</td>
        </tr>
        <tr>
          <td colspan="8" class="font-weight-bold">Closing Balance</td>
          <td>{{ closingBalance.toFixed(2) }}</td>
        </tr>
        <tr>
          <td colspan="6" class="font-weight-bold">Total Debit & Credit</td>
          <td>{{ totalDebit }}</td>
          <td colspan="2">{{ totalCredit }}</td>
        </tr>
      </tbody>
    </VTable>
  </v-card>
</template>
