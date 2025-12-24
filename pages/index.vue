<script setup>
definePageMeta({
  middleware: "auth",
  name: "dashboard",
});
import adminDashboard from '@/components/adminDashboard.vue';
import agentDashboard from '@/components/agentDashboard.vue';
const authStore = useAuthStore();
const userRole = useCookie("roles");
if(authStore.roles === null)
{
  authStore.roles = userRole.value;
}
</script>
<template>
  <!-- <adminDashboard v-if="authStore.roles === 'super_admin' || userRole === 'super_admin' || authStore.roles === 'back_office_user' ||  userRole === 'back_office_user'" />
  <agentDashboard v-if="authStore.roles === 'agent' || userRole === 'agent'" /> -->
  <VCard>
    <VCardText>
     <VRow>
      <VCol>
       <strong>Payout Dashboard</strong>
      </VCol>
     </VRow>
    </VCardText>
  </VCard>
</template>
