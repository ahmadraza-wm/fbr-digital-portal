<script setup>
definePageMeta({
  middleware: "auth",
  permission: "banners.list"
})
import ItemsPerPageSelector from "@/components/ItemsPerPageSelector.vue";
import { useMobileBanner } from '@/composables/useMobileBanner';
import { onMounted, ref } from "vue";
const permissionStore = usePermissionStore()

const { fetchMobileBanner, saveMobileBanner, bannerList, confirmDeleteBanner, pagination } = useMobileBanner();
const { pageNo, itemsPerPage, updateItemsPerPage, loadPage } = usePagination(
  fetchMobileBanner,
  {
    initialPage: 1,
    initialPerPage: 10,
  }
);

const addBanner = ref(false);
const banner = ref([]);
const title = ref('')
const description = ref('')
const file = ref([])
const formKey = ref(null);
const isEditMode = ref(false);
const currentBannerId = ref(null);
const previewImage = ref(null);
const formRef = ref(null)


const status = ref('all');
const statusItem = ([
  { title: "Active", value: 1 },
  { title: "Inactive", value: 0 }
])
const search = reactive({
  status: ''
})
const form = reactive({
  title: '',
  description: '',
  file: null,
});

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.file = null
}
const openAddModal = () => {
  isEditMode.value = false
  currentBannerId.value = null
  previewImage.value = null

  resetForm()
  addBanner.value = true
}
const closeModal = () => {
  addBanner.value = false
  resetForm();
  previewImage.value = null

}
const editBanner = (item) => {
  isEditMode.value = true
  addBanner.value = true
  currentBannerId.value = item.id

  form.title = item.title
  form.description = item.description
  form.status = item.status
  previewImage.value = item.image
}
const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  try {
    let res
    if (isEditMode.value && currentBannerId.value) {
      res = await saveMobileBanner(form, currentBannerId.value)
    } else {
      res = await saveMobileBanner(form)
    }

    if (res?.success) {
      closeModal()
      fetchMobileBanner(search)
    }
  } catch (error) {
    console.error(error.response?.data?.message || 'Something went wrong!')
  }
}
const headers = computed(() => {
  const baseHeaders = [
    { title: "id", key: "sr_no" },
    { title: "Title", key: "title" },
    { title: "Description", key: "description" },
    { title: "Status", key: "status" },
    { title: "Created At", key: "created_at" },
  ];

  if (permissionStore.hasPermission('banners.show')) {
    baseHeaders.push({ title: "Attachment", key: "attachment" });
  }

  if (permissionStore.hasPermission("banners.update") || permissionStore.hasPermission("banners.destroy")) {
    baseHeaders.push({ title: "Action", key: "action" });
  }

  return baseHeaders;
});

onMounted(async () => {
    loadPage(); 
});


const filterbanners = () => {
  fetchMobileBanner(search)
}

const resetFilters = () => {
  search.status = '';
  fetchMobileBanner();
};

