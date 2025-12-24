<script setup>
import { ref, onMounted } from 'vue'
import { useRemarks } from '@/composables/useRemarks'
definePageMeta({
  middleware: "auth",
  permission: "remarks.index"
})
const permissionStore = usePermissionStore()
const popup = ref(false)
const selectedId = ref(null)

const requiredValidator = (v) => !!v || "This field is required";


const {
  remarks,
  formData,
  editId,
  formRef,
  fetchRemarks,
  isEditing,
  handleSubmit,
  deleteRemark,
  resetForm,
  loading,
} = useRemarks()

onMounted(() => {
  fetchRemarks()
})

const edit = (remark) => {
  formData.value = { ...remark };
  isEditing.value = true;
  editId.value = remark.id;
}

const confirmDelete = (id) => {
  selectedId.value = id
  popup.value = true
}

const confirmDeletion = async () => {
  await deleteRemark(selectedId.value)
  popup.value = false
}

const submitForm = async () => {

  await handleSubmit()
}



</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex align-center" style="background-color: lightgrey;">
          <BackNavigation />
          <h4 class="text-h5 py-4">Remarks</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="px-0 pt-0" v-if="permissionStore.hasPermission('remarks.store') || isEditing">
      <v-row>
        <v-col cols="12">
          <v-card-text class="px-4 py-0">
            <VForm ref="formRef" @submit.prevent="submitForm">
              <VRow>
                <VCol cols="12">
                  <span class="fs-13 label-color">Name<span class="text-red">*</span></span>
                  <AppTextField type="text" name="name" placeholder="Name" :rules="[requiredValidator]"
                    v-model="formData.name" autocomplete="off" />
                </VCol>
                <VCol cols="12">
                  <span class="fs-15 label-color font-weight-medium">Remarks<span class="text-red">*</span></span>
                  <AppTextarea rows="5" name="description" v-model="formData.remark" class="cursor-pointer"
                    placeholder="Type here" :rules="[requiredValidator]" />
                </VCol>
                <VCol cols="12" class="d-flex gap-4 justify-end">
                  <VBtn type="reset" color="secondary" variant="tonal" @click="resetForm">Reset</VBtn>
                  <VBtn type="submit" variant="tonal" class="login-btn" :loading="loading">
                    {{ isEditing ? 'Update Remarks' : 'Save Remarks' }}
                  </VBtn>
                </VCol>
              </VRow>
            </VForm>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="py-0 px-0">
      <v-table class="text-no-wrap border-t-sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Remarks</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(remark, index) in remarks" :key="remark.id">
            <td>{{ index + 1 }}</td>
            <td>{{ remark.name }}</td>
            <td>{{ remark.remark }}</td>
            <td>
              <VBtn icon variant="text" color="secondary" @click="edit(remark)" v-if="permissionStore.hasPermission('remarks.update')">
                <VIcon icon="tabler-edit" />
              </VBtn>
              <VBtn icon color="error" variant="text" @click="confirmDelete(remark.id)" v-if="permissionStore.hasPermission('remarks.destroy')">
                <VIcon icon="tabler-trash" />
              </VBtn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>

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
                <span class="fs-16 text-error">Are you sure you want to delete these remarks?</span>
              </VCol>
            </VRow>
          </VCardText>
          <v-card-actions class="border-t-sm pt-3">
            <v-row>
              <v-col cols="12" class="d-flex justify-end">
                <v-btn color="secondary" variant="tonal" @click="popup = false">
                  Discard
                </v-btn>
                <v-btn color="error" variant="elevated" @click="confirmDeletion" >
                  Delete
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </VForm>
      </v-card>
    </v-dialog>
  </div>
</template>
