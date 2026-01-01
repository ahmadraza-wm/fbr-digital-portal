<script setup>
import { useCashDestinations } from "@/composables/useCashDestinations";
import { useCountries } from "@/composables/useCountries";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
const { fetchCountries, CountriesList } = useCountries();
const props = defineProps({ isEdit: Boolean });
const formRef = ref('')
const formData = ref({
  destination_name: "",
  country_id: null,
  destination_code: "",
  city_name: "",
  address: "",
  anywhere: null,
  status: null,
});
const route = useRoute();
const { statuses, saveDestination, DestDetail, loading, fetchDestinationDetailsById, anywhereList } = useCashDestinations();

const setForm = () => {
  formData.value = {
    destination_name: DestDetail?.value?.destination_name,
    country_id: DestDetail?.value?.country.id,
    destination_code: DestDetail?.value?.destination_code,
    status: DestDetail?.value?.status,
    address: DestDetail?.value?.address,
    anywhere: DestDetail?.value?.anywhere,
    city_name: DestDetail?.value?.city_name,
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
      destination_name: "",
      country_id: null,
      destination_code: "",
      status: null,
      city_name: "",
      address: "",
      anywhere: null,
    }
  }
}

onMounted(async () => {
  if (props.isEdit) {
    await fetchDestinationDetailsById(route.params.id)
    setForm();
  }
  fetchCountries();
});

const submitForm = async () => {
  const { valid } = await formRef.value.validate();

  if (!valid) {
    return;
  }
  saveDestination(props.isEdit, formData.value, route.params.id);
};
</script>

<template>
  <VForm ref="formRef" @submit.prevent="submitForm">
    <VRow>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Destination Name<span class="text-red">*</span></span>
        <AppTextField v-model="formData.destination_name" placeholder="Destination Name" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Destination Code<span class="text-red">*</span></span>
        <AppTextField v-model="formData.destination_code" placeholder="Destination Code" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Address<span class="text-red">*</span></span>
        <AppTextField v-model="formData.address" placeholder="Address" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">City<span class="text-red">*</span></span>
        <AppTextField v-model="formData.city_name" placeholder="City" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Country<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.country_id" :items="CountriesList" item-title="name" item-value="id"
          placeholder="Select Country" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">AnyWhere<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.anywhere" :items="anywhereList" item-title="text" item-value="value"
          placeholder="Select Status" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6" v-if="isEdit">
        <span class="fs-13 label-color">Status<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.status" :items="statuses" item-title="text" item-value="value"
          placeholder="Select Status" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" class="d-flex gap-4 justify-end">
        <VBtn color="secondary" variant="elevated" @click="resetForm"> Reset </VBtn>
        <VBtn type="submit" variant="tonal" class="login-btn" :loading="loading">
          {{ isEdit ? "Update Destination" : "Create Destination" }}
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
