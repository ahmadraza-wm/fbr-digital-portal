<script setup>
import { ref, onMounted} from 'vue';
import profilePassword from '@/components/agent-portal/profilePassword.vue';
import agentDocuments from '@/components/agent-portal/agentDocuments.vue';
import { useAgentProfile } from '@/composables/agentPortal/useProfile';
const {userDetails,fetchProfileDetail} = useAgentProfile();
const currentTab = ref('tab-1');
onMounted(()=>{
  fetchProfileDetail();
});
</script>
<template>
  <v-card class="mb-4">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex align-center" style="background-color: lightgrey;">
          <h4 class="text-h5 py-3">Profile</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="px-0 pt-0 pb-5">
      <v-row class="border-b-md px-5">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Name</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1 text-capitalize">{{ userDetails?.name || '----' }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Email</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ userDetails?.email || '----' }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Code/Prefix</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ userDetails?.agent_code || '----' }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Gender</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1 text-capitalize">{{ userDetails?.gender || '----' }}</p>
        </v-col>
      </v-row>
      <v-row class="px-5">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">DOB</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ userDetails?.dob || '----' }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Country</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ userDetails?.country || '----' }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Status</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            <VChip :color=" userDetails?.status == 1 ? 'success' : 'error'" class="font-weight-medium" size="small">
              {{ userDetails?.status ? 'Active' : 'Inactive' }}
            </VChip>
          </p>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <VCard>
    <VCardText class="px-3 pt-0 border-b-sm">
      <VTabs v-model="currentTab" class="v-tabs-pill pt-8 pb-2">
        <VTab value="tab-1">Change Password</VTab>
        <VTab value="tab-2">Agent Documents</VTab>
      </VTabs>
    </VCardText>
    <VCardText class="px-0">
      <VWindow v-model="currentTab">

        <!-- TAB 1 -->
        <VWindowItem value="tab-1">
          <profilePassword class="px-2"/>
        </VWindowItem>

        <!-- TAB 2 -->
        <VWindowItem value="tab-2">
          <agentDocuments :userId="userDetails?.id"/>
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCard>

</template>
