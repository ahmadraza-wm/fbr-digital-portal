<script setup>
import { ref, nextTick } from "vue";
import ItemsPerPageSelector from "@/components/ItemsPerPageSelector.vue";


const props = defineProps({
  ledger: {
    type: Array,
    required: true,
  },
});

const editBeneficiary = ref(false);
const selectedCountry = ref("");

const country = ref([
  { title: "United States", value: "US" },
  { title: "Pakistan", value: "PAK" },
  { title: "Ireland", value: "IE" },
]);

const formData = ref({
  date: null,
});
const options = ref({
  itemsPerPage: 5,
  page: 1,
});

const datePicker = ref(null);

// Example required validator
const requiredValidator = (value) => !!value || "Date is required";

function onDialogToggle(isOpen) {
  if (isOpen) {
    nextTick(() => {
      // Re-render the flatpickr component (or any custom logic you need)
      if (datePicker.value?.flatpickr) {
        datePicker.value.flatpickr.redraw();
      }

      // OR if you're using a custom wrapper and it exposes a refresh/reinit method:
      if (datePicker.value?.refresh) {
        datePicker.value.refresh();
      }
    });
  }
}

const headers = [
  { title: "#", key: "index", sortable: false },
  { title: "Date and Pin", key: "date_pin", sortable: false },
  { title: "Bene Name (1)", key: "bene_name" },
  { title: "Bene Relation", key: "bene_relation" },
  { title: "Contact #", key: "bene_phone" },
  { title: "Sending Method", key: "sending_method" },
  { title: "Sending Purpose", key: "sending_reason" },
  { title: "Sending Amount", key: "sending_amount" },
  { title: "Receiving Amount", key: "receiving_amount" },
  { title: "Status", key: "status" },

];
</script>
<template>
  <VCard class="border">
    <v-card-title class="border-b-sm bg-grey d-flex align-center justify-space-between bg-grey">
      <h4 class="text-h5 py-3">Beneficiary Ledger</h4>
      <!-- <VBtn color="primary" variant="elevated" @click="editBeneficiary = true"
        >Edit Beneficiary</VBtn
      > -->
    </v-card-title>
    <VCardText class="px-0 pb-0">
      <PaginatedDataTable :headers="headers" :items="ledger" :options="options" :loading="false"
        @update:options="(val) => (options = val)">
        <!-- Index column -->
        <template #item.index="{ index }">
          {{ index + 1 }}
        </template>

        <!-- Date and PIN column -->
        <template #item.date_pin="{ item }">
          <span>{{ item.created_at }}</span>
          <NuxtLink :to="`/payments/detail/${item.id}`" target="_blank">
            <p :style="{
              color: item.status === 'Complete' ? '#28C76F' : '#FF9F43',
            }" class="font-weight-medium fs-12 mb-0">
              <VIcon icon="tabler-point-filled" /> {{ item.transaction_code }}
            </p>
          </NuxtLink>
        </template>

        <template #item.bene_name="{ item }">
          <span>{{ item.beneficiary_first_name }} {{ item.beneficiary_last_name }}</span>
        </template>
        <!-- Status column -->
        <template #item.status="{ item }">
          <VChip :style="{
            backgroundColor:
              item.status === 'Complete' ? '#28C76F29' : '#FF9F4329',
            color: item.status === 'Complete' ? '#28C76F' : '#FF9F43',
          }" class="font-weight-medium fs-12 p-1" size="small">
            {{ item.status }}
          </VChip>
        </template>

      </PaginatedDataTable>
    </VCardText>
  </VCard>
  <v-dialog v-model="editBeneficiary" max-width="1000" transition="scale-transition">
    <v-card>
      <v-row>
        <v-col cols="12">
          <v-card-title class="d-flex align-center justify-space-between" style="background-color: lightgray;">
            <h4 class="text-h4 py-3">Edit Beneficiary</h4>
            <IconBtn @click="editBeneficiary = false">
              <VIcon icon="tabler-x" />
            </IconBtn>
          </v-card-title>
        </v-col>
      </v-row>
      <VForm @submit.prevent="">
        <v-card-text>
          <VRow>
            <VCol cols="6">
              <span class="label-color fs-15">Receiving Method</span>
              <AppAutocomplete :items="country" name="country" placeholder="Receiving Method" />
            </VCol>
            <VCol cols="6">
              <span class="label-color fs-15">Payers</span>
              <AppAutocomplete :items="country" name="country" placeholder="Payers" />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="6">
              <span class="label-color fs-15">Transfer Code</span>
              <AppTextField name="code" placeholder="123654" />
            </VCol>
            <VCol cols="6">
              <span class="label-color fs-15">Beneficiary First Name</span>
              <AppTextField name="firstName" placeholder="First Name" />
            </VCol>
          </VRow>

          <VRow>
            <VCol cols="6">
              <span class="label-color fs-15">Beneficiary Last Name</span>
              <AppTextField name="code" placeholder="Last Name" />
            </VCol>
            <VCol cols="6">
              <span class="label-color fs-15">Beneficiary Date of Birth</span>
              <AppDateTimePicker name="dob" placeholder="mm/dd/yy" />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="6">
              <span class="label-color fs-15">Beneficiary Phone</span>
              <AppTextField name="phone" placeholder="+92 |4773445" />
            </VCol>
            <VCol cols="6">
              <span class="label-color fs-15">Beneficiary Address</span>
              <AppTextField name="address" placeholder="Address" />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="6">
              <span class="label-color fs-15">Beneficiary House No</span>
              <AppTextField name="houseNo" placeholder="Beneficiary House No" />
            </VCol>
            <VCol cols="6">
              <span class="label-color fs-15">Beneficiary Street Name</span>
              <AppTextField name="streetName" placeholder="Beneficiary Street Name" />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="6">
              <span class="label-color fs-15">Beneficiary Postal Code</span>
              <AppTextField name="houseNo" placeholder="Beneficiary Postal Code" />
            </VCol>
            <VCol cols="6">
              <span class="label-color fs-15">Beneficiary City</span>
              <AppTextField name="streetName" placeholder="Beneficiary City" />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="6">
              <span class="label-color fs-15">Beneficiary Relation</span>
              <AppTextField name="houseNo" placeholder="Beneficiary Relation" />
            </VCol>
            <VCol cols="6">
              <span class="label-color fs-15">Existing Beneficiary Banks</span>
              <AppTextField name="streetName" placeholder="Existing Beneficiary Banks" />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="6">
              <span class="label-color fs-15">Bank</span>
              <AppTextField name="houseNo" placeholder="Bank" />
            </VCol>
            <VCol cols="6">
              <span class="label-color fs-15">Branch Name</span>
              <AppTextField name="streetName" placeholder="Branch Name" />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="6">
              <span class="label-color fs-15">Branch Code</span>
              <AppTextField name="houseNo" placeholder="Branch Code" />
            </VCol>
            <VCol cols="6">
              <span class="label-color fs-15">Account #</span>
              <AppTextField name="streetName" placeholder="Account #" />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="6">
              <span class="label-color fs-15">IBAN</span>
              <AppTextField name="houseNo" placeholder="PK36SCBL0000001123456702" />
            </VCol>
            <VCol cols="12" class="d-flex gap-5 justify-end">
              <VBtn color="primary" type="submit">Update</VBtn>
              <VBtn color="sceondary" variant="tonal" @click="editBeneficiary = false">Discard</VBtn>
            </VCol>
          </VRow>
        </v-card-text>
      </VForm>
    </v-card>
  </v-dialog>
</template>
<style lang="scss">
.v-data-table__td {
  font-weight: 500 !important;
  line-height: 20px !important;
}
</style>
