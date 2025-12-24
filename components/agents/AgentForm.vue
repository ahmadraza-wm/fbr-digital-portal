<script setup>
import { useAgents } from "@/composables/useAgents";
import { computed, watch } from 'vue';
const countryCurrencyStore = useCountryCurrencyStore();
const { countries, currencies, nationalities, timezones } = storeToRefs(countryCurrencyStore);
const { $axios } = useNuxtApp();
const router = useRouter();
const requiredValidator = (v) => v !== null && v !== undefined && v !== '' ? true : "This field is required";

const props = defineProps({ isEdit: Boolean });
const channel = [
  { label: 'Agent', value: 'agent' },
  { label: 'Online', value: 'online' },
]
const AgentType = [
  { label: 'Main Agent', value: 'main_agent' },
  { label: 'Sub Agent', value: 'sub_agent' },
  { label: 'Officer', value: 'officer' }
]
const gender = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' }
]
const status = [
  { label: 'Active', value: 1 },
  { label: 'In-active', value: 0 }
]
const relation_type = [
  { label: 'S/O', value: 'S/O' },
  { label: 'D/O', value: 'D/O' },
  { label: 'W/O', value: 'D/O' },
]
const allow_status = [
  { label: 'Yes', value: 1 },
  { label: 'No', value: 0 }
]
const MainAgentType = [
  { label: 'Muhammad Taha', value: 'muhammad taha' },
  { label: 'Ahmad Raza', value: 'ahmad Raza' },
  { label: 'Muhammad Usman Faiz', value: 'muhammmad usman faiz' }
]
const SubAgentType = [
  { label: 'Talha Waris', value: 'Talha Waris' },
  { label: 'Ali Raza', value: 'Ali Raza' }
]
const country = [
  { label: 'United Kingdom', value: 'united kingdom' },
  { label: 'Ireland', value: 'ireland' },
  { label: 'Canada', value: 'canada' },
]
const nationality = [
  { label: 'canadian', value: 'canadian' },
  { label: 'Irish', value: 'irish' },
  { label: 'Swiss', value: 'swiss' },
]
const timezone = [
  { label: 'UTC -3', value: 'UTC -3' },
  { label: 'UTC -2', value: 'UTC -2' },
  { label: 'UTC -1', value: 'UTC -1' },
  { label: 'UTC +0', value: 'UTC +0' },
  { label: 'UTC +1', value: 'UTC +1' },
  { label: 'UTC +2', value: 'UTC +2' },
  { label: 'UTC +3', value: 'UTC +3' }
]
const currency = [
  { label: 'Andorran Peseta', value: 'andorran peseta' },
  { label: 'Zaire Zaire', value: 'zaire zaire' },
  { label: 'Gold, Ounces', value: 'gold, ounces' },
  { label: 'Silver, Ounces', value: 'silver, ounces' },
]
const formRef = ref(null);

const {
  agents,
  agentsId,
  filterAgents,
  isEditing,
  hideLoading,
  showLoading,
  showSuccess,
  showError,
  loading,
  formData,
  fetchAgents,
} = useAgents();

const getMainAgents = computed(() => {
  return agents.value
    .filter(agent => agent.type === 'main_agent')
    .map(agent => ({
      label: agent.name,
      value: agent.id
    }));
});

const getSubAgents = computed(() => {
  return agents.value
    .filter(agent => agent.type === 'sub_agent')
    .map(agent => ({
      label: agent.name,
      value: agent.id
    }));
});


