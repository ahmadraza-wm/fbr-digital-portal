<script setup>
definePageMeta({
  middleware: "auth",
  permission: "agent_login_ip.index"
})
const permissionStore = usePermissionStore()
import { ref, onMounted } from 'vue'
import { useAgents } from "@/composables/useAgents";
import agentIpWhiteList from '@/components/agents/agentIpWhiteList.vue';
import { useRoute } from "vue-router";
import assignPermissions from '@/components/agents/assign-permissions.vue';
import unassignPermissions from '@/components/agents/unassign-permissions.vue';
import agentSchedule from '@/components/agents/agentSchedule.vue';
const { $axios } = useNuxtApp();
const showpass = ref(false);
const popup = ref(false)
const status = [
  { title: 'Active', value: 1 },
  { title: 'Inactive', value: 0 }
];

const form = ref({
  status: 0,
  google2fa_enabled: 0,
});


const formData = ref({
  password: '',
  email: '',
  password_confirmation: ''
});

const route = useRoute();
const agentData = ref([]);
const agentStatus = ref('');
const agentPass = ref('')
const agentEmail =  ref('')
const permissionsKey = ref(0);
const {
  agentsId,
  agents,
  documents,
  updateDocumentStatus,
  fetchAgentDocuments,
  UpdateAgentStatus,
  fetchAgentPermissions
} = useAgents()

const FetchDetials = async()=>{
   try {
    const id = route.params.id;
    const response = await $axios.get(`/agents/${id}`);
    agentData.value = response.data.data;
  } catch (error) {
    console.error("Failed to fetch agent data", error);
  }
  form.value.status = agentData?.value.user?.status;
  form.value.google2fa_enabled = agentData?.value.user?.google2fa_enabled;
  formData.value.email = agentData?.value.email;
}

onMounted(() => {
   FetchDetials();
});

const UpdateStatus = async () => {
  const { valid } = await agentStatus.value.validate();

  if (!valid) {
    return;
  }
  const payload = {
    google2fa_enabled:form.value.google2fa_enabled,
    email:formData.value.email,
    status: form.value.status,
  };

  UpdateAgentStatus(agentData?.value.user?.id, payload);
  FetchDetials();
}
const UpdatePassword = async () => {
  const { valid } = await agentPass.value.validate();

  if (!valid) {
    return;
  }
  const payload = {
    password: formData.value.password,
    password_confirmation: formData.value.password_confirmation,
    email:formData.value.email,
    status: form.value.status,
  };

  await UpdateAgentStatus(agentData.value.user.id, payload);

  formData.value.password = "";
  showSuccess("Password updated successfully");
};



const UpdateEmail = async () => {
  const { valid } = await agentEmail.value.validate();
  if (!valid) {
    return;
  }
  const payload = {
    email: formData.value.email,
    status: form.value.status,
  };

  await UpdateAgentStatus(agentData.value.user.id, payload);
  FetchDetials();
  showSuccess("Email updated successfully");
};

const onReset = () => {
  form.value.status = agentData?.value.user?.status;
  form.value.google2fa_enabled = agentData?.value.user?.google2fa_enabled
}

