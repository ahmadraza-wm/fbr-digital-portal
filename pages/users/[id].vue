<script setup>
import AuditLog from '@/components/AuditLog.vue';
import assignPermission from '@/components/users/assign-permissions.vue';
import editUser from '@/components/users/edit-user.vue';
import ipWhitelist from '@/components/users/ip-whitelist.vue';
import unassignPermission from '@/components/users/unassign-permissions.vue';
import { useGoogleVerify } from "@/composables/useGoogleVerify";
import { useUsers } from "@/composables/useUsers";
import { onMounted, ref } from "vue";
const permissionStore = usePermissionStore()
definePageMeta({
  middleware: "auth",
  permission: "backofficeuser.show"
})
const currentTab = ref("tab-1");
const requiredValidator = (v) => !!v || "This field is required";

const emit = defineEmits(["refresh-user"]);
const route = useRoute();

const {
  singleUser,
  fetchUserById,
  loading,
} = useUsers();




onMounted(async () => {
  const id = route.params.id;
  await fetchUserById(id);
  updateCurrentTab();
});


const {
  enable2FA,
  disable2FA,
  verify2FAToken,
  qrData } = useGoogleVerify();



const userId = computed(() => singleUser.value.user?.id);

const google_FA = ref("yes");

const faItem = [
  { title: "Yes", value: "yes" },
  { title: "No", value: "no" },
];



const handleSubmit = async () => {
  if (google_FA.value === "yes") {
    await enable2FA(userId.value);

    await fetchUserById(route.params.id);

  } else {
    await disable2FA(userId.value);

    await fetchUserById(route.params.id);
  }
};


function updateCurrentTab() {
  // Tab order ke hisaab se check karte hain
  if (permissionStore.hasPermission('backofficeuser.update')) {
    currentTab.value = 'tab-1'
  } else if (permissionStore.hasPermission('permissions.index')) {
    currentTab.value = 'tab-2'
  } else if (permissionStore.hasPermission('ip_address.index')) {
    currentTab.value = 'tab-3'
  } else if (permissionStore.hasPermission('enable.2fa')) {
    currentTab.value = 'tab-4'
  } else {
    // Agar kisi bhi tab ka permission nahi mila, fallback tab-5 (Audit Log)
    currentTab.value = 'tab-5'
  }
}




</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex align-center" style="background-color: lightgrey;">
          <BackNavigation />
          <h4 class="text-h5 py-4">User Details</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="px-0 pt-0 pb-5">
      <v-row class="border-b-md px-5">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Name</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ singleUser.user?.name || '----' }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Email</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ singleUser.user?.email || '-----' }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Status</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            <VChip :color="singleUser.user?.status == 1 ? 'success' : 'error'" class="font-weight-medium" size="small">
              {{ singleUser.user?.status == 1 ? "Active" : "Inactive" }}
            </VChip>
          </p>
        </v-col>

        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Google 2FA</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ singleUser.user?.google2fa_enabled === 1 ? "Enabled" :
            "Disabled" }}</p>
        </v-col>
      </v-row>
      <v-row class="px-5">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Total Ip's</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ singleUser.user?.ip_addresses }}</p>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <VTabs v-model="currentTab" class="v-tabs-pill pt-8 pb-2">
    <VTab value="tab-1" v-show="permissionStore.hasPermission('backofficeuser.update')">Edit</VTab>
    <VTab value="tab-2" v-show="permissionStore.hasPermission('permissions.index')">Permission</VTab>
    <VTab value="tab-3" v-show="permissionStore.hasPermission('ip_address.index')">Ip Whitelist</VTab>
    <VTab value="tab-4" v-show="permissionStore.hasPermission('enable.2fa')">Google 2FA</VTab>
    <VTab value="tab-5">Audit Log</VTab>
  </VTabs>

  <VCardText class="px-0">
    <VWindow v-model="currentTab">
      <VWindowItem value="tab-1" class="" v-show="permissionStore.hasPermission('backofficeuser.update')">
        <editUser :singleuser="singleUser" :userId="route.params.id" />
      </VWindowItem>
      <VWindowItem value="tab-2" v-show="permissionStore.hasPermission('permissions.index')">
        <assignPermission :userId="singleUser.user?.id" />
        <unassignPermission :userId="singleUser.user?.id" />
      </VWindowItem>
      <VWindowItem value="tab-3" v-show="permissionStore.hasPermission('ip_address.index')">
        <ipWhitelist :userId="singleUser.user?.id" :singleuserid="route.params.id"
          @refresh-user="fetchUserById(route.params.id)" />
      </VWindowItem>
      <VWindowItem value="tab-4" v-show="permissionStore.hasPermission('enable.2fa')">
        <VCard>
          <v-card-title class="border-b-sm" style="background-color: lightgrey;">
            <h4 class="text-h5 py-3">Google 2FA</h4>
          </v-card-title>
          <v-card-text class="pt-3">
            <VForm @submit.prevent="handleSubmit">
              <VRow>
                <v-col cols="12" md="9">
                  <span class="fs-15 label-color font-weight-medium">Google 2FA Enabled?</span>
                  <AppAutocomplete :items="faItem" v-model="google_FA" />
                </v-col>
                <v-col cols="12" md="3" class="d-flex align-end gap-4">
                  <VBtn type="submit" variant="tonal" class="login-btn">
                    Update
                  </VBtn>
                  <VBtn color="secondary" variant="tonal" @click="handleSubmit"> Regenerate </VBtn>
                </v-col>
              </VRow>
            </VForm>
          </v-card-text>
        </VCard>
        <!-- QR Code Display -->
        <div v-if="qrData?.qr_code" class="mt-4">
          <h4>Scan this QR Code</h4>
          <img :src="'data:image/png+xml;base64,' + qrData.qr_code" alt="QR Code" width="200" />

          <p class="text-muted mt-2">Secret: {{ qrData.secret }}</p>
        </div>



      </VWindowItem>
      <VWindowItem value="tab-5" class="">
        <AuditLog module="BackOfficeUser" :id="singleUser.user?.id"/>
      </VWindowItem>
    </VWindow>
  </VCardText>
</template>