</script>
<template>
  <v-card>

    <v-card-title class="border-b-sm">
      <h4 class="text-h5 py-3">Search Banners</h4>
    </v-card-title>
    <v-card-text class="pt-1 border-b-sm my-4 mb-0 pb-5">
      <v-row class="ps-0">

        <v-col cols="12" sm="6" md="4">
          <span class="fs-15 label-color font-weight-medium">Status</span>
          <AppAutocomplete :items="statusItem" placeholder="All" v-model="search.status" />
        </v-col>
        <v-col cols="12 d-flex gap-2 align-end justify-start" sm="6" md="4">
          <VBtn @click="filterbanners" type="submit" class="login-btn" variant="tonal">
            search
          </VBtn>
          <VBtn @click="resetFilters" type="reset" color="secondary" variant="tonal">
            Reset
          </VBtn>
        </v-col>
      </v-row>
    </v-card-text>
    <VCardText class="flex-wrap gap-4 d-flex justify-space-between align-center pb-2">
      <div class="me-3 d-flex gap-3 pt-6">
        <ItemsPerPageSelector v-model="itemsPerPage" @update:model-value="updateItemsPerPage" />

      </div>
      <div class="gap-3 pt-3" v-if="permissionStore.hasPermission('banners.store')">
        <VBtn variant="elevated" color="primary" @click="openAddModal" prepend-icon="tabler-plus">
          Add Banner
        </VBtn>
      </div>
    </VCardText>

    <VCardText class="px-0 border-t-sm">
      <VDatableComponent :headers="headers" :items="bannerList" :loading="loading" :pagination="pagination"
         :pageNo="pageNo"
        @update:pageNo="pageNo = $event">
        <!-- Custom image column -->
        <template #item.attachment="{ item }">
          <div class="d-flex gap-1">
            <VBtn icon variant="text" :href="item.image" target="_blank" color="medium-emphasis" v-if="permissionStore.hasPermission('banners.show')">
              <VIcon icon="tabler-eye" />
            </VBtn>

          </div>

        </template>

        <template #item.status="{ item }">
          <div style="display: flex; align-items: center">
            <VChip
              :style="{
                backgroundColor: item.status === 'Active' ? '#28C76F29' : '#FE5F574F',
                color: item.status === 'Active' ? '#28C76F' : '#FE5F57',
                marginTop: '2px'
              }"
              class="font-weight-light fs-12 p-1"
              size="small"
            >
              {{ item.status === 'Active' ? 'Active' : 'Inactive' }}
            </VChip>
          </div>
        </template>


        <template #item.action="{ item }">
          <div class="d-flex gap-1">
            <VBtn icon variant="text" color="medium-emphasis" @click="editBanner(item)" v-if="permissionStore.hasPermission('banners.update')">
              <VIcon icon="tabler-edit" />
            </VBtn>
            <VBtn icon variant="text" color="medium-emphasis" @click="confirmDeleteBanner(item.id)" v-if="permissionStore.hasPermission('banners.destroy')">
              <VIcon icon="tabler-trash" />
            </VBtn>
          </div>
        </template>
      </VDatableComponent>

    </VCardText>
  </v-card>
  <v-dialog v-model="addBanner" max-width="600" transition="scale-transition">
    <v-card>
      <VCardTitle class="bg-grey d-flex align-center justify-space-between">
        <h4 class="text-h4 py-2">{{ isEditMode ? 'Edit Banner' : 'Add Banner' }}</h4>
        <IconBtn @click="addBanner = false">
          <VIcon icon="tabler-x" />
        </IconBtn>
      </VCardTitle>
      <v-card-text>
        <VForm ref="formRef" @submit.prevent="handleSubmit" :key="formKey">
          <v-col cols="12" sm="12" md="12">
            <span class="fs-15 label-color font-weight-medium">Title<span class="text-red">*</span></span>
            <AppTextField name="title" v-model="form.title" placeholder="Title" :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <span class="fs-15 label-color font-weight-medium">Description<span class="text-red">*</span></span>
            <AppTextField name="description" v-model="form.description" placeholder="Description"
              :rules="[requiredValidator]" />
          </v-col>
             <v-col cols="12" sm="12" md="12">
            <span class="fs-15 label-color font-weight-medium">Status<span class="text-red">*</span></span>
               <AppAutocomplete :items="statusItem" placeholder="All" v-model="form.status" />
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <span class="fs-15 label-color font-weight-medium">Attachment<span class="text-red">*</span></span>
            <VFileInput chips accept="image/*" v-model="form.file" label="Choose Banner Image"
              :rules="isEditMode ? [] : [requiredValidator]" />
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <div v-if="previewImage" class="mt-3 text-center">
              <p class="text-caption mt-1 grey--text">(Current image preview)</p>

              <img :src="previewImage" alt="Preview" class="rounded"
                style="max-width: 150px; height: auto; border: 1px solid #ddd;" />
            </div>
          </v-col>
          <v-col cols="12" sm="12" md="12" class="text-end gap-2">
            <VBtn type="submit" class="login-btn me-3" variant="tonal">{{isEditMode ? "Update Banner": "Add Banner"}}</VBtn>
            <VBtn @click="closeModal" type="reset" color="secondary" variant="tonal">
              Close
            </VBtn>
          </v-col>

        </VForm>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
