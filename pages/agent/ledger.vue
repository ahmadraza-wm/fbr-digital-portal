<script setup>
definePageMeta({
  middleware: "auth",
  permission: "agent.portal.agent.ledger"
})
import { useAgentLedger } from "@/composables/agentPortal/useLedger";
import { ref, unref } from 'vue';
const currentDate = new Date();
const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);

const userList = ref([])


const {
  filters,
  rows,
  searched,
  resetFilters,
  filterAgentLedger,
  agentledgers

} = useAgentLedger();
 
filters.to_date = currentDate;
filters.from_date = previousDate;


const calculateRunningBalances = (entries, openingBalance) => {
  let currentBalance = Number(openingBalance) || 0;
  console.log('current opening balance', currentBalance)

  return entries.map(entry => {
    const debit = Number(entry.debit) || 0;
    const credit = Number(entry.credit) || 0;
    console.log('debit', debit);
    console.log('credit', credit);


    if (entry.type === 'debit') {
      currentBalance -= debit;
      console.log('adding balance', currentBalance)
    } else if (entry.type === 'credit') {
      currentBalance += credit;
      console.log('deducting balance', currentBalance)
    }

    const formattedBalance = currentBalance < 0
      ? `(${Math.abs(currentBalance).toFixed(2)})`
      : currentBalance.toFixed(2);

    return {
      ...entry,
      runningBalance: formattedBalance
    };
  });
};

const submitForm = async () => {
  searched.value = true;

  const plainFilters = {
    from_date: unref(filters.from_date),
    to_date: unref(filters.to_date),
  };

  console.log(plainFilters);

  await filterAgentLedger(plainFilters);

  if (agentledgers.value && agentledgers.value.ledgers) {
    agentledgers.value.ledgers = calculateRunningBalances(
      agentledgers.value.ledgers,
      agentledgers.value.opening_balance
    );
  }

  addRow();
};


const addRow = () => {
  rows.value.push({
    date: new Date().toLocaleDateString(),
    description: 'New Transaction',
    fcAmount: '100.00',
    adminCharges: '10.00',
    debit: '90.00',
    credit: '0.00',
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

const totalTransactions = computed(() => {
  return rows.value.length;
});
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Ledger</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <!-- submitForm -->
      <VForm @submit.prevent="submitForm">
        <VRow>
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
          <VCol cols="12 pt-md-8" md="6" class="d-flex gap-4">
            <VBtn type="submit" variant="tonal" class="login-btn" :loading="loading">
              Search
            </VBtn>

            <VBtn type="reset" color="secondary" variant="tonal" @click="resetFilters"> Reset </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </v-card-text>
    <VTable class="text-no-wrap">
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Admin Charges</th>
          <th>Debit</th>
          <th>Credit</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody class="ledgertbody">
        <tr id="">
          <td colspan="5" class="font-weight-bold">Opening Balance</td>
          <td class="font-weight-bold">{{ isNaN(Number(agentledgers.opening_balance)) ? '0.00' : Number(agentledgers.opening_balance).toFixed(2)
          }}</td>
        </tr>
        <tr v-for="(entry, index) in agentledgers.ledgers" :key="entry.id">
          <td>{{ entry.date }}</td>
          <td class="text-wrap">{{ entry.description }}</td>
          <td>{{ entry.admin_charges }}</td>
          <td>{{ entry.debit }}</td>
          <td>{{ entry.credit }}</td>
          <td>{{ entry.runningBalance }}</td>
        </tr>
        <tr>
          <td colspan="5" class="font-weight-bold">Closing Balance</td>
          <td class="font-weight-bold">
            {{
              isNaN(Number(agentledgers.closing_balance))
                ? '0.00'
                : Number(agentledgers.closing_balance) < 0 ?
                  `(${Math.abs(Number(agentledgers.closing_balance)).toFixed(2)})` :
                  Number(agentledgers.closing_balance).toFixed(2) }} </td>
        </tr>
        <tr>
          <td colspan="3" class="font-weight-bold">Total Debit & Credit</td>
          <td class="font-weight-bold">{{ agentledgers.total_debit || 0 }}</td>
          <td colspan="2" class="font-weight-bold">{{ agentledgers.total_credit || 0 }}</td>
        </tr>
        <tr>
          <td colspan="3" class="font-weight-bold">Total Number of Transaction</td>
          <td colspan="3" class="font-weight-bold">{{ agentledgers.total_number_of_transactions || 0 }}</td>
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
