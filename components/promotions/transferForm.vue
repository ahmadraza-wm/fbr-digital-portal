<script setup>
import { useFreeFeeTransfer } from "@/composables/useFreeFeeTransfer";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
const countryCurrencyStore = useCountryCurrencyStore();
const { sending_countries, receiving_countries } =
  storeToRefs(countryCurrencyStore);
const { $axios } = useNuxtApp();

const { headers, deleteBank, createFreeFeeTransfer, bankList, fetchBanks } =
  useFreeFeeTransfer();

const route = useRoute();
const requiredValidator = (v) => !!v || "This field is required";
const props = defineProps({
  isEdit: Boolean,
});

const showTable = computed(() => props.isEdit === true || customer_id.value);
const customerValue = computed(() => !customer_id.value);
const customerData = ref(null);

const counter = ref('');
const message = ref(null);
const percentage = ref(null);
const start = ref(null);
const formRef = ref(null);
const expire = ref(null);
const s_country = ref(null);
const r_country = ref(null);
const customer_id = ref(null);

const onSubmit = async () => {

const { valid } = await formRef.value.validate();
  if (!valid) {
    return;
  }

  const formData = new FormData();

  formData.append("counter", counter.value);
  formData.append("message_for_counter", message.value);
  formData.append("percentage", percentage.value);
  formData.append("starts_at", start.value);
  formData.append("expires_at", expire.value);

  if(!customer_id.value){
    formData.append("sending_country_id", s_country.value);
    formData.append("receiving_country_id", r_country.value);
  }
 
  formData.append("customer_id", customer_id.value || "");
  formData.append("status", "active");

  const itemId = route.params?.id ?? null;


  await createFreeFeeTransfer(formData, props.isEdit, itemId);
};

const loadEditData = async () => {
  if (props.isEdit && route.params.id) {
    try {
      const response = await $axios.get(
        `/fee_free_transfers/${route.params.id}`
      );
      const promo = response.data.data;

      counter.value = promo.counter;
      message.value = promo.message_for_counter;
      percentage.value = promo.percentage;
      start.value = promo.starts_at;
      expire.value = promo.expires_at;
      s_country.value = promo.sending_country_id;
      r_country.value = promo.receiving_country_id;
      customer_id.value = promo.customer.id;
    } catch (err) {
      showError("Failed to load promotion");
    }
  }
};

onMounted(async () => {
  await loadEditData();
});

const resetForm = async () => {
  if (props.isEdit) {
    await loadEditData();
  } else {
    counter.value = null;
    message.value = null;
    percentage.value = null;
    start.value = null;
    expire.value = null;
    s_country.value = null;
    r_country.value = null;
    customer_id.value = null;
    customerData.value = null;
  }
};

watch(customer_id, async (newId) => {
  if (!newId) {
    customerData.value = null;
    return;
  }

  try {
    const response = await $axios.get(`/customer/${newId}`);
    customerData.value = response.data.data;
  } catch (error) {
    customerData.value = null;
    console.error("Failed to fetch customer", error);
  }
});
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm" style="background-color: lightgrey;">
          <div class="d-flex align-center">
            <BackNavigation />
            <h4 class="text-h5 py-3">
              {{ isEdit ? "Edit" : "Add" }} Fee Free Transfer
            </h4>
          </div>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="px-4 pt-4">
      <VForm @submit.prevent="onSubmit" ref="formRef">
        <VRow>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Customer Id
            </span>
            <AppTextField name="customer_id" type="number" v-model="customer_id" placeholder="Customer Id" autocomplete="off"/>
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Percentage<span class="text-red">*</span></span>
            <AppTextField name="percentage" type="number" v-model="percentage" placeholder="Percentage"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" md="6" v-if="customerValue">
            <span class="fs-15 label-color font-weight-medium">Sending Country<span class="text-red">*</span></span>
            <AppAutocomplete :items="sending_countries" v-model="s_country" item-title="name" item-value="id"
              placeholder="Select sending country" :rules="[requiredValidator]" :disabled="!customerValue" />
          </v-col>
          <v-col cols="12" md="6" v-if="customerValue">
            <span class="fs-15 label-color font-weight-medium">Receiving Country<span class="text-red">*</span></span>
            <AppAutocomplete :items="receiving_countries" v-model="r_country" item-title="name" item-value="id"
              placeholder="Select receiving country" :rules="[requiredValidator]" :disabled="!customerValue" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Counter<span class="text-red">*</span></span>
            <AppTextField name="counter" type="number" v-model="counter" placeholder="Counter"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Message for Customers</span>
            <AppTextField name="message" type="text" v-model="message" placeholder="Message" autocomplete="off" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Start At<span class="text-red">*</span></span>
            <AppDateTimePicker name="start" v-model="start" :rules="[requiredValidator]" placeholder="dd/mm/yyyy"
              :config="{ dateFormat: 'd-m-Y' }" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Expire At<span class="text-red">*</span></span>
            <AppDateTimePicker name="expire" v-model="expire" :rules="[requiredValidator]" placeholder="dd/mm/yyyy"
              :config="{ dateFormat: 'd-m-Y' }" />
          </v-col>
          <v-col cols="12" class="d-flex justify-end gap-4">
            <VBtn type="reset" color="secondary" variant="tonal" @click="resetForm">
              Reset
            </VBtn>
            <VBtn type="submit" variant="tonal" class="login-btn">
              {{ isEdit ? "Update" : "Create" }} Fee Free Transfer
            </VBtn>
          </v-col>
        </VRow>
      </VForm>
    </v-card-text>
    <v-card-text class="pb-0">
      <VTable v-if="showTable" class="border-t">
        <thead>
          <tr>
            <th>#</th>
            <th>Customer Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody v-if="customerData">
          <tr>
            <td>{{ customerData.id }}</td>
            <td>{{ customerData.user?.name }}</td>
            <td>{{ customerData.user?.email }}</td>
            <td>{{ customerData.phone_number }}</td>
            <td>{{ new Date().toLocaleString() }}</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="5" class="text-center">No customer data found</td>
          </tr>
        </tbody>
      </VTable>
    </v-card-text>
  </v-card>
</template>
