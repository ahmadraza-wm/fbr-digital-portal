<script setup>
import { useCompanies } from "@/composables/useCompanies";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
const { CompanyDetail, fetchCompanyById, statuses, addLoginIpByUserId, updateLoginIpByUserId, deleteLoginIpByUserId } = useCompanies();
const permissionStore = usePermissionStore()

definePageMeta({
  middleware: "auth",
  permission: "company_ips.create"
})
const route = useRoute();
const userId = computed(() => CompanyDetail?.value?.user?.id ?? null)
const isEditing = ref(null);
const formRef = ref();
const canShowIpAction = computed(() => {
  return (
    permissionStore.hasPermission('company_ips.update') ||
    permissionStore.hasPermission('company_ips.delete')
  )
})

const ipHeaders = computed(() => {
  const baseheaders = [
    { title: "#", key: "sr_no" },
    { title: "Ip", key: "ip_address" },
    { title: "Status", key: "status" },
  ]

  if (canShowIpAction.value) {
    baseheaders.push({ title: "Action", key: "action" })
  }

  return baseheaders
});

const formatDate = (date) => {
  if (!date) return '---'

  const d = new Date(date)
  if (isNaN(d)) return '---'

  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const formdata = ref({
  ip_address: "",
  status: "",
})

const submitForm = async () => {
  const { valid } = await formRef.value.validate();

  if (!valid) {
    return;
  }

  const response = true;

  if (isEditing.value == null) {
    const response = await addLoginIpByUserId(route.params.id, formdata.value);
  }
  else {
    const response = await updateLoginIpByUserId(route.params.id, isEditing?.value?.id, formdata.value);
  }
  if (response) {
    await fetchCompanyById(route.params.id);
    formRef.value.reset();
    isEditing.value = null;
  }
}

const editIp = (item) => {
  isEditing.value = item
  formdata.value.ip_address = item.ip_address
  formdata.value.status = item.status
}

const deleteIp = async (item) => {
  await deleteLoginIpByUserId(route.params.id, item?.id, formdata.value);
  await fetchCompanyById(route.params.id);
}

onMounted(async () => {
  await fetchCompanyById(route.params.id);
});

</script>
<template>
  <v-card class="mb-4">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex align-center bg-primary">
          <BackNavigation color="text-white" />
          <h4 class="text-h5 py-3 text-white">Login Ip Settings</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="px-0 pt-0">
      <v-row class="border-b-md px-5">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Company Id</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ CompanyDetail?.id || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Company Name</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ CompanyDetail?.company_name || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Company Code</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ CompanyDetail?.company_code || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Status</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            <VChip :color="CompanyDetail?.user?.status == 1 ? 'success' : 'error'" class="font-weight-medium"
              size="small" variant="elevated">
              {{ CompanyDetail?.user?.status == 1 ? "Active" : "Inactive" }}
            </VChip>
          </p>
        </v-col>
      </v-row>
      <v-row class="border-b-md px-5">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">First Name</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ CompanyDetail?.user?.first_name || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Last Name</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ CompanyDetail?.user?.last_name || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Email</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ CompanyDetail?.user?.email || "---" }}</p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Created At</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">{{ formatDate(CompanyDetail?.created_at) }}</p>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-card class="mb-4">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex align-center justify-space-between bg-secondary">
          <h4 class="text-h5 py-3 text-white">{{ isEditing ? 'Update' : 'Add' }} Ip</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="px-0 pt-0">
      <v-row>
        <v-col cols="12">
          <v-card-text class="px-4 py-0">
            <VForm ref="formRef" @submit.prevent="submitForm">
              <VRow>
                <VCol cols="12" md="4">
                  <span class="fs-13 label-color">Ip<span class="text-red">*</span></span>
                  <AppTextField placeholder="Ip" type="text" v-model="formdata.ip_address"
                    :rules="[requiredValidator]" />
                </VCol>
                <VCol cols="12" md="4">
                  <span class="fs-13 label-color">Status<span class="text-red">*</span></span>
                  <AppAutocomplete :items="statuses" item-title="text" item-value="value" placeholder="Select status"
                    v-model="formdata.status" :rules="[requiredValidator]" />
                </VCol>
                <VCol cols="12" md="4" class="d-flex gap-4 pt-md-8">
                  <VBtn type="submit" variant="tonal" class="login-btn" :loading="loading">
                    {{ !isEditing ? 'Add' : 'Update' }} Ip
                  </VBtn>
                  <VBtn type="reset" color="secondary" variant="elevated" @click="isEditing = null">Reset</VBtn>
                </VCol>
              </VRow>
            </VForm>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-card class="mb-4">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex align-center justify-space-between bg-secondary">
          <h4 class="text-h5 py-3 text-white">Ip Whitelists</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="px-0 pb-0 pt-0">
      <v-data-table :headers="ipHeaders" :items="CompanyDetail?.ip_whitelists" item-key="name" hide-default-footer
        class="border-t-sm border-b-sm">
        <template #item.sr_no="{ index }">
          {{ index + 1 }}
        </template>
        <template #item.status="{ item }">
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            <VChip :color="item?.status == 1 ? 'success' : 'error'" class="font-weight-light fs-12 p-1" size="small"
              variant="elevated">
              {{ item?.status === true ? "Active" : "Inactive" }}
            </VChip>
          </p>
        </template>
        <template #item.action="{ item }">
          <VBtn icon variant="text" v-if="permissionStore.hasPermission('company_ips.update')">
            <VIcon icon="tabler-edit" @click="editIp(item)" color="primary"></VIcon>
          </VBtn>
          <VBtn icon variant="text" v-if="permissionStore.hasPermission('company_ips.delete')">
            <VIcon icon="tabler-trash" color="error" @click="deleteIp(item)"></VIcon>
          </VBtn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
