<script setup>
import { usePartnerCommissionExport } from "@/composables/exports/usePartnerCommissionExport";
const { exportPartnerCommission } = usePartnerCommissionExport();
import { usePartners } from "@/composables/usePartners";
const {
  partners,

} = usePartners();
definePageMeta({
  middleware: "auth",
  permission: "partner.commission.export"
})
const set_date_format = (input_date) => {
  const now = new Date(input_date);
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
};
const formKey = ref(null);
const currentDate = new Date();
const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate() + 1);
const partner_id = ref('all');

const form = reactive({
  from_date: set_date_format(previousDate),
  to_date: set_date_format(currentDate),
  partner_id: 'all',
})

const cleanFilter = computed(() => {
  return Object.fromEntries(
    Object.entries({
      ...form,
      partner_id: form.partner_id === "all" ? null : form.partner_id
    }).filter(([_, v]) => v !== null && v !== "")
  )
})
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Partner Commission Export</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="" :key="formKey">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">From<span class="text-red">*</span></span>
            <AppDateTimePicker name="from" v-model="form.from_date" placeholder="dd-mm-yyyy"
              :config="{ dateFormat: 'd-m-Y' }" :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">To<span class="text-red">*</span></span>
            <AppDateTimePicker name="to" v-model="form.to_date" placeholder="dd-mm-yyyy"
              :config="{ dateFormat: 'd-m-Y' }" :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Partner</span>
            <AppAutocomplete :items="partners" item-title="name" item-value="id" v-model="form.partner_id"
              placeholder="Select partner" />
          </v-col>
          <v-col cols="12 d-flex gap-2 pt-sm-8 justify-start" sm="6" md="3">
            <VBtn type="submit" class="login-btn" variant="tonal" @click="exportPartnerCommission(cleanFilter)">
              Export
            </VBtn>
          </v-col>
        </v-row>
      </VForm>
    </v-card-text>
  </v-card>
</template>