watch(() => formData.value.type, (newType) => {
  if (newType === 'main_agent') {
    formData.value.sub_agent_id = null
    formData.value.main_agent_id = null
  }
})
const submitForm = async () => {
  const { valid } = await formRef.value.validate();

  if (!valid) {
    return;
  }

  try {
    showLoading(isEditing.value ? "Updating agent..." : "Creating agent...");

    const url = isEditing.value
      ? `/agents/${agentsId.value}`
      : `/agents`;
    const method = isEditing.value ? "patch" : "post";

    const response = await $axios({ method, url, data: formData.value });

    if (response.status === 200 || response.status === 201) {
      showSuccess(
        isEditing.value
          ? "Agent updated successfully!"
          : "Agent created successfully!"
      );
      setTimeout(() => router.push("/agents/agent-list"), 1500);
    }
  } catch (error) {
    console.error("Error saving agent:", error);
    const messages = error.response?.data?.errors
      ? Object.values(error.response.data.errors).flat()
      : error.response?.data?.message || "Something went wrong";
    showError(messages);
  } finally {
    hideLoading();
  }
};
onMounted(() => {
  fetchAgents({ force_fetch: true }, false);
})
</script>
<template>
  <VForm @submit.prevent="submitForm" ref="formRef">
    <VRow>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Business Name<span class="text-red">*</span></span>
        <AppTextField placeholder="Business name" v-model="formData.business_name" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Channel<span class="text-red">*</span></span>
        <AppAutocomplete :items="channel" item-title="label" item-value="value" placeholder="Choose channel"
          v-model="formData.channel" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Type<span class="text-red">*</span></span>
        <AppAutocomplete :items="AgentType" item-title="label" item-value="value" v-model="formData.type"
          placeholder="Choose agent type " :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Main Agent</span>
        <AppAutocomplete :items="getMainAgents" item-title="label" item-value="value" placeholder="Choose main agent"
          v-model="formData.main_agent_id" :disabled="formData.type === 'main_agent'" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Sub Agent</span>
        <AppAutocomplete :items="getSubAgents" item-title="label" item-value="value" placeholder="Choose sub agent"
          v-model="formData.sub_agent_id" :disabled="formData.type === 'main_agent' || formData.type === 'sub_agent'" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Name<span class="text-red">*</span></span>
        <AppTextField placeholder="Enter name" :rules="[requiredValidator]" v-model="formData.name" />
      </VCol>
      <!-- <VCol cols="12" md="6">
        <span class="fs-13 label-color">Last Name<span class="text-red">*</span></span>
        <AppTextField placeholder="Last name" :rules="[requiredValidator]" />
      </VCol> -->
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Relation Type<span class="text-red">*</span></span>
        <AppAutocomplete :items="relation_type" item-title="label" item-value="value" placeholder="Select relation type"
          v-model="formData.relation_type" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Relation Name<span class="text-red">*</span></span>
        <AppTextField placeholder="Relation name" :rules="[requiredValidator]" v-model="formData.relation_name" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Email<span class="text-red">*</span></span>
        <AppTextField type="email" placeholder="Email" :rules="[requiredValidator, emailValidator]"
          v-model="formData.email" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Gender<span class="text-red">*</span></span>
        <AppAutocomplete :items="gender" item-title="label" item-value="value" placeholder="Gender"
          v-model="formData.gender" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">DOB<span class="text-red">*</span></span>
        <AppDateTimePicker name="DOB" v-model="formData.dob" :rules="[requiredValidator]" placeholder="dd/mm/yyyy"
          :config="{ dateFormat: 'd-m-Y', maxDate: new Date() }" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">House # / Office<span class="text-red">*</span></span>
        <AppTextField placeholder="House # / Office" :rules="[requiredValidator]"
          v-model="formData.house_office_number" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Address<span class="text-red">*</span></span>
        <AppTextField placeholder="Address" :rules="[requiredValidator]" v-model="formData.address" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">City</span>
        <AppTextField placeholder="City" v-model="formData.city" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Postal Code<span class="text-red">*</span></span>
        <AppTextField placeholder="Postal code" :rules="[requiredValidator]" v-model="formData.postal_code" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Country<span class="text-red">*</span></span>
        <AppAutocomplete :items="countries" item-title="name" item-value="id" placeholder="Select country"
          v-model="formData.country_id" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Nationality<span class="text-red">*</span></span>
        <AppAutocomplete :items="nationalities" item-title="title" item-value="id" placeholder="Select nationality"
          v-model="formData.nationality" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Phone<span class="text-red">*</span></span>
        <AppTextField placeholder="Phone number" :rules="[requiredValidator]" v-model="formData.phone" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Status<span class="text-red">*</span></span>
        <AppAutocomplete :items="status" item-title="label" item-value="value" placeholder="Select status"
          v-model="formData.status" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">MLR #<span class="text-red">*</span></span>
        <AppTextField placeholder="MLR #" v-model="formData.mlr_number" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">New Payment Allow</span>
        <AppAutocomplete :items="allow_status" item-title="label" item-value="value" placeholder="Select option"
          v-model="formData.new_payment_allow" />
      </VCol>
      <VCol cols="12" md="6" v-if="isEditing">
        <span class="fs-13 label-color">Edit Rate & Agent Fee</span>
        <AppAutocomplete :items="allow_status" item-title="label" item-value="value" placeholder="Select option"
          v-model="formData.edit_rate_allow" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Hold Payment</span>
        <AppAutocomplete :items="allow_status" item-title="label" item-value="value" placeholder="Select option"
          v-model="formData.hold_payment" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Pending All Payments</span>
        <AppAutocomplete :items="allow_status" item-title="label" item-value="value" placeholder="Select option"
          v-model="formData.pending_all_payments" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Timezone</span>
        <AppAutocomplete :items="timezones" item-title="title" item-value="id" placeholder="Select timezone"
          v-model="formData.timezone" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Agent Code/Prefix<span class="text-red">*</span></span>
        <AppTextField placeholder="Agent Code/Prefix" :rules="[requiredValidator]" v-model="formData.agent_code" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Base Currency</span>
        <AppAutocomplete v-model="formData.base_currency_id" :items="currencies" item-value="id"
          :item-title="(item) => `${item.code} - ${item.name}`" placeholder="Select base currency" dense>
          <template #item="{ item, props, selected }">
            <div v-bind="props" class="px-3 py-1 mb-2" :class="selected ? 'bg-primary text-white' : 'text-body'"
              style="border-radius: 4px;"
              >
              {{ item?.code || item?.raw?.code }} - <b class="bg-primary px-1 py-1 rounded">{{ item?.name || item?.raw?.name }}</b>
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
        <span class="fs-13 label-color">FSA Registration Number</span>
        <AppTextField placeholder="FSA registration number" v-model="formData.fsa_registration_number" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Charges include in balance</span>
        <AppAutocomplete :items="allow_status" item-title="label" item-value="value" placeholder="Select option"
          v-model="formData.charges_include_in_balance" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-13 label-color">Is Partner?<span class="text-red">*</span></span>
        <AppAutocomplete :items="allow_status" item-title="label" item-value="value" placeholder="Select option"
          v-model="formData.is_partner" :rules="[requiredValidator]" />
      </VCol>


      <VCol cols="12" class="d-flex gap-4 justify-end">
        <VBtn type="reset" color="secondary" variant="tonal"> Reset </VBtn>
        <VBtn type="submit" variant="tonal" class="login-btn" :loading="loading">
          {{ isEdit ? "Update Agent" : "Create Agent" }}
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
