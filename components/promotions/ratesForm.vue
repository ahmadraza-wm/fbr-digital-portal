<script setup>
import { useNuxtApp } from "#app";
import { useCustomerRate } from "@/composables/useCustomerRate";
import useUiFeedback from "@/composables/useUiFeedback";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const {
  submitForm,
  headers,
  statusItem,
  promotionalItem,
  rateItem,
  fetchCustomerRate,
  formData
} = useCustomerRate();

const {
  loading,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  confirmAction,
} = useUiFeedback();

const route = useRoute();
const id = route.params.id;

const { $axios } = useNuxtApp();
const countryCurrencyStore = useCountryCurrencyStore();
const { sending_countries, receiving_countries } =
  storeToRefs(countryCurrencyStore);

const props = defineProps({
  isEdit: Boolean,
});
const formRef = ref('');
const formKey = ref(0);
const promotionalType = ref("country");
const transaction = ref(null);
const from = ref(null);
const to = ref(null);
const status = ref("all");
const rate = ref(null);
const rateType = ref(null);
const expire_date = ref(null);
const no_transaction = ref(null);
const code = ref(null);
const s_country = ref(null);
const r_country = ref(null);
const min_amount = ref(null);
const max_amount = ref(null);
const customer_id = ref(null);
const customerValue = computed(() => promotionalType.value === "country");

const getRateType = (val) => {
  if (val === 2) return "increment";
  if (val === 3) return "decrement";
  return null;
};

const handleSubmit = async () => {
  const dataToSubmit = {
    promotional_type: promotionalType.value,
    customer_id:
      promotionalType.value === "customer" ? customer_id.value : undefined,
    days_since_transaction:
      promotionalType.value === "country" ? transaction.value : undefined,
    verified_status:
      promotionalType.value === "country" ? status.value : undefined,
    signup_from:
      promotionalType.value === "country" && from.value
        ? from.value
        : undefined,
    signup_to:
      promotionalType.value === "country" && to.value ? to.value : undefined,
    sending_country_id:
      promotionalType.value === "country" && s_country.value
        ? s_country.value
        : undefined,
    rate_type: getRateType(rateType.value),
    rate: rate.value,
    no_of_transactions: no_transaction.value,
    minimum_sending_amount: min_amount.value,
    maximum_sending_amount: max_amount.value,
    receiving_country_id: r_country.value,
    expiry_date: expire_date.value,
    sales_code: code.value,
  };
  // Remove undefined keys
  const cleanedData = Object.fromEntries(
    Object.entries(dataToSubmit).filter(([_, v]) => v !== undefined)
  );

  await submitForm(cleanedData, props.isEdit, id);
};

onMounted(() => {
  if (props.isEdit) {
    fetchCustomerRate(id).then(() => {
      promotionalType.value = formData.value.promotional_type.toLowerCase();
      customer_id.value = formData.value.customer_id || null;
      code.value = formData.value.code || null;
      transaction.value = formData.value.days_since_transaction || null;
      status.value = formData.value.verified_status || null;
      from.value = formData.value.signup_from || null;
      to.value = formData.value.signup_to || null;
      s_country.value = formData.value.s_country || null;
      r_country.value = formData.value.r_country || null;
      rateType.value = formData.value.rate_type;
      rate.value = formData.value.rate;
      no_transaction.value = formData.value.no_of_transactions;
      min_amount.value = formData.value.min_amount;
      max_amount.value = formData.value.max_amount;
      expire_date.value = formData.value.expire_date;
    });
  }
});

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetValidation();
  }
  if (props.isEdit) {
    rate.value = formData.value.rate;
  }
  else {
    promotionalType.value = 'country'
    customer_id.value = null
    code.value = null
    transaction.value = null
    status.value = 'all'
    from.value = null
    to.value = null
    s_country.value = null
    r_country.value = null
    rateType.value = null
    rate.value = null
    no_transaction.value = null
    min_amount.value = null
    max_amount.value = null
    expire_date.value = null
  }

}

