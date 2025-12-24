<script setup>
import { computed, reactive, ref, watch } from "vue";
import { useAgentDeposit } from "@/composables/agentPortal/useDeposits";

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({}),
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["submit"]);

const requiredValidator = (v) => !!v || "This field is required";

const depositType = ref([
  { title: "Cash", value: "cash" },
  { title: "Cheque", value: "cheque" },
  { title: "Debit Card (ST)", value: "debit_card" },
  { title: "Via Chip/Pin (ST)", value: "via_chip_pin" },
  { title: "Via Phone (WP)", value: "via_phone" },
]);

const form = reactive({
  bank: '',
  deposit_amount: '',
  deposit_type: '',
  deposit_notes: '',
  file: null,
});

const resetFormState = {
  bank: '',
  deposit_amount: '',
  deposit_type: '',
  deposit_notes: '',
  file: null,
};

// Initialize form when initialData changes
const existingFile = ref(null);

watch(() => props.initialData, (newVal) => {
  if (newVal) {
    Object.assign(form, {
      ...resetFormState,
      ...newVal,
      file: null 
    });
    
    if (newVal.media && newVal.media.length > 0) {
      existingFile.value = newVal.media[0];
    } else {
        existingFile.value = null;
    }
  }
}, { immediate: true, deep: true });

function handleReset() {
  Object.assign(form, resetFormState);
  if (props.isEdit && props.initialData) {
     // Optional reset logic
  }
}

const formRef = ref(null);

const submitForm = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  emit("submit", { ...form });
};
</script>

<template>
  <VForm @submit.prevent="submitForm" ref="formRef">
    <VRow>
      <v-col cols="12" md="6">
        <span class="fs-15 label-color font-weight-medium">Deposit Amount<span class="text-red">*</span></span>
        <AppTextField name="amount" type="number" v-model="form.deposit_amount" placeholder="Desposit amount"
          :rules="[requiredValidator]" autocomplete="off" />
      </v-col>
      <VCol cols="12" md="6">
        <span class="fs-15 label-color font-weight-medium">Deposit Type<span class="text-red">*</span></span>
        <AppAutocomplete :items="depositType" v-model="form.deposit_type" placeholder="Select deposit type"
          :rules="[requiredValidator]" autocomplete="off" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-15 label-color font-weight-medium">Bank</span>
        <AppAutocomplete :items="[]" v-model="form.bank" placeholder="Select bank" autocomplete="off" />
      </VCol>
      <VCol cols="12" md="6">
        <span class="fs-15 label-color font-weight-medium">Attach File <span v-if="!isEdit"
            class="text-red">*</span></span>
        <div class="d-flex flex-column gap-2">
            <VFileInput chips v-model="form.file" :rules="!isEdit ? [requiredValidator] : []" 
              :label="existingFile ? `Current: ${existingFile.original_name}` : 'Upload file'"
            />
            <div v-if="existingFile" class="d-flex align-center gap-2">
                 <span class="text-caption">Current: {{ existingFile.original_name }}</span>
                 <VBtn size="small" variant="text" :href="existingFile.url" target="_blank" color="primary">
                    View
                    <VIcon end icon="tabler-external-link" />
                 </VBtn>
            </div>
        </div>
      </VCol>
      <v-col cols="12">
        <span class="fs-15 label-color font-weight-medium">Description<span class="text-red">*</span></span>
        <AppTextarea rows="5" name="description" v-model="form.deposit_notes" class="cursor-pointer"
          placeholder="Type here" :rules="[requiredValidator]" autocomplete="off" />
      </v-col>
      <VCol cols="12" class="d-flex gap-4 justify-end">
        <VBtn type="reset" color="secondary" variant="tonal" @click="handleReset"> Reset </VBtn>
        <VBtn type="submit" variant="tonal" class="login-btn" :loading="loading">
          {{ isEdit ? 'Update Deposit' : 'Add Deposit' }}
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
