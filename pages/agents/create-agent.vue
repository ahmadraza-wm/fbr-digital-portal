<script setup>
import { ref, onMounted } from 'vue'
import AgentForm from '@/components/agents/AgentForm.vue'
const agentList = ref(null)
onMounted(() => {
  agentList.value = window.history.state?.agentList
})

definePageMeta({
  middleware: "auth",
  permission: "agents.store"
})

</script>

<template>
    <v-card>
        <v-card-title class="mb-4 d-flex align-center" style="background-color: lightgrey;">
             <BackNavigation v-if="agentList" />
            <h4 class="text-h4 py-3 px-2">Create Agent</h4>
        </v-card-title>
        <v-card-text>
            <AgentForm :isEdit="false" />
        </v-card-text>
    </v-card>

</template>
