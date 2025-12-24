<script setup>
import { ref, watch } from 'vue';
const addReciver = ref(false);
import { useReciver } from '@/composables/agentPortal/useReciver';
const { createReciver, selectReciver, form, occupationsOptions, fetchRecivers, fetchReciverById, ReciversData, fetchOccupationsList, genderOptions, loading, relationships } = useReciver();
const formRef = ref('');

const props = defineProps({
  senderCustomerId: {
    type: [Number, String],
    default: null,
  },
  recivingCountryId: {
    type: [Number, String],
    default: null,
  },
  recivingCountryName: {
    type: String,
    default: '',
  },
  isAddReciver: {
    type: Boolean,
    default: false
  },
    resetKey: Number,
})

watch(
  () => props.resetKey,
  async () => {
    // Clear the selected receiver immediately
    selectReciver.value = {}
    ReciversData.value = []
    
    // Reset form data
    form.value = {
      first_name: "",
      gender: "",
      relation: "",
      email: "",
      phone_number: "",
      address: "",
      city: "",
      postal_code: "",
      occupation: "",
      country_id: null
    }
    
    // Reset other fields
    addReciver.value = false
    occupationSelect.value = ''
    otherOcupation.value = ''
    
    // Wait for next tick before resetting form validation
    await nextTick()
    formRef.value?.reset()
    formRef.value?.resetValidation()
  }
)



const occupationSelect = ref('');
const otherOcupation = ref('');

const submitForm = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  if (form.value.occupation === 'Other (Specify)') {
    form.value.occupation = `${form.value.occupation}-${otherOcupation.value}`;
  }
  form.value.country_id = props.recivingCountryId;
  await createReciver(props.senderCustomerId, form.value);
  await fetchRecivers(props.senderCustomerId, {
    country_id: props.recivingCountryId,
  })
  formRef.value?.reset()
  formRef.value?.resetValidation()
  occupationSelect.value = ''
  addReciver.value = false;
}

watch(
  () => addReciver.value,
  async (newVal) => {
    if (newVal === true) {
      await fetchRecivers(props.senderCustomerId, {
        country_id: props.recivingCountryId,
      })
    }
  }
)


watch(
  () => occupationSelect.value,
  (newVal) => {
    form.value.occupation = newVal;
  },
  { immediate: true }
);

const headers = [
  { title: "#", key: "sr" },
  { title: "Beneficiary Name", key: "name" },
  { title: "Action", key: "action" },
];

onMounted(async () => {
  await fetchOccupationsList();
  //  await fetchRecivers(props.senderCustomerId,props.recivingCountryId)
});

const selectReciever = async (id) => {
  await fetchReciverById(id);
}

const emit = defineEmits(['ReciverSelected']);

watch(
  () => selectReciver.value,
  (reciver) => {
    if (reciver) {
      emit('ReciverSelected', reciver);
    }
  },
  { deep: true }
);