const refreshPermissions = async () => {
  if (agentData.value?.user?.id) {
    await fetchAgentPermissions(agentData.value.user.id);
    permissionsKey.value++; // Force components to re-render
  }
}
</script>
<template>
  <v-card class="mb-5">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex align-center" style="background-color: lightgrey;">
          <BackNavigation />
          <h4 class="text-h5 py-4">Agent Login & IP Settings</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="px-0 pt-0">
      <!-- <v-row class="border-b px-6 py-4 d-flex justify-space-between">
        <div class="d-flex align-center">
          <p class="mb-0 lh-22 text-color" v-if="showpass">Your Password is Talha12@123.</p>
        </div>
        <div>
          <VBtn variant="tonal" color="secondary" class="mr-2" @click="showpass = true">Show Password</VBtn>
          <VBtn variant="elevated" color="primary" @click="popup = true">Reset Agent Password</VBtn>
        </div>
      </v-row> -->
      <v-row class="border-b px-5">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Name</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1 text-capitalize">{{ agentData?.name }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Email</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ agentData?.email }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Phone</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ agentData?.phone }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Gender</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1 text-capitalize">{{ agentData?.gender }}</p>
        </v-col>
      </v-row>
      <v-row class="border-b px-5">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Code/Prefix</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ agentData?.agent_code }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Status</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            <VChip :style="{
              backgroundColor:
                agentData?.status === 1 ? '#28C76F29' : '#FF9F4329',
              color: agentData?.status === 1 ? '#28C76F' : '#FF9F43',

              marginTop: '2px',
            }" class="font-weight-light fs-12 p-1" size="small">
              {{ agentData?.status === 1 ? "Active" : "Inactive" }}
            </VChip>
          </p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Type</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1 text-capitalize">{{ agentData?.type }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Main Agent</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ agentData?.main_agent_name || '-----' }}</p>
        </v-col>
      </v-row>
      <v-row class="border-b px-5">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Create Transaction</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            <VChip :style="{
              backgroundColor:
                1 === 1 ? '#28C76F29' : '#FF9F4329',
              color: 1 === 1 ? '#28C76F' : '#FF9F43',

              marginTop: '2px',
            }" class="font-weight-light fs-12 p-1" size="small">
              {{ 1 === 1 ? "Yes" : "No" }}
            </VChip>
          </p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Country</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1 text-capitalize">{{ agentData?.country }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">City</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1 text-capitalize">{{ agentData?.city || '-----' }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Edit Rate</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            <VChip :style="{
              backgroundColor:
                agentData?.edit_rate_allow === 1 ? '#28C76F29' : '#FF9F4329',
              color: agentData?.edit_rate_allow === 1 ? '#28C76F' : '#FF9F43',

              marginTop: '2px',
            }" class="font-weight-light fs-12 p-1" size="small">
              {{ agentData?.edit_rate_allow === 1 ? "Yes" : "No" }}
            </VChip>
          </p>
        </v-col>
      </v-row>
      <v-row class="px-5 border-b">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Nationality</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1 text-capitalize">{{ agentData?.nationality }}</p>
        </v-col>
      </v-row>
      <v-row v-if="permissionStore.hasPermission('agent.portal.user.update')">
        <v-col cols="12">
          <v-card-text class="px-4 border-b">
            <VForm @submit.prevent="UpdateStatus" ref="agentStatus">
              <VRow>
                <VCol cols="12" md="5">
                  <span class="fs-15 label-color font-weight-medium">Login Status<span class="text-red">*</span></span>
                  <AppAutocomplete :items="status" v-model="form.status" placeholder="Select type"
                    :rules="[requiredValidator]" />
                </VCol>
                <VCol cols="12" md="5">
                  <span class="fs-15 label-color font-weight-medium">2FA Status<span class="text-red">*</span></span>
                  <AppAutocomplete :items="status" v-model="form.google2fa_enabled" placeholder="Select type"
                    :rules="[requiredValidator]" />
                </VCol>
                <VCol cols="12" md="2" class="d-flex gap-4 pt-md-9">
                  <VBtn color="secondary" variant="tonal" @click="onReset"> Reset </VBtn>
                  <VBtn type="submit" variant="tonal" class="login-btn">
                    Update
                  </VBtn>
                </VCol>
              </VRow>
            </VForm>
          </v-card-text>

        </v-col>
        <v-col cols="12">
          <v-card-text class="px-4 py-3">
            <VForm @submit.prevent="UpdatePassword" ref="agentPass">
              <VRow>
                <VCol cols="12" sm="5">
                  <span class="fs-13 label-color">Change Password</span>
                  <AppTextField placeholder="***********" type="text" v-model="formData.password" :rules="[requiredValidator, passwordValidator]" />
                </VCol>
                <VCol cols="12" sm="5">
                  <span class="fs-13 label-color">Confirm Change Password</span>
                  <AppTextField placeholder="***********" type="text" v-model="formData.password_confirmation" :rules="[requiredValidator, passwordValidator, confirmedValidator(formData.password_confirmation, formData.password)]" />
                </VCol>
                <VCol cols="12" sm="2" class="pt-sm-9 d-flex gap-2">
                  <VBtn type="reset" variant="tonal" color="secondary">
                    Reset
                  </VBtn>
                  <VBtn type="submit" variant="tonal" color="error">
                    Update
                  </VBtn>
                </VCol>
              </VRow>
            </VForm>
          </v-card-text>
          <v-card-text class="px-4 py-3">
            <VForm @submit.prevent="UpdateEmail" ref="agentEmail">
              <VRow>
                <VCol cols="12" sm="10">
                  <span class="fs-13 label-color">Change Email</span>
                  <AppTextField placeholder="***********" type="text" v-model="formData.email" :rules="[requiredValidator, emailValidator]" />
                </VCol>
                <VCol cols="12" sm="2" class="d-flex gap-2 d-flex pt-sm-9">
                  <VBtn type="submit" variant="tonal" color="error">
                    Update
                </VBtn>
                </VCol>
              </VRow>
            </VForm>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <agentIpWhiteList :userId="agentData?.user?.id" v-if="permissionStore.hasPermission('ip_address.index')" />
  <!--Agent Assign Permissions-->
  <assignPermissions :userId="agentData?.user?.id" :refreshTrigger="permissionsKey" @permissions-updated="refreshPermissions" v-if="permissionStore.hasPermission('agent.permissions.index')"/>
  <!--Agent Un Assign Permissions-->
  <unassignPermissions :userId="agentData?.user?.id" :refreshTrigger="permissionsKey" @permissions-updated="refreshPermissions" v-if="permissionStore.hasPermission('agent.permissions.index')" />
  <!-- Agent Schedule -->
  <agentSchedule v-if="permissionStore.hasPermission('agent.schedule.index')"/>
  <!--Agent Reset Password Confirm Modal-->
  <div class="text-center pa-4">
    <v-dialog v-model="popup" max-width="500" persistent transition="scale-transition">
      <v-card>
        <VCardTitle class="border-b-sm d-flex justify-space-between align-center">
          <h4 class="text-h5">Attention</h4>
          <VBtn icon variant="text" color="secondary" class="px-0" @click="popup = false">
            <VIcon icon="tabler-x" />
          </VBtn>
        </VCardTitle>
        <VForm @submit.prevent="">
          <VCardText class="py-3 px-4">
            <VRow>
              <VCol cols="12">
                <span class="fs-16 text-error">Please press confirm button to proceed.</span>
              </VCol>
            </VRow>
          </VCardText>
          <v-card-actions class="border-t-sm pt-3">
            <v-row>
              <v-col cols="12" class="d-flex justify-end">
                <v-btn color="seconadry" variant="tonal" type="submit" @click="popup = false">
                  Discard
                </v-btn>
                <v-btn color="white" variant="elevated" type="submit" class="login-btn" @click="popup = false">
                  Confirm
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </VForm>
      </v-card>
    </v-dialog>
  </div>
</template>
