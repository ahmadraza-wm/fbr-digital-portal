<script setup>
import { useCountries } from "@/composables/useCountries";
import { usePartners } from "@/composables/usePartners";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
const { fetchCountries, CountriesList } = useCountries();
const props = defineProps({ isEdit: Boolean });
const formRef = ref('')
const formData = ref({
  name: "",
  prefix: '',
  integration_method: '',
  receiving_methods: [],
  country_id: null,
  partner_type: '',
  settlement_currency: '',
  status: null,
});
const route = useRoute();
const { statuses, savePartner, fetchPartnerDetailsById, loading, partnerDetail,partnerConstant,fetchPartnerConstants } = usePartners();


const setForm = () => {
  formData.value = {
    name: partnerDetail?.value?.name,
    prefix:  partnerDetail?.value?.prefix,
    integration_method:  partnerDetail?.value?.integration_method,
    receiving_methods:  partnerDetail?.value?.receiving_methods,
    country_id:  partnerDetail?.value?.country_id,
    partner_type:  partnerDetail?.value?.partner_type,
    settlement_currency:  partnerDetail?.value?.settlement_currency,
    status:  partnerDetail?.value?.status,
  };
}


const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetValidation();
  }
  if (props.isEdit) {
    setForm();
  }
  else {
    formData.value = {
      name: "",
      prefix: '',
      integration_method: '',
      receiving_methods: [],
      country_id: null,
      partner_type: '',
      settlement_currency: '',
      status: null,
    }
  }
}

onMounted(async () => {
  await fetchCountries();
  await fetchPartnerConstants();
  if (props.isEdit) {
    await fetchPartnerDetailsById(route.params.id)
    setForm();
  }
});

const submitForm = async () => {
  const { valid } = await formRef.value.validate();

  if (!valid) {
    return;
  }
  savePartner(props.isEdit, formData.value, route.params.id);
};
</script>

<template>
  <VForm ref="formRef" @submit.prevent="submitForm">
    <VRow>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Partner Name<span class="text-red">*</span></span>
        <AppTextField v-model="formData.name" placeholder="Partner Name" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Prefix<span class="text-red">*</span></span>
        <AppTextField v-model="formData.prefix" placeholder="Prefix" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Integration Method<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.integration_method" :items="partnerConstant?.integration_methods"
          placeholder="Select Integration Method" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Receiving Method<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.receiving_methods" :items="partnerConstant?.receiving_methods"
          placeholder="Select Receiving Method" :rules="[requiredValidator]" chips multiple closable-chips />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Partner Type<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.partner_type" :items="partnerConstant?.partner_types"
          placeholder="Select Type" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Country<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.country_id" :items="CountriesList" item-title="name" item-value="id"
          placeholder="Select Country" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Settlement Currency<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.settlement_currency" :rules="[requiredValidator]" :items="CountriesList"
          :item-title="(item) => {
            const n = item?.currency ?? '';
            const m = item?.name ?? '';
            return n && m ? `${n} - ${m}` : n || m;
          }" item-value="currency" placeholder="Select Currency">
          <template #item="{ item, props, selected }">
            <div v-bind="props" class="px-3 py-1 mb-2" :class="selected ? 'bg-primary text-white' : 'text-body'"
              style="border-radius: 4px;">
              {{ item?.currency || item?.raw?.currency }} - <b class="bg-primary px-1 py-1 rounded">{{ item?.name ||
                item?.raw?.name }}</b>
            </div>
          </template>

          <template #selection="{ item }">
            <span v-if="item">
              {{ item?.currency || item?.raw?.currency }} - <b class="text-primary">{{ item?.name || item?.raw?.name
                }}</b>
            </span>
            <span v-else>Select base currency</span>
          </template>
        </AppAutocomplete>
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Status<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.status" :items="statuses" item-title="text" item-value="value"
          placeholder="Select Status" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" class="d-flex gap-4 justify-end">
        <VBtn color="secondary" variant="elevated" @click="resetForm"> Reset </VBtn>
        <VBtn type="submit" variant="tonal" class="login-btn" :loading="loading">
          {{ isEdit ? "Update Partner" : "Create Partner" }}
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