</script>
<template>
  <v-col cols="12" md="6">
    <v-card>
      <v-row>
        <v-col cols="12">
          <v-card-title class="border-b-sm d-flex align-center justify-space-between"
            style="background-color: lightgrey;">
            <h4 class="text-h5 py-3">Receiver Details</h4>
            <VBtn @click="addReciver = true" :disabled="!isAddReciver">Add Receiver</VBtn>
          </v-card-title>
          <VTable class="border">
            <tbody>
              <tr>
                <th class="bg-grey">Full Name</th>
                <td class="text-center font-weight-bold">{{ selectReciver?.name || '-----' }}</td>
              </tr>
              <tr>
                <th class="bg-grey">Address</th>
                <td class="text-center font-weight-bold">{{ selectReciver?.address || '-----' }}</td>
              </tr>
              <tr>
                <th class="bg-grey">Mobile No.</th>
                <td class="text-center font-weight-bold">{{ selectReciver?.phone_number || '-----' }}</td>
              </tr>
              <tr>
                <th class="bg-grey">Postal Code</th>
                <td class="text-center font-weight-bold">{{ selectReciver?.postal_code || '-----' }}</td>
              </tr>
              <tr>
                <th class="bg-grey">City</th>
                <td class="text-center font-weight-bold">{{ selectReciver?.city || '-----' }}</td>
              </tr>
              <tr>
                <th class="bg-grey">Beneficiary Message</th>
                <td class="text-center font-weight-bold">{{ '-----' }}</td>
              </tr>
              <tr>
                <th class="bg-grey">Relationship</th>
                <td class="text-center font-weight-bold">{{ selectReciver?.relation || '-----' }}</td>
              </tr>
              <tr>
                <th class="bg-grey">Country</th>
                <td class="text-center font-weight-bold">{{ selectReciver?.country || props.recivingCountryName ||
                  '-----'}}</td>
              </tr>
            </tbody>
          </VTable>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
  <div class="text-center">
    <!-- Dialog -->
    <v-dialog v-model="addReciver" max-width="1000" transition="scale-transition">
      <v-card>
        <v-row>
          <v-col cols="12">
            <v-card-title class="d-flex align-center justify-space-between" style="background-color: lightgray;">
              <h4 class="text-h4 py-3">Add New Receiver</h4>
              <IconBtn @click="addReciver = false">
                <VIcon icon="tabler-x" />
              </IconBtn>
            </v-card-title>
          </v-col>
        </v-row>
        <V-card-text>
          <VForm @submit.prevent="submitForm" ref="formRef">
            <VRow>
              <!-- Name -->
              <VCol cols="12" md="6">
                <span class="fs-13 label-color">Name<span class="text-red">*</span></span>
                <AppTextField placeholder="Name" v-model="form.first_name" :rules="[requiredValidator]" />
              </VCol>

              <!-- Gender -->
              <VCol cols="12" md="6">
                <span class="fs-13 label-color">Gender<span class="text-red">*</span></span>
                <AppAutocomplete :items="genderOptions" item-title="text" item-value="value" v-model="form.gender"
                  placeholder="Gender" :rules="[requiredValidator]" />
              </VCol>

              <!-- Phone Number -->
              <VCol cols="12" md="6">
                <span class="fs-13 label-color">Phone<span class="text-red">*</span></span>
                <AppTextField placeholder="Phone number" v-model="form.phone_number" :rules="[requiredValidator]" />
              </VCol>

              <!-- Email -->
              <VCol cols="12" md="6">
                <span class="fs-13 label-color">Email</span>
                <AppTextField type="email" placeholder="Email" v-model="form.email" :rules="[emailValidator]" />
              </VCol>

              <!-- Relations -->
              <VCol cols="12" md="6">
                <span class="fs-13 label-color">Relationship<span class="text-red">*</span></span>
                <AppAutocomplete :items="relationships" item-title="name" item-value="name" v-model="form.relation"
                  placeholder="Gender" :rules="[requiredValidator]" />
              </VCol>

              <!-- Address -->
              <VCol cols="12" md="6">
                <span class="fs-13 label-color">Address</span>
                <AppTextField placeholder="House # / Office" v-model="form.address" />
              </VCol>

              <!-- City -->
              <VCol cols="12" md="6">
                <span class="fs-13 label-color">City</span>
                <AppTextField placeholder="City" v-model="form.city" />
              </VCol>

              <!-- Postal Code -->
              <VCol cols="12" md="6">
                <span class="fs-13 label-color">Postal Code</span>
                <AppTextField placeholder="Postal code" v-model="form.postal_code" />
              </VCol>

              <!-- Occupation -->
              <VCol cols="12" md="6">
                <span class="fs-13 label-color">Occupation</span>
                <AppAutocomplete :items="occupationsOptions" item-title="name" item-value="name"
                  placeholder="Select occupation" v-model="occupationSelect" />
              </VCol>
              <VCol cols="12" md="6" v-if="occupationSelect === 'Other (Specify)'">
                <span class="fs-13 label-color">Other (Specify) Occupation<span class="text-red">*</span></span>
                <AppTextarea rows="1" placeholder="Type here" v-model="otherOcupation"
                  :rules="form.occupation === 'Other (Specify)' ? [requiredValidator] : []" />
              </VCol>

              <!-- Buttons -->
              <VCol cols="12" class="d-flex gap-4 justify-end">
                <VBtn type="reset" color="secondary" variant="tonal">Reset</VBtn>
                <VBtn type="submit" variant="tonal" class="login-btn" :loading="loading">
                  Add & Use Receiver
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </V-card-text>
        <v-card-text class="px-0 pb-0">
          <v-data-table :headers="headers" :items="ReciversData" item-key="name" hide-default-footer
            class="border-t-sm border-b-sm">
            <template #item.sr="{ index }">
              {{ index + 1 }}
            </template>
            <template #item.action="{ item }">
              <VBtn type="submit" variant="elevated" color="warning" @click="selectReciever(item.id)">
                Select
              </VBtn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
