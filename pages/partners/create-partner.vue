<script setup>
import PartnerForm from '@/components/partners/PartnerForm.vue'
const partnerList = ref(null)
onMounted(() => {
  partnerList.value = window.history.state?.partnerList
})
definePageMeta({
  middleware: "auth",
  permission: "partners.store"
})
</script>

<template>
  <v-card>
    <v-card-title class="border-b-sm" style="background-color: lightgrey;">
      <v-row>
        <v-col class="d-flex align-center">
          <BackNavigation v-if="partnerList" />
          <h4 class="text-h5 py-3 px-2">Create Partner</h4>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="mt-4">
      <PartnerForm :isEdit="false" />
    </v-card-text>
  </v-card>

</template>
