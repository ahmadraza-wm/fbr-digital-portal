<script setup>
import { useGateway } from "@/composables/useGateway";
import useUiFeedback from "@/composables/useUiFeedback";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const {
  loading,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  confirmAction,
} = useUiFeedback();

const router = useRouter();
const route = useRoute();

const props = defineProps({ isEdit: Boolean, gatewayData: Object });

const { gatewayData, saveGateway, statuses, gatewayRequirements, isEditing } =
  useGateway();

const requiredValidator = (v) =>
  v !== null && v !== undefined && v !== "" ? true : "This field is required";

const formData = ref({
  gateway_id: "",
  sending_country_id: "",
  sending_method_id: "",
  status: 1,
});

watch(
  () => gatewayData.value,
  (newData) => {
    if (isEditing.value && newData) {
      formData.value = {
        gateway_id: newData.gateway_id,
        sending_country_id: newData.sending_country_id,
        sending_method_id: newData.sending_method_id,
        status: newData.status,
      };
    }
  },
  { deep: true, immediate: true }
);

const submitForm = () => {
  saveGateway(isEditing.value, formData.value, gatewayData.value?.id);
};
</script>

<template>
  <VForm @submit.prevent="submitForm">
    <VRow>
      <VCol cols="12" sm="6" md="6">
        <span class="fs-15 label-color">Gateway<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.gateway_id" :rules="[requiredValidator]" name="gateway"
          :items="gatewayRequirements.gateways || []" item-title="text" item-value="value" placeholder="Select Gateway"
          :disabled="isEditing" :key="formData.gateway_id" autocomplete="off"/>
      </VCol>
      <VCol cols="12" sm="6" md="6">
        <span class="fs-15 label-color">Sending Country<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.sending_country_id" :rules="[requiredValidator]" name="sendingCountry"
          :items="gatewayRequirements.sending_countries || []" item-title="text" item-value="value"
          placeholder="Select Sending Country" :disabled="isEditing" :key="formData.sending_country_id" autocomplete="off" />
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12" sm="6" md="6">
        <span class="fs-15 label-color">Sending Method<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.sending_method_id" :rules="[requiredValidator]" name="sendingMethod"
          :items="gatewayRequirements.sending_methods || []" item-title="text" item-value="value"
          placeholder="Select Sending Method" :disabled="isEditing" :key="formData.sending_method_id" autocomplete="off" />
      </VCol>
      <VCol cols="12" sm="6" md="6" v-if="isEditing">
        <span class="fs-15 label-color">Status<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.status" :rules="[requiredValidator]" name="selectedStatus" :items="statuses"
          item-title="text" item-value="value" placeholder="Select Status" :key="formData.status" autocomplete="off" />
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12" class="d-flex gap-4 justify-end">
        <VBtn type="reset" color="secondary" variant="tonal" @click="isEditing ? this.$router.back() : ''">
          {{ isEditing ? 'Cancel'  : 'Reset' }}
        </VBtn>
        <VBtn type="submit" :loading="loading" variant="tonal" color="white" class="login-btn">
          {{ isEditing ? "Update" : "Create Gateway" }}
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