</script>
<template>
  <v-row>
    <v-col>
      <v-card>
        <v-row>
          <v-col cols="12">
            <v-card-title class="border-b-sm" style="background-color: lightgrey;">
              <div class="d-flex align-center">
                <BackNavigation />
                <h4 class="text-h5 py-3">
                  {{ isEdit ? "Edit" : "Add" }} Customer Rates
                </h4>
              </div>
            </v-card-title>
          </v-col>
        </v-row>
        <v-card-text class="px-4 pt-4">
          <VForm @submit.prevent="handleSubmit" :key="formKey" ref="formRef">
            <VRow>
              <v-col cols="12" md="6">
                <span class="fs-15 label-color font-weight-medium">Promotional Type<span
                    class="text-red">*</span></span>
                <AppAutocomplete :items="promotionalItem" v-model="promotionalType"
                  placeholder="Select promotional type" :rules="[requiredValidator]" :disabled="isEdit" />
              </v-col>
              <v-col cols="12" md="6" v-if="!customerValue">
                <span class="fs-15 label-color font-weight-medium">Customer ID<span class="text-red">*</span></span>
                <AppTextField name="salescode" v-model="customer_id" placeholder="Customer id"
                  :rules="[requiredValidator]" :disabled="isEdit" />
              </v-col>
              <v-col cols="12" md="6">
                <span class="fs-15 label-color font-weight-medium">Sales Code</span>
                <AppTextField name="salescode" v-model="code" placeholder="Sales code" :disabled="isEdit" />
              </v-col>
              <v-col cols="12" md="6" v-if="customerValue">
                <span class="fs-15 label-color font-weight-medium">Days Since Transaction</span>
                <AppTextField name="transaction" type="number" v-model="transaction"
                  placeholder="Days since transaction" :disabled="isEdit" />
              </v-col>
              <v-col cols="12" md="6" v-if="customerValue">
                <span class="fs-15 label-color font-weight-medium">Verified Status<span class="text-red">*</span></span>
                <AppAutocomplete :items="statusItem" v-model="status" placeholder="Select status"
                  :rules="[requiredValidator]" :disabled="isEdit" />
              </v-col>
              <v-col cols="12" md="6" v-if="customerValue">
                <span class="fs-15 label-color font-weight-medium">Signup From</span>
                <AppDateTimePicker name="form" v-model="from" placeholder="dd/mm/yyyy" :config="{ dateFormat: 'd-m-Y' }"
                  :disabled="isEdit" />
              </v-col>
              <v-col cols="12" md="6" v-if="customerValue">
                <span class="fs-15 label-color font-weight-medium">Signup To</span>
                <AppDateTimePicker name="to" v-model="to" placeholder="dd/mm/yyyy" :config="{ dateFormat: 'd-m-Y' }"
                  :disabled="isEdit" />
              </v-col>
              <v-col cols="12" md="6">
                <span class="fs-15 label-color font-weight-medium">Rate Type<span class="text-red">*</span></span>
                <AppAutocomplete :items="rateItem" v-model="rateType" placeholder="Select rate type"
                  :rules="[requiredValidator]" :disabled="isEdit" />
              </v-col>
              <v-col cols="12" md="6">
                <span class="fs-15 label-color font-weight-medium">{{
                  rateType === 2
                    ? "Increment"
                    : rateType === 3
                      ? "Decrement"
                      : ""
                }}
                  Rate<span class="text-red">*</span></span>
                <AppTextField name="percentage" type="number" v-model="rate" placeholder="Rate"
                  :rules="[requiredValidator]" />
              </v-col>
              <v-col cols="12" md="6">
                <span class="fs-15 label-color font-weight-medium">No of Transactions</span>
                <AppTextField name="transactions" type="number" v-model="no_transaction"
                  placeholder="No of transactions" :disabled="isEdit" />
              </v-col>
              <v-col cols="12" md="6" v-if="customerValue">
                <span class="fs-15 label-color font-weight-medium">Sending Country<span class="text-red">*</span></span>
                <AppAutocomplete :items="sending_countries" v-model="s_country" item-title="name" item-value="id"
                  placeholder="Select sending country" :rules="[requiredValidator]" :disabled="isEdit" />
              </v-col>
              <v-col cols="12" md="6">
                <span class="fs-15 label-color font-weight-medium">Receiving Country<span
                    class="text-red">*</span></span>
                <AppAutocomplete :items="receiving_countries" v-model="r_country" item-title="name" item-value="id"
                  placeholder="Select receiving country" :rules="[requiredValidator]" :disabled="isEdit" />
              </v-col>
              <v-col cols="12" md="6">
                <span class="fs-15 label-color font-weight-medium">Minimum Sending Amount<span
                    class="text-red">*</span></span>
                <AppTextField name="min amount" type="text" v-model="min_amount" placeholder="Minimum sending amount"
                  :rules="[requiredValidator]" :disabled="isEdit" />
              </v-col>
              <v-col cols="12" md="6">
                <span class="fs-15 label-color font-weight-medium">Maximum Sending Amount<span
                    class="text-red">*</span></span>
                <AppTextField name="max amount" type="text" v-model="max_amount" placeholder="Maximum sending amount"
                  :rules="[requiredValidator]" :disabled="isEdit" />
              </v-col>
              <v-col cols="12" md="6">
                <span class="fs-15 label-color font-weight-medium">Expire Date<span class="text-red">*</span></span>
                <AppDateTimePicker name="expire" v-model="expire_date" :rules="[requiredValidator]"
                  placeholder="dd/mm/yyyy" :config="{ dateFormat: 'd-m-Y' }" :disabled="isEdit" />
              </v-col>
              <v-col cols="12" class="d-flex justify-end gap-4">
                <VBtn color="secondary" variant="tonal" @click="resetForm">
                  Reset
                </VBtn>
                <VBtn type="submit" variant="tonal" class="login-btn">
                  {{ isEdit ? "Update" : "Create" }} Customer Rate
                </VBtn>
              </v-col>
            </VRow>
          </VForm>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="3" v-if="!isEdit">
      <span class="py-3 font-weight-normal" style="font-size: 1.25rem;">Country Policy Making Cases:</span>
      <v-row class="pt-2">
        <v-col cols="6" class="d-flex align-center px-2">
          <span class="fs-16 pr-2">Avoid</span>
          <div class="bg-error py-4 w-100"></div>
        </v-col>
        <v-col cols="6" class="d-flex align-center px-2">
          <span class="fs-16 pr-2">Use</span>
          <div class="bg-success py-4 w-100"></div>
        </v-col>
      </v-row>
      <v-card class="mt-3">
        <v-card-text class="py-3">
          <span class="font-weight-bold">1.&nbsp;New Customer</span><br />
          <span class="font-weight-normal text-error">Days Since Transaction = Empty</span><br />
          <span class="font-weight-normal text-success">
            Verified Status = Unverified<br />
            Signup From = Any Date<br />
            Signup To = Any Date
          </span>
        </v-card-text>
      </v-card>
      <v-card class="mt-3">
        <v-card-text class="py-3">
          <span class="font-weight-bold">2.&nbsp;Unverified Old Customer</span><br />
          <span class="font-weight-normal text-error">Days Since Transaction = Empty</span><br />
          <span class="font-weight-normal text-success">Verified Status = Unverified</span><br />
          <span class="font-weight-normal text-error">
            Signup From = Empty<br />
            Signup To = Empty
          </span>
        </v-card-text>
      </v-card>
      <v-card class="mt-3">
        <v-card-text class="py-3">
          <span class="font-weight-bold">3.&nbsp;Verified Loyal Customer</span><br />
          <span class="font-weight-normal text-error">Days Since Transaction = Empty</span><br />
          <span class="font-weight-normal text-success">Verified Status = Verified</span><br />
          <span class="font-weight-normal text-error">
            Signup From = Empty<br />
            Signup To = Empty
          </span>
        </v-card-text>
      </v-card>
      <v-card class="mt-3">
        <v-card-text class="py-3">
          <span class="font-weight-bold">4.&nbsp;Verified Dormant Customerr</span><br />
          <span class="font-weight-normal text-success">Days Since Transaction = Any Days<br />
            Verified Status = Verified</span><br />
          <span class="font-weight-normal text-error">
            Signup From = Empty<br />
            Signup To = Empty
          </span>
        </v-card-text>
      </v-card>
      <v-card class="mt-3">
        <v-card-text class="py-3">
          <span class="font-weight-bold">5.&nbsp;Overall</span><br />
          <span class="font-weight-normal text-error">Days Since Transaction = Empty</span><br />
          <span class="font-weight-normal text-success">Verified Status = All</span><br />
          <span class="font-weight-normal text-error">
            Signup From = Empty<br />
            Signup To = Empty
          </span>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
