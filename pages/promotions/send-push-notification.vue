<script setup>
import { usePushNotification } from "@/composables/usePushNotification";
import { ref } from 'vue';
const countryCurrencyStore = useCountryCurrencyStore();
const { sending_countries, receiving_countries } = storeToRefs(countryCurrencyStore);
definePageMeta({
  middleware: "auth",
  permission: "send.notification"
})
const requiredValidator = (v) => !!v?.length || "This field is required"

const formKey = ref(0)
const formRef = ref(null)

const count_status = ref([
  { title: "All", value: "all" },
  { title: "Verified", value: 1 },
  { title: "Unverified", value: 0 },
])


const {
  searchDetail,
  filters,
  formdata,
  tokenCount,
  sendPushNotification,
  getTokenCount
} = usePushNotification()

const custId = ref(null)



const resetForm = () => {
  filters.value.customer_id = null
  filters.value.customer_register_from = ''
  filters.value.customer_register_to = ''
  filters.value.sending_country_id = []
  filters.value.receiving_country_id = []

  filters.value.status = "all"
  formKey.value += 1
  custId.value = null
  formRef.value?.resetValidation()
}

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()
  if (valid) {

    await getTokenCount()
  } else {
    console.warn("❌ Form has validation errors")
  }
}
</script>

<template>
  <v-card>
    <v-card-title class="border-b">
      <h4 class="text-h5 py-3">Send Push Notifications</h4>
    </v-card-title>

    <v-card-text class="px-4 pt-4">
      <VForm ref="formRef" @submit.prevent="handleSubmit" :key="formKey">
        <VRow>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Customer Id<span v-if="custId"
                class="text-red">*</span></span>

            <AppTextField name="customer_id" type="number" v-model="filters.customer_id" placeholder="Customer Id"
              @input="custId = filters.customer_id" :rules="custId ? [requiredValidator] : []" :type="number" autocomplete="off"/>
          </v-col>

          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Customer Status</span>
            <AppAutocomplete :items="count_status" v-model="filters.status" placeholder="Customer status" />
          </v-col>

          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Sending Countries<span v-if="!custId"
                class="text-red">*</span></span>

            <AppAutocomplete :items="sending_countries" v-model="filters.sending_country_id" item-title="name"
              item-value="id" placeholder="Select countries" multiple chips closable-chips
              :rules="!custId ? [requiredValidator] : []" />
          </v-col>

          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Send Money To<span v-if="!custId"
                class="text-red">*</span></span>

            <AppAutocomplete :items="receiving_countries" v-model="filters.receiving_country_id" item-title="name"
              item-value="id" placeholder="Select countries" multiple chips closable-chips
              :rules="!custId ? [requiredValidator] : []" />
          </v-col>

          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Customer Register From</span>
            <AppDateTimePicker name="customer_register_from" v-model="filters.customer_register_from"
              placeholder="dd/mm/yyyy" :config="{ dateFormat: 'd-m-Y' }" />
          </v-col>

          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Customer Register To</span>
            <AppDateTimePicker name="customer_register_to" v-model="filters.customer_register_to"
              placeholder="dd/mm/yyyy" :config="{ dateFormat: 'd-m-Y' }" />
          </v-col>

          <v-col cols="12" class="d-flex justify-end gap-4">
            <VBtn type="reset" color="secondary" variant="tonal" @click="resetForm">Reset</VBtn>
            <VBtn type="submit" variant="tonal" class="login-btn">Search</VBtn>
          </v-col>
        </VRow>
      </VForm>
    </v-card-text>
    <v-dialog v-model="searchDetail" max-width="550" persistent transition="scale-transition">
      <v-card>
        <VCardTitle class="border-b">
          <h4 class="text-h4">Attention</h4>
        </VCardTitle>
        <VForm @submit.prevent="sendPushNotification">
          <VCardText class="pt-2">
            <VRow>
              <VCol cols="12 pb-1">
                <span class="text-h4 text-error">
                  {{ tokenCount }} devices found!!!
                </span>
              </VCol>
              <VCol cols="12 pb-1">
                <span class="fs-15 label-color font-weight-medium">Title<span class="text-red">*</span></span>
                <AppTextField name="title" type="text" v-model="formdata.title" placeholder="Title"
                  :rules="[requiredValidator]" />
              </VCol>
              <VCol cols="12 pb-1">
                <span class="fs-15 label-color font-weight-medium">body<span class="text-red">*</span></span>
                <AppTextarea rows="5" name="body" v-model="formdata.body" class="cursor-pointer" placeholder="Type here"
                  :rules="[requiredValidator]" />
              </VCol>
            </VRow>
          </VCardText>
          <VCardText class="border-t pb-3">
            <VRow class="pt-3">
              <VCol class="d-flex justify-end">
                <VBtn type="reset" color="seconadry" variant="tonal" class="mr-2" @click="searchDetail = false">Discard</VBtn>
                <VBtn color="white" variant="elevated" type="submit" class="login-btn">
                  Send</VBtn>
              </VCol>
            </VRow>
          </VCardText>
        </VForm>
      </v-card>
    </v-dialog>
  </v-card>
</template>
