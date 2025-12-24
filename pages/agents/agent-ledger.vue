<script setup>
definePageMeta({
  middleware: "auth",
  permission: "agent.ledger"
})
import { useAgentLedger } from "@/composables/useAgentLedger";
import { useAgents } from "@/composables/useAgents";
import { ref, unref } from 'vue';


const userList = ref([])


const {
  filters,
  rows,
  searched,
  resetFilters,
  filterAgentLedger,
  agentledgers

} = useAgentLedger();


const {
  agents, fetchAgents
} = useAgents();

const channels = ref([
  { title: "Agent", value: "agent" },
  { title: "Online", value: "online" },
]);

onMounted(() => {
  fetchAgents({force_fetch:true}, false);
})

const getMainAgents = computed(() => {
  return agents.value
    .filter(agent => agent.type === 'main_agent')
    .map(agent => ({
      label: agent.name,
      value: agent.id
    }));

});

const getSubAgents = computed(() => {
  return agents.value
    .filter(agent =>
      agent.type === 'sub_agent' &&
      agent.main_agent_id === filters.main_agent_id
    )
    .map(agent => ({
      label: agent.name,
      value: agent.id
    }));
});

const showMainAgent = computed(() => filters.channel === 'agent' || filters.channel === 'online');
const showSubAgent = computed(() => filters.channel === 'agent' && !!filters.main_agent_id);


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



watch(() => filters.main_agent_id, () => {
  filters.sub_agent_id = null;
});





const submitForm = async () => {
  searched.value = true;

  const plainFilters = {
    channel: unref(filters.channel),
    main_agent_id: unref(filters.main_agent_id),
    sub_agent_id: unref(filters.sub_agent_id),
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
          <h4 class="text-h5 py-3">Agent Ledger</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="submitForm">
        <VRow>
          <VCol cols="12" md="3">
            <span class="fs-15 label-color font-weight-medium">Channel<span class="text-red">*</span></span>
            <AppAutocomplete :items="channels" v-model="filters.channel" placeholder="Choose channel"
              :rules="[requiredValidator]" />
          </VCol>
          <VCol v-if="showMainAgent" cols="12" md="3">
            <span class="fs-15 label-color font-weight-medium">Main Agent<span class="text-red">*</span></span>
            <AppAutocomplete :items="getMainAgents" v-model="filters.main_agent_id" placeholder="Select main agent"
              item-title="label" item-value="value" :rules="[requiredValidator]" />
          </VCol>
          <VCol v-if="showSubAgent" cols="12" md="3">
            <span class="fs-15 label-color font-weight-medium">Sub Agent<span class="text-red">*</span></span>
            <AppAutocomplete :items="getSubAgents" v-model="filters.sub_agent_id" placeholder="Select sub agent"
              item-title="label" item-value="value" :rules="[requiredValidator]" />
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
          <VCol cols="12" class="d-flex gap-4">
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
          <th>FC Amount</th>
          <th>Admin Charges</th>
          <th>Debit</th>
          <th>Credit</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody class="ledgertbody">
        <tr id="">
          <td colspan="6">Opening Balance</td>
          <td>{{ isNaN(Number(agentledgers.opening_balance)) ? '0.00' : Number(agentledgers.opening_balance).toFixed(2)
          }}</td>
        </tr>
        <tr v-for="(entry, index) in agentledgers.ledgers" :key="entry.id">
          <td>{{ entry.date }}</td>
          <td class="text-wrap">{{ entry.description }}</td>
          <td>{{ entry.fc_amount }}</td>
          <td>{{ entry.admin_charges }}</td>
          <td>{{ entry.debit }}</td>
          <td>{{ entry.credit }}</td>
          <td>{{ entry.runningBalance }}</td>
        </tr>
        <tr>
          <td colspan="6">Closing Balance</td>
          <td>
            {{
              isNaN(Number(agentledgers.closing_balance))
                ? '0.00'
                : Number(agentledgers.closing_balance) < 0 ?
                  `(${Math.abs(Number(agentledgers.closing_balance)).toFixed(2)})` :
                  Number(agentledgers.closing_balance).toFixed(2) }} </td>
        </tr>
        <tr>
          <td colspan="4">Total Debit & Credit</td>
          <td>{{ agentledgers.total_debit }}</td>
          <td colspan="2">{{ agentledgers.total_credit }}</td>
        </tr>
        <tr>
          <td colspan="4">Total Number of Transaction</td>
          <td colspan="3">{{ agentledgers.total_number_of_transactions }}</td>
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
