<script setup>
import { useIpWhitelist } from '@/composables/useIpWhitelist';
import { useUsers } from "@/composables/useUsers";
const permissionStore = usePermissionStore()

const emit = defineEmits(["refresh-user"]);

const {
  iplist,
  formdata,
  fetchIplist,
  editId,
  formRef,
  isEditing,
  handleSubmit,
  resetForm,
  loading


} = useIpWhitelist();

const {

  fetchUserById
} = useUsers();





const props = defineProps({
  userId: {
    type: String,
    required: true,
  },
  singleuserid: {
    type: [Number, String],
    required: true,
  }

});

onMounted(() => {
  fetchIplist(props.userId)

})

const edit = (ip) => {
  formdata.value = { ...ip };
  isEditing.value = true;
  editId.value = ip.id;
}

const submitForm = async () => {

  await handleSubmit(props.userId)

  await fetchUserById(props.singleuserid)

  emit('refresh-user');


}



const statusItem = [
  { title: "Active", value: 1 },
  { title: "Inactive", value: 0 },
]
</script>

<template>
  <v-card class="mb-5" v-if="permissionStore.hasPermission('ip_address.create') || isEditing">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm" style="background-color: lightgrey;">
          <h4 class="text-h5 py-4">Add Ip</h4>
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
                  <AppAutocomplete :items="statusItem" placeholder="Select status" v-model="formdata.status"
                    :rules="[requiredValidator]" />
                </VCol>
                <VCol cols="12" md="4" class="d-flex gap-4 pt-md-8">
                  <VBtn type="submit" variant="tonal" class="login-btn" :loading="loading">
                    {{ !isEditing ? 'Add' : 'Update' }} Ip
                  </VBtn>
                  <VBtn type="reset" color="secondary" variant="tonal" @click="resetForm">Reset</VBtn>
                </VCol>
              </VRow>
            </VForm>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card-text>


  </v-card>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm" style="background-color: lightgrey;">
          <h4 class="text-h5 py-4">Ip Whitelist</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="py-0 px-0">
      <v-table class="text-no-wrap">
        <thead>
          <tr>
            <th>#</th>
            <th>Ip</th>
            <th>Status</th>
            <th>Created At</th>
            <th v-if="permissionStore.hasPermission('ip_address.update')">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(ip, index) in iplist" :key="ip.id">
            <td>{{ index + 1 }}</td>
            <td>{{ ip.ip_address }}</td>
            <td>
              <p class="font-weight-medium mb-0 lh-22 text-color1">
                <VChip :color="ip.status == 1 ? 'success' : 'error'" class="font-weight-medium" size="small">
                  {{ ip.status == 1 ? 'Active' : 'In-active' }}
                </VChip>
              </p>
            </td>
            <td>{{ ip.created_at }}</td>
            <td v-if="permissionStore.hasPermission('ip_address.update')">
              <VBtn icon variant="text" color="secondary" class="px-0" @click="edit(ip)">
                <VIcon icon="tabler-edit" />
              </VBtn>
            </td>
          </tr>

        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>
