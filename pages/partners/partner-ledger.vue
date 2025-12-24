<script setup>
import { usePartnerLedger } from "@/composables/usePartnerLedger";
import { usePartners } from "@/composables/usePartners";
import { onMounted, ref } from 'vue';

definePageMeta({
  middleware: "auth",
  permission: "partner.ledger"
})

const {
  filters,
  searched,
  rows,
  partnerledgers,
  resetFilters,
  filterPartnerLedger,
} = usePartnerLedger();


const {
  partners,
  fetchPartners,
} = usePartners();


const getPartners = computed(() => {
  return partners.value
    .map(partner => ({
      title: partner.name,
      value: partner.id
    }));

});





const deposittype = ref([
  { title: 'All', value: 'all' },
  { title: 'Manual Deposit', value: 'credit' },
  { title: 'Manual Refund/Deduct', value: 'debit' },
])


onMounted(async () => {
  const today = new Date()
  const priorDate = new Date()
  priorDate.setDate(today.getDate() - 30)

  // Format as 'dd/mm/yyyy' or whatever your picker expects
  const formatDate = (date) => {
    const d = date.getDate().toString().padStart(2, '0')
    const m = (date.getMonth() + 1).toString().padStart(2, '0')
    const y = date.getFullYear()
    return `${d}-${m}-${y}`
  }

  filters.value.from_date = formatDate(priorDate)
  filters.value.to_date = formatDate(today)

  await fetchPartners();

})


const calculateRunningBalances = (entries, openingBalance) => {
  let currentBalance = Number(openingBalance) || 0;
  console.log('current opening balance', currentBalance)

  return entries.map(entry => {
    const amount = Number(entry.amount) || 0;
    console.log('amount', amount)

    if (entry.type === 'debit') {
      currentBalance += amount;
      console.log('adding balance', currentBalance)
    } else if (entry.type === 'credit') {
      currentBalance -= amount;
      console.log('deducting balance', currentBalance)
    }

    return {
      ...entry,
      runningBalance: currentBalance.toFixed(2)
    };
  });
};





const submitForm = async () => {
  searched.value = true;

  const plainFilters = {
    ...filters.value,
  };

  await filterPartnerLedger(plainFilters);

  if (partnerledgers.value && partnerledgers.value.ledger) {
    partnerledgers.value.ledger = calculateRunningBalances(
      partnerledgers.value.ledger,
      partnerledgers.value.opening_balance
    );
  }

  addRow();
};



const addRow = () => {
  rows.value = [
    {
      date: '28 Apr 2022',
      invoice: 'BALANCE',
      receivingCountry: 'Ghana',
      receivingMethod: 'Bank',
      fcAmount: '<span style="color: #FEBC2EE5;">GHS</span> 303.04',
      paymentNumber: 'TEST1A',
      description: 'ID: 147615 Pin: TEST1A\nRate: 1.00 Transfer\nStatus: Incomplete',
      debit: '16.03',
      credit: '0.00',
      balance: '(3,972.94)'
    },
    {
      date: '28 Apr 2022',
      invoice: 'BALANCE',
      receivingCountry: 'Ghana',
      receivingMethod: 'Bank',
      fcAmount: '<span style="color: #FEBC2EE5;">GHS</span> 303.04',
      paymentNumber: 'TEST1A',
      description: 'ID: 147615 Pin: TEST1A\nRate: 1.00 Transfer\nStatus: Incomplete',
      debit: '16.03',
      credit: '0.00',
      balance: '(3,972.94)'
    }
  ]
}


</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Partner Ledger</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="submitForm" :key="formKey">
        <VRow>
          <VCol cols="12" md="3">
            <span class="fs-15 label-color font-weight-medium">Partner<span class="text-red">*</span></span>
            <AppAutocomplete :items="getPartners" item-title="title" item-value="value" v-model="filters.partner_id"
              placeholder="Select partner" :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12" md="3">
            <span class="fs-13 label-color">From<span class="text-red">*</span></span>
            <AppDateTimePicker name="startdate" v-model="filters.from_date" :rules="[requiredValidator]"
              placeholder="dd/mm/yyyy" :config="{ dateFormat: 'd-m-Y' }" />
          </VCol>
          <VCol cols="12" md="3">
            <span class="fs-13 label-color">To<span class="text-red">*</span></span>
            <AppDateTimePicker name="enddate" v-model="filters.to_date" :rules="[requiredValidator]"
              placeholder="dd/mm/yyyy" :config="{ dateFormat: 'd-m-Y' }" />
          </VCol>
          <VCol cols="12" md="3">
            <span class="fs-15 label-color font-weight-medium">Type</span>
            <AppAutocomplete :items="deposittype" v-model="filters.entry_types" placeholder="Select type" />
          </VCol>
          <VCol cols="12" class="d-flex gap-4">
            <VBtn type="submit" variant="tonal" class="login-btn" :loading="loading">
              Search
            </VBtn>

            <VBtn type="reset" color="secondary" variant="tonal" @click="resetFilters"> Reset </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </v-card-text>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b border-t py-5 d-flex justify-end px-6">
          <VBtn color="secondary" variant="tonal">
            <VIcon icon="tabler-upload" class="mr-1" /> Export.CSV
          </VBtn>
        </v-card-title>
      </v-col>
    </v-row>
    <VTable class="text-no-wrap">
      <thead>
        <tr>
          <th>Date</th>
          <th>Invoice #</th>
          <th>Receiving Country</th>
          <th>Receiving Method</th>
          <th>Payment #</th>
          <th>Description</th>
          <th>FC Amount</th>
          <th>Debit</th>
          <th>Credit</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody class="ledgertbody">
        <tr id="" class="font-weight-bold">
          <td colspan="7" class="text-end">Opening Balance</td>
          <td colspan="2"></td>
          <td>{{ isNaN(Number(partnerledgers.opening_balance)) ? '0.00' :
            Number(partnerledgers.opening_balance).toFixed(2) }}</td>
        </tr>
        <tr v-for="(entry, index) in partnerledgers.ledger" :key="entry.id">
          <td>{{ entry.posting_date }}</td>
          <td>{{ entry.invoice_no }}</td>
          <td>{{ entry.receiving_country }}</td>
          <td>{{ entry.receiving_method }}</td>
          <td>{{ entry.transaction_code }}</td>
          <td style="white-space: pre-line;">{{ entry.description }}</td>
          <td v-html="`${entry.currency_code} ${entry.fc_amount}`"></td>
          <td>{{ entry.type === 'debit' ? entry.amount : '' }}</td>
          <td>{{ entry.type === 'credit' ? entry.amount : '' }}</td>
          <td>
            {{ entry.runningBalance }}
          </td>
        </tr>
        <tr class="font-weight-bold">
          <td colspan="7" class="text-end">Closing Balance</td>
          <td colspan="2"></td>
          <td>{{ isNaN(Number(partnerledgers.closing_balance)) ? '0.00' :
            Number(partnerledgers.closing_balance).toFixed(2) }}</td>

        </tr>
        <tr class="font-weight-bold">
          <td colspan="7" class="text-end">Total Debit & Credit</td>
          <td>{{ partnerledgers.total_debit }}</td>
          <td colspan="2">{{ partnerledgers.total_credit }}</td>
        </tr>
        <tr class="font-weight-bold">
          <td colspan="7" class="text-end">Total Number of Transaction</td>
          <td colspan="3">{{ partnerledgers.total_number_of_transactions }}</td>
        </tr>
      </tbody>
    </VTable>
  </v-card>
</template>
<style lang="scss">
.ledgertbody tr:nth-child(even) {
  background-color: #f8f7fa;
}
</style>
