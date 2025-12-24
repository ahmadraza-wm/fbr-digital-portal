<script setup>
import { useAgentDeposit } from "@/composables/agentPortal/useDeposits";
import DepositForm from "@/components/agent-portal/DepositForm.vue";

definePageMeta({
  middleware: "auth",
  permission: "agent.deposits.index"
})

const {
 saveAgentDeposit
} = useAgentDeposit();

const submitForm = (formData) => {
  saveAgentDeposit(formData);
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
            <h4 class="text-h5 py-3">Add New Deposit</h4>
          </div>
          <VBtn variant="elevated" to="/agent/deposits" color="primary">
            Deposits List
          </VBtn>
        </v-card-title>
        <v-card-text class="px-4 pt-4">
          <DepositForm @submit="submitForm" />
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>
