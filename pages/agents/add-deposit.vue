<script setup>
import { useAgentDeposits } from "@/composables/useAgentDeposits";
import { useAgents } from "@/composables/useAgents";
import { computed, reactive, ref } from "vue";
definePageMeta({
  middleware: "auth",
  permission: "agentDeposits.store"
})
const channel = ref([
  { title: "Agent", value: "agent" },
  { title: "Online", value: "online" },
]);

const depositType = ref([
  { title: "Cash", value: "cash" },
  { title: "Cheque", value: "cheque" },
  { title: "Debit Card (ST)", value: "debit_card" },
  { title: "Via Chip/Pin (ST)", value: "via_chip_pin" },
  { title: "Via Phone (WP)", value: "via_phone" },
]);



const form = reactive({
  channel: '',
  main_agent_id: null,
  sub_agent_id: null,
  deposit_amount: '',
  deposit_type: '',
  deposit_notes: '',
  file: null,
});





const resetForm = {
  channel: '',
  main_agent_id: null,
  sub_agent_id: null,
  deposit_amount: '',
  deposit_type: '',
  deposit_notes: '',
  file: null,
};


function handleReset() {
  Object.assign(form, resetForm);
}
const formRef = ref(null);
const {
  agents
} = useAgents();

const {
  saveAgentDeposit
} = useAgentDeposits();

const loading = ref(false);

// Conditional rendering logic
const showMainAgent = computed(() => form.channel === 'agent' || form.channel === 'online');
const showSubAgent = computed(() => form.channel === 'agent' && !!form.main_agent_id);

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
      agent.main_agent_id === form.main_agent_id
    )
    .map(agent => ({
      label: agent.name,
      value: agent.id
    }));
});


watch(() => form.main_agent_id, () => {
  form.sub_agent_id = null;
});


const submitForm = async () => {
  const { valid } = await formRef.value.validate();

  if (!valid) return;

  saveAgentDeposit(form);
};
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex justify-space-between align-center"
          style="background-color: lightgrey;">
          <div class="d-flex align-center">
            <BackNavigation />
            <h4 class="text-h5 py-3">New Deposits</h4>
          </div>
          <VBtn variant="elevated" to="/agents/agent-deposits" color="primary">
            Deposits List
          </VBtn>
        </v-card-title>
        <v-card-text class="px-4 pt-4">
          <VForm @submit.prevent="submitForm" ref="formRef">
            <VRow>
              <VCol cols="12" md="6">
                <span class="fs-15 label-color font-weight-medium">Channel<span class="text-red">*</span></span>
                <AppAutocomplete :items="channel" v-model="form.channel" placeholder="Choose channel"
                  :rules="[requiredValidator]" autocomplete="off"/>
              </VCol>
              <VCol v-if="showMainAgent" cols="12" md="6">
                <span class="fs-15 label-color font-weight-medium">Main Agent<span class="text-red">*</span></span>
                <AppAutocomplete :items="getMainAgents" item-title="label" item-value="value"
                  v-model="form.main_agent_id" placeholder="Select main agent" :rules="[requiredValidator]" autocomplete="off" />
              </VCol>
              <VCol v-if="showSubAgent" cols="12" md="6">
                <span class="fs-15 label-color font-weight-medium">Sub Agent<span class="text-red">*</span></span>
                <AppAutocomplete :items="getSubAgents" item-title="label" item-value="value" v-model="form.sub_agent_id"
                  placeholder="Select sub agent" :rules="[requiredValidator]" autocomplete="off" />
              </VCol>
              <v-col cols="12" md="6">
                <span class="fs-15 label-color font-weight-medium">Deposit Amount<span class="text-red">*</span></span>
                <AppTextField name="amount" type="number" v-model="form.deposit_amount" placeholder="Desposit amount"
                  :rules="[requiredValidator]" autocomplete="off" />
              </v-col>
              <VCol cols="12" md="6">
                <span class="fs-15 label-color font-weight-medium">Deposit Type<span class="text-red">*</span></span>
                <AppAutocomplete :items="depositType" v-model="form.deposit_type" placeholder="Select deposit type"
                  :rules="[requiredValidator]" autocomplete="off" />
              </VCol>
              <VCol cols="12" md="6">
                <span class="fs-15 label-color font-weight-medium">Attach File<span class="text-red">*</span></span>
                <VFileInput chips v-model="form.file" :rules="[requiredValidator]" />
              </VCol>
              <v-col cols="12">
                <span class="fs-15 label-color font-weight-medium">Description<span class="text-red">*</span></span>
                <AppTextarea rows="5" name="description" v-model="form.deposit_notes" class="cursor-pointer"
                  placeholder="Type here" :rules="[requiredValidator]" autocomplete="off" />
              </v-col>
              <VCol cols="12" class="d-flex gap-4 justify-end">
                <VBtn type="reset" color="secondary" variant="tonal" @click="handleReset"> Reset </VBtn>
                <VBtn type="submit" variant="tonal" class="login-btn" :loading="loading">
                  Add Deposit
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>
