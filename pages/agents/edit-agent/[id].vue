<script setup>
import AgentForm from '@/components/agents/AgentForm.vue'
import AuditLog from '@/components/AuditLog.vue'
import AgentDocument from '@/components/agents/AgentDocument.vue'
const route = useRoute()
const agentId = route.params.id
</script>
<template>
  <v-card>
    <v-card-title style="background-color: lightgrey;" class="d-flex align-center">
      <BackNavigation />
      <h4 class="text-h5 py-3 px-2">Edit Agent Details</h4>
    </v-card-title>
    <v-card-text class="pt-5">
      <AgentForm :isEdit="true" />
    </v-card-text>
  </v-card>
  <AgentDocument/>
  <AuditLog module="Agent" :id="agentId"/>
</template>
