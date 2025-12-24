<script setup>
import { useRules } from "@/composables/useRules";
import useUiFeedback from "@/composables/useUiFeedback";
import { computed, onMounted, ref, watch } from "vue";


const {
  loading,
  showLoading,
  hideLoading,
  showError,
  showSuccess,
} = useUiFeedback();

const props = defineProps({ isEdit: Boolean, ruleData: Object });

const requiredValidator = (v) => !!v || "This field is required";

const {
  rules,
  headers,
  ruleData,
  fetchRules,
  fetchRuleDetails,
  saveRule,
  deleteRule,
  channels,
  types,
  validities,
  countries,
  currencies,
  agents,
  payers,
  sending_methods_tags,
  receiving_methods_tags,
} = useRules();
const formRef = ref(null)
const formData = ref({
  name: "",
  country_id: "",
  currency: "",
  channel: "",
  agent_id: "",
  sending_methods: "",
  receiving_methods: "",
  type: "",
  starting_from: "",
  expires_at: "",
  payer_id: "",
});

onMounted(() => {
  if (props.isEdit && props.ruleData) {
    Object.assign(formData.value, props.ruleData);
  }
});

watch(
  () => props.ruleData,
  (newVal) => {
    if (props.isEdit && newVal) {
      Object.assign(formData.value, newVal);
    }
  },
  { immediate: true }
);


const buttonText = computed(() =>
  props.isEdit ? "Update Rule" : "Create Rule"
);

const resetForm = () => {
  formData.value = {
    starting_from: "",
    expires_at: "",
  }
}

const submitForm = async() => {
  const { valid } = await formRef.value.validate();

  if (!valid) {
    return;
  }
  saveRule(props.isEdit, formData.value, props.ruleData?.id);
};
</script>

<template>
  <VForm @submit.prevent="submitForm" ref="formRef">
    <v-row class="ps-0">
      <v-col cols="12" sm="12" md="12">
        <span class="fs-15 label-color">Name<span class="text-red">*</span></span>
        <AppTextField v-model="formData.name" name="name" :rules="[requiredValidator]" placeholder="Online Portal" autocomplete="off" />
      </v-col>

      <VCol cols="12" sm="6" md="6">
        <span class="fs-15 label-color">Channel<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.channel" :rules="[requiredValidator]" :items="[
          { title: 'Online', value: 'online' },
          { title: 'Agent', value: 'agent' },
        ]" />
      </VCol>

      <VCol cols="12" sm="6" md="6">
        <span class="fs-15 label-color">Agents<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.agent_id" :items="agents" item-title="name" item-value="id"
          :rules="[requiredValidator]" />
      </VCol>

      <VCol cols="12" sm="6" md="6">
        <span class="fs-15 label-color">Sending Methods<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.sending_methods" :items="sending_methods_tags" placeholder="Bank Transfer"
          :rules="[requiredValidator]" />
      </VCol>

      <v-col cols="12" sm="6" md="6">
        <span class="fs-15 label-color">Receiving Methods<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.receiving_methods" :items="receiving_methods_tags" placeholder="Bank"
          :rules="[requiredValidator]" />
      </v-col>

      <v-col cols="12" sm="6" md="6">
        <span class="fs-15 label-color">Type<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.type" :rules="[requiredValidator]" :items="[
          // { title: 'Spread', value: 'spread' },
          { title: 'Admin Fee', value: 'admin_fee' },
          // { title: 'Agent Fee', value: 'agent_fee' },
        ]" />
      </v-col>

      <v-col cols="12" sm="6" md="6">
        <span class="fs-15 label-color">Zone<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.country_id" :items="countries" item-title="name" item-value="id"
          :rules="[requiredValidator]" />
      </v-col>

      <v-col cols="12" sm="6" md="6">
        <span class="fs-15 label-color">Currency<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.currency" :items="currencies" :item-title="(item) => `${item.code} - ${item.name}`" item-value="code"
          :rules="[requiredValidator]" >
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
                <span v-else>Select currency</span>
              </template>
        </AppAutocomplete>

      </v-col>

      <v-col cols="12" sm="6" md="6">
        <span class="fs-15 label-color">Payer<span class="text-red">*</span></span>
        <AppAutocomplete v-model="formData.payer_id" :items="payers" item-title="name" item-value="id"
          :rules="[requiredValidator]" />
      </v-col>

      <v-col cols="12" sm="6" md="6">
        <span class="fs-15 label-color">Starting From<span class="text-red">*</span></span>
        <AppDateTimePicker name="starting_from" v-model="formData.starting_from" placeholder="Select Date"
          :rules="[requiredValidator]" :config="{ dateFormat: 'd-m-Y' }"/>
      </v-col>

      <v-col cols="12" sm="6" md="6">
        <span class="fs-15 label-color">Expire At<span class="text-red">*</span></span>
        <AppDateTimePicker name="expire_at" v-model="formData.expires_at" placeholder="Select Date"
          :rules="[requiredValidator]" :config="{ dateFormat: 'd-m-Y' }"/>
      </v-col>

      <VCol cols="12 d-flex gap-2 align-end justify-end" sm="12" md="12">
        <VBtn type="reset" v-if="!isEdit" variant="tonal" color="secondary" @click=" resetForm"> Reset </VBtn>
        <VBtn type="submit" :loading="loading" variant="tonal" color="white" class="login-btn">
          {{ buttonText }}
        </VBtn>
      </VCol>
    </v-row>
  </VForm>
</template>
