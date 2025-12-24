<script setup>
import { useAgentDeposit } from "@/composables/agentPortal/useDeposits";
import DepositForm from "@/components/agent-portal/DepositForm.vue";
import { useRoute } from 'vue-router'
import { onMounted, ref } from "vue";

definePageMeta({
  middleware: "auth",
  permission: "agent.deposits.index"
})

const {
 updateAgentDeposit, fetchAgentDepositById
} = useAgentDeposit();

const route = useRoute();
const depositId = route.params.id;
const initialData = ref({});
const loading = ref(false);

onMounted(async () => {
  if (depositId) {
    loading.value = true;
    const data = await fetchAgentDepositById(depositId);
    if (data) {
      initialData.value = data;
    }
    loading.value = false;
  }
});

const submitForm = (formData) => {
  updateAgentDeposit(depositId, formData);
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
            <h4 class="text-h5 py-3">Edit Deposit</h4>
          </div>
          <VBtn variant="elevated" to="/agent/deposits" color="primary">
            Deposits List
          </VBtn>
        </v-card-title>
        <v-card-text class="px-4 pt-4">
            <template v-if="!loading">
               <DepositForm @submit="submitForm" :isEdit="true" :initialData="initialData" />
            </template>
            <template v-else>
               <div>Loading...</div>
            </template>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>
