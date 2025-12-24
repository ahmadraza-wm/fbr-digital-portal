<script setup>
import { onMounted } from "vue"
import { useRoute } from "vue-router"
import { useAgents } from "@/composables/useAgents"

import AgentForm from '@/components/agents/AgentForm.vue'
import AuditLog from '@/components/AuditLog.vue'
import AgentDocument from '@/components/agents/AgentDocument.vue'

definePageMeta({
  middleware: "auth",
  permission: "agents.update"
})

const route = useRoute()
const agentId = route.params.id

const {
  documents,
  fetchAgentById,
  fetchAgentDocuments,
  updateDocumentStatus
} = useAgents()

onMounted(async () => {
  await fetchAgentById(agentId)        
  await fetchAgentDocuments(agentId)   
})
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

  <AgentDocument
    :documents="documents"
    :updateDocumentStatus="updateDocumentStatus"
    :agentId="agentId"
  />

  <AuditLog module="Agent" :id="agentId" />
</template>
