<script setup>
import BackNavigation from "@/@core/components/BackNavigation.vue";
import { useBeneficiary } from "@/composables/useBeneficiary";
import data from "@/views/demos/forms/tables/data-table/datatable";
import { useRoute } from "vue-router";
definePageMeta({
  middleware: "auth",
  permission: "beneficiary.bank.create"
})
const {
  fetchCustomerById,
  documents,
  fetchCustomerDocuments,
  bankList,
  createBeneficiaryBank,
} = useBeneficiary();
const route = useRoute();

const userList = ref([]);
const customer = ref({});
const customer_id = route.params.id;

const formData = ref({
  bank_id: null,
  branch_name: "",
  sort_code: "",
  branch_code: "",
  account_number: "",
  iban: "",
});

const formRef = ref(null)

const options = ref({
  page: 1,
  itemsPerPage: 3,
  sortBy: [""],
  sortDesc: [false],
});

onMounted(async () => {
  const id = route.params.id;
  customer.value = await fetchCustomerById(id);
  fetchCustomerDocuments(id);
  userList.value = JSON.parse(JSON.stringify(data));
});

const onSubmit = async () => {

  const { valid } = await formRef.value.validate();

  if (!valid) {
    return;
  }

  const response = await createBeneficiaryBank(customer_id, formData.value);

  formData.value = {
    bank_id: null,
    branch_name: "",
    sort_code: "",
    branch_code: "",
    account_number: "",
    iban: "",
  };
};
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex align-center" style="background-color: lightgrey;">
          <BackNavigation />
          <h4 class="text-h5 py-4">Add Beneficiary Bank</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="px-0 pt-0">
      <v-row class="border-b-md px-5">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Beneficiary ID</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.id || "---" }}
          </p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Phone</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.phone_number || "---" }}
          </p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Name</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.name || "---" }}
          </p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Address</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.address || "---" }}
          </p>
        </v-col>
      </v-row>
      <v-row class="border-b-md px-5 py-3">
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Gender</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.gender || "---" }}
          </p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Country</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.country || "---" }}
          </p>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">DOB</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            {{ customer?.dob || "---" }}
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card-text class="px-4 py-0">
            <VForm @submit.prevent="onSubmit" ref="formRef">
              <VRow>
                <VCol cols="12" md="6">
                  <span class="fs-13 label-color">Bank Name<span class="text-red">*</span></span>
                  <AppAutocomplete v-model="formData.bank_id" :items="bankList" item-title="name" item-value="id"
                    placeholder="Select Bank" :rules="[(v) => !!v || 'Bank is required']" />
                </VCol>

                <VCol cols="12" md="6">
                  <span class="fs-13 label-color">Branch Name</span>
                  <AppTextField v-model="formData.branch_name" placeholder="Branch Name" />
                </VCol>

                <VCol cols="12" md="6">
                  <span class="fs-13 label-color">Sort Code</span>
                  <AppTextField v-model="formData.sort_code" placeholder="Sort Code" type="number" />
                </VCol>

                <VCol cols="12" md="6">
                  <span class="fs-13 label-color">Branch Code</span>
                  <AppTextField v-model="formData.branch_code" placeholder="Branch Code" />
                </VCol>

                <VCol cols="12" md="6">
                  <span class="fs-13 label-color">Account Number</span>
                  <AppTextField v-model="formData.account_number" placeholder="Account Number" type="number" />
                </VCol>

                <VCol cols="12" md="6">
                  <span class="fs-13 label-color">IBAN</span>
                  <AppTextField v-model="formData.iban" placeholder="IBAN" />
                </VCol>

                <VCol cols="12" class="d-flex justify-end gap-4 mt-4">
                  <VBtn type="reset" variant="tonal" color="secondary" @click="formData = {}">reset</VBtn>
                  <VBtn type="submit" variant="tonal" class="login-btn">Add Bank</VBtn>
                </VCol>
              </VRow>
            </VForm>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
