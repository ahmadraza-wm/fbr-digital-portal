<script setup>
import { usePartnerLedger } from "@/composables/usePartnerLedger";
import { usePartners } from "@/composables/usePartners";
import { computed, onMounted, ref } from "vue";
const countryCurrencyStore = useCountryCurrencyStore();
const { currencies } = storeToRefs(countryCurrencyStore);

const requiredValidator = (v) => !!v || "This field is required";
const types = ref([
  { label: 'Deposit', value: 'credit' },
  { label: 'Refund/Deduct', value: 'debit' }
]);
definePageMeta({
  middleware: "auth",
  permission: "partner.ledger.manual.entry"
})

const {
  form,
  savePartnerLedger
} = usePartnerLedger();


const {
  partners,
  fetchPartners,
} = usePartners();


const getPartners = computed(() => {
  return partners.value
    .map(partner => ({
      title: partner.name,
      value: partner.id
    }));

});






const loading = ref(false);

const showTransferCode = computed(() => form.type === 'debit');

const submitForm = () => {
  savePartnerLedger(form)
};

const resetForm = () => {
  form.posting_date = null;
  form.type = null;
};



onMounted(async () => {
  await fetchPartners();

});


</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex justify-space-between align-center"
          style="background-color: lightgrey;">
          <div class="d-flex align-center">
            <BackNavigation />
            <h4 class="text-h5 py-3">Posting in Partner Ledger</h4>
          </div>
        </v-card-title>
        <v-card-text class="px-4 pt-4">
          <VForm @submit.prevent="submitForm">
            <VRow>
              <VCol cols="12" md="6">
                <span class="fs-15 label-color font-weight-medium">Deposit Type<span class="text-red">*</span></span>
                <AppAutocomplete :items="types" v-model="form.type" item-title="label" item-value="value"
                  placeholder="Deposit type" :rules="[requiredValidator]" />
              </VCol>
              <VCol cols="12" md="6">
                <span class="fs-15 label-color font-weight-medium">Partner<span class="text-red">*</span></span>
                <AppAutocomplete :items="getPartners" item-title="title" item-value="value" v-model="form.partner_id"
                  placeholder="Select partner" :rules="[requiredValidator]" />
              </VCol>
              <VCol v-if="showTransferCode" cols="12" md="6">
                <span class="fs-15 label-color font-weight-medium">Transfer Code</span>
                <AppTextField name="transfercode" type="text" v-model="form.transaction_code"
                  placeholder="Transfer code" />
              </VCol>
              <v-col cols="12" md="6">
                <span class="fs-15 label-color font-weight-medium">Currency<span class="text-red">*</span></span>
                <AppAutocomplete :items="currencies" :item-title="(item) => {
                  const n = item?.code ?? '';
                  const m = item?.name ?? '';
                  return n && m ? `${n} - ${m}` : n || m;
                }" item-value="id" v-model="form.currency_id" placeholder="Select currency"
                  :rules="[requiredValidator]">
                  <template #item="{ item, props, selected }">
                    <div v-bind="props" class="px-3 py-1 mb-2" :class="selected ? 'bg-primary text-white' : 'text-body'"
                      style="border-radius: 4px;">
                      {{ item?.code || item?.raw?.code }} - <b class="bg-primary px-1 py-1 rounded">{{ item?.name ||
                        item?.raw?.name }}</b>
                    </div>
                  </template>

                  <template #selection="{ item }">
                    <span v-if="item">
                      {{ item?.code || item?.raw?.code }} - <b class="text-primary">{{ item?.name || item?.raw?.name
                        }}</b>
                    </span>
                    <span v-else>Select currency</span>
                  </template>
                </AppAutocomplete>
              </v-col>
              <VCol cols="12" md="6">
                <span class="fs-15 label-color font-weight-medium">TT Amount<span class="text-red">*</span></span>
                <AppTextField name="ttamount" type="number" v-model="form.fc_amount" placeholder="TT amount"
                  :rules="[requiredValidator]" />
              </VCol>
              <VCol cols="12" md="6">
                <span class="fs-15 label-color font-weight-medium">Rate<span class="text-red">*</span></span>
                <AppTextField name="rate" type="number" v-model="form.rate" placeholder="rate"
                  :rules="[requiredValidator]" />
              </VCol>
              <VCol cols="12" md="6">
                <span class="fs-15 label-color font-weight-medium">Posting Date<span class="text-red">*</span></span>
                <AppDateTimePicker name="postdate" v-model="form.posting_date" :rules="[requiredValidator]"
                  placeholder="dd/mm/yyyy" :config="{ dateFormat: 'd-m-Y' }" />
              </VCol>
              <v-col cols="12">
                <span class="fs-15 label-color font-weight-medium">Description<span class="text-red">*</span></span>
                <AppTextarea rows="4" name="description" v-model="form.description" class="cursor-pointer"
                  placeholder="Type here" :rules="[requiredValidator]" />
              </v-col>
              <VCol cols="12" class="d-flex justify-end gap-4">
                <VBtn type="reset" color="secondary" variant="tonal" @click="resetForm"> Reset </VBtn>
                <VBtn type="submit" variant="tonal" class="login-btn" :loading="loading">
                  Add Entry
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>
