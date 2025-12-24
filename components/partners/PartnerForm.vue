<script setup>
import { usePartners } from "@/composables/usePartners";
import useUiFeedback from "@/composables/useUiFeedback";
import { onMounted, ref } from "vue";
const { loading, showLoading, hideLoading, showSuccess, showError } =
  useUiFeedback();

const countryCurrencyStore = useCountryCurrencyStore();
const { countries, currencies } = storeToRefs(countryCurrencyStore);
const props = defineProps({ isEdit: Boolean, partnerData: Object });
const {
  savePartner,
  fetchPartnerDetails,
  partnerData,
  statuses,
  partners_type,
} = usePartners();
const formRef = ref('')
const formData = ref({
  name: "",
  prefix: "",
  username: "",
  email: "",
  password: "",
  type: "",
  currency_id: "",
  country_id: "",
  status: 0,
  integration_method: ""
});


const Integrationmethods = ([
  { title: "PRUNE", value: "PRUNE" },
  { title: "NAIRAGRAM", value: "NAIRAGRAM" },
  { title: "TEST", value: "TEST" }
])

const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetValidation();
  }
  if (props.isEdit) {
    formData.value = { ...props.partnerData };
  }
  else {
    formData.value = {
      name: "",
      prefix: "",
      username: "",
      email: "",
      password: "",
      type: "",
      currency_id: "",
      country_id: "",
      status: 0,
      integration_method: ""
    }
  }
}

onMounted(() => {
  if (props.isEdit && props.partnerData) {
    formData.value = { ...props.partnerData };
  }
});

const submitForm = async() => {
   const { valid } = await formRef.value.validate();

  if (!valid) {
    return;
  }
  savePartner(props.isEdit, formData.value, props.partnerData?.id);
};
</script>

<template>
  <VForm ref="formRef" @submit.prevent="submitForm">
    <VRow>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Name<span class="text-red">*</span></span>
        <AppTextField v-model="formData.name" :rules="[requiredValidator]" placeholder="Adam" />
      </VCol>

      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Prefix</span>
        <AppTextField v-model="formData.prefix" placeholder="Prefix" />
      </VCol>

      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Username<span class="text-red">*</span></span>
        <AppTextField v-model="formData.user_name" :rules="[requiredValidator]" placeholder="Username"
          autocomplete="off" name="username_fake" />
      </VCol>

      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Email<span class="text-red">*</span></span>
        <AppTextField v-model="formData.email" :rules="[requiredValidator, emailValidator]" placeholder="Email"
          name="email_fake" autocomplete="off" :disabled="props.isEdit" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Password<span class="text-red">*</span></span>
        <AppTextField v-model="formData.password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
          name="new-password" autocomplete="new-password" :rules="[requiredValidator, passwordValidator]"
          :append-inner-icon="showPassword ? 'tabler-eye-off' : 'tabler-eye'" @click:append-inner="togglePassword"
          append-inner-icon-color="primary" />
      </VCol>

      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Integration Method</span>
        <AppAutocomplete v-model="formData.integration_method" :items="Integrationmethods"
          placeholder="Select Integration Method" />
      </VCol>

      <VCol cols="12" md="6" v-if="!isEdit">
        <span class="fs-13 label-color">Partner Type<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.type" :items="partners_type" placeholder="Select Type"
          :rules="[requiredValidator]" />
      </VCol>

      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Settlement Currency<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.currency_id" :rules="[requiredValidator]" :items="currencies" :item-title="(item) => {
          const n = item?.code ?? '';
          const m = item?.name ?? '';
          return n && m ? `${n} - ${m}` : n || m;
        }" item-value="id" placeholder="Select Currency" >
         <template #item="{ item, props, selected }">
                <div v-bind="props" class="px-3 py-1 mb-2" :class="selected ? 'bg-primary text-white' : 'text-body'"
                  style="border-radius: 4px;">
                  {{ item?.code || item?.raw?.code }} - <b class="bg-primary px-1 py-1 rounded">{{ item?.name ||
                    item?.raw?.name }}</b>
                </div>
              </template>

              <template #selection="{ item }">
                <span v-if="item">
                  {{ item?.code || item?.raw?.code }} - <b class="text-primary">{{ item?.name || item?.raw?.name }}</b>
                </span>
                <span v-else>Select base currency</span>
              </template>
      </AppAutocomplete>
      </VCol>

      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Country<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.country_id" :rules="[requiredValidator]" :items="countries" item-title="name"
          item-value="id" placeholder="Select Country" />
      </VCol>

      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Status<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.status" :items="statuses" item-title="text" item-value="value"
          placeholder="Select Status" :rules="[requiredValidator]" />
      </VCol>

      <VCol cols="12" class="d-flex gap-4 justify-end">
        <VBtn color="secondary" variant="tonal" @click="resetForm"> Reset </VBtn>
        <VBtn type="submit" variant="tonal" class="login-btn" :loading="loading">
          {{ isEdit ? "Update Partner" : "Create Partner" }}
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
