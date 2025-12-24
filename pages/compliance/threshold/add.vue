<script setup>
import { useThreshold } from '@/composables/useThreshold';
import { computed, onMounted, ref } from 'vue';
definePageMeta({
  middleware: "auth",
  permission: "thresholds.store"
})
const countryCurrencyStore = useCountryCurrencyStore();
const { sending_countries, receiving_countries } = storeToRefs(countryCurrencyStore);

const name = ref('');
const sending_country_id = ref(null);
const receiving_country_ids = ref([]);
const selectedChannel = ref('');

const days = ref(null);
const limit = ref('');
const selectedCombination = ref(null);
const selectedPrimaryDocument = ref([]);
const selectedPrimaryCombination = ref(null);
const selectedSecondaryDocument = ref([]);
const selectedSecondaryCombination = ref(null);

const {
  thresholdRules,
  editIndex,
  addRule,
  editRule,
  fetchThreshold,
  documents,
  fetchDocuments,
  submitThreshold
} = useThreshold();


onMounted(() => {
  fetchDocuments();
});


// Computed lists by type
const primaryDocumentOptions = computed(() =>
  documents.value.filter((doc) => doc.type === "primary")
    .map((doc) => ({ label: doc.name, value: doc.id }))
);

const secondaryDocumentOptions = computed(() =>
  documents.value.filter((doc) => doc.type === "secondary")
    .map((doc) => ({ label: doc.name, value: doc.id }))
);

const getDocumentLabels = (ids, options) => {
  if (!Array.isArray(ids)) return '';
  return ids
    .map(id => {
      const found = options.find(opt => opt.value === id);
      return found ? found.label : id;
    })
    .join(', ');
};


const addThreshold = () => {
  if (!days.value || !limit.value || !selectedCombination.value) {
    alert('Please select Day, Limit and Combination to add a threshold.');
    return;
  }

  const rule = {
    day: days.value,
    limit: limit.value,
    combination: selectedCombination.value,
    primaryDocument: selectedPrimaryDocument.value,
    primaryCombination: selectedPrimaryCombination.value,
    secondaryDocument: selectedSecondaryDocument.value,
    secondaryCombination: selectedSecondaryCombination.value,
  };

  addRule(rule);

  // Reset form
  days.value = null;
  limit.value = '';
  selectedCombination.value = null;
  selectedPrimaryDocument.value = null;
  selectedPrimaryCombination.value = null;
  selectedSecondaryDocument.value = null;
  selectedSecondaryCombination.value = null;
};

const editRow = (item, index) => {
  days.value = item.day;
  limit.value = item.limit;
  selectedCombination.value = item.combination;
  selectedPrimaryDocument.value = item.primaryDocument;
  selectedPrimaryCombination.value = item.primaryCombination;
  selectedSecondaryDocument.value = item.secondaryDocument;
  selectedSecondaryCombination.value = item.secondaryCombination;
  editRule(item, index);
};

const submitForm = () => {
  submitThreshold({
    name: name.value,
    sending_country_id: sending_country_id.value,
    receiving_country_ids: receiving_country_ids.value,
    channel: selectedChannel.value,
  });
};

// Static dropdown data
const daysselect = ref([
  { title: "1", value: "1" },
  { title: "7", value: "7" },
  { title: "30", value: "30" },
  { title: "90", value: "90" },
  { title: "180", value: "180" },
  { title: "270", value: "270" },
  { title: "365", value: "365" },
]);

const combination = ref([
  { title: "AND", value: "and" },
  { title: "OR", value: "or" },
]);

const channel = ref([
  { title: "Agent", value: "agent" },
  { title: "Online", value: "online" },
]);


const documentOptions = ref([
  { title: "OR", value: "or" },
  { title: "AND", value: "and" },
]);

</script>
<template>
  <v-card class="mt-5">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm bg-grey py-0">
          <div class="d-flex align-center">
            <BackNavigation />
            <h4 class="text-h5 py-6 mb-0">Add Compliance Threshold</h4>
          </div>

        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="border-b-sm">
      <VForm @submit.prevent="submitForm">
        <VRow>
          <VCol cols="6">
            <span class="fs-14 label-color font-weight-regular" v-html="requiredLabel('Name')"></span>
            <AppTextField name="name" :rules="[requiredValidator]" v-model="name" placeholder="Name"
              autocomplete="off" />
          </VCol>

          <VCol cols="6">
            <span class="fs-14 label-color font-weight-regular" v-html="requiredLabel('Sending Country')"></span>
            <AppAutocomplete v-model="sending_country_id" :items="sending_countries" item-title="name" item-value="id"
              :rules="[requiredValidator]" name="country" placeholder="Sending Country" autocomplete="off" />
          </VCol>
          <VCol cols="6">
            <span class="fs-14 label-color font-weight-regular" v-html="requiredLabel('Receiving Country')"></span>
            <AppAutocomplete v-model="receiving_country_ids" :items="receiving_countries" item-title="name"
              item-value="id" :rules="[requiredValidator]" name="country" multiple chips closable-chips
              placeholder="Receiving Country" autocomplete="off" />

          </VCol>
          <VCol cols="6">
            <span class="fs-14 label-color font-weight-regular" v-html="requiredLabel('Channel')"></span>
            <AppAutocomplete v-model="selectedChannel" :rules="[requiredValidator]" :items="channel"
              placeholder="Channel" autocomplete="off" />

          </VCol>
        </VRow>
        <VRow class="threshold-values my-7">
          <VCol cols="6" sm="4" md="3" xl="1">
            <span class="fs-14 label-color font-weight-regular">Days</span>
            <AppAutocomplete v-model="days" :items="daysselect" name="days" placeholder="Days" autocomplete="off"/>
          </VCol>
          <VCol cols="6" sm="4" md="3" xl="1">
            <span class="fs-14 label-color font-weight-regular">Limit</span>
            <AppTextField type="number" v-model="limit" placeholder="Limit" />
          </VCol>
          <VCol cols="6" sm="4" md="3" xl="2">
            <span class="fs-14 label-color font-weight-regular">Combination</span>
            <AppAutocomplete v-model="selectedCombination" :items="combination" placeholder="Combination" />
          </VCol>
          <VCol cols="6" sm="4" md="3" xl="2">
            <span class="fs-14 label-color font-weight-regular">Primary Document</span>
            <AppAutocomplete v-model="selectedPrimaryDocument" :items="primaryDocumentOptions"
              placeholder="Primary Document" item-title="label" item-value="value" multiple />
          </VCol>
          <VCol cols="6" sm="4" md="3" xl="2">
            <span class="fs-14 label-color font-weight-regular">Primary Combination</span>
            <AppAutocomplete v-model="selectedPrimaryCombination" :items="combination"
              placeholder=" Primary Combination" />
          </VCol>
          <VCol cols="6" sm="4" md="3" xl="2">
            <span class="fs-14 label-color font-weight-regular">Secondary Document</span>
            <AppAutocomplete v-model="selectedSecondaryDocument" :items="secondaryDocumentOptions" item-title="label"
              item-value="value" placeholder="Secondary Document" multiple />
          </VCol>
          <VCol cols="6" sm="4" md="3" xl="2">
            <span class="fs-14 label-color font-weight-regular">Secondary Combination</span>
            <AppAutocomplete v-model="selectedSecondaryCombination" :items="combination"
              placeholder="Secondary Combination" />
          </VCol>
          <VCol cols="6 px-2" class="d-flex align-end">
            <VBtn class="" @click="addThreshold">
              {{ editIndex !== null ? 'Update Threshold' : 'Add Threshold' }}
            </VBtn>
          </VCol>
        </VRow>
        <VCardText class="px-0 pb-0 my-5">
          <v-table class="text-no-wrap" v-if="thresholdRules.length > 0">
            <thead>
              <tr>
                <th>Days</th>
                <th>Limit</th>
                <th>Combination</th>
                <th>Primary Documents</th>
                <th>Primary Combination </th>
                <th>Secondary Documents </th>
                <th>Secondary Cobmination </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in thresholdRules" :key="index">
                <td>{{ item.day }}</td>
                <td>{{ item.limit }}</td>
                <td>{{ item.combination }}</td>
                <td>{{ getDocumentLabels(item.primaryDocument, primaryDocumentOptions) }}</td>
                <td>{{ item.primaryCombination }}</td>
                <td>{{ getDocumentLabels(item.secondaryDocument, secondaryDocumentOptions) }}</td>
                <td>{{ item.secondaryCombination }}</td>
                <td>

                  <IconBtn class="text-color">
                    <NuxtLink class="menu-link">
                      <VIcon icon="tabler-edit" @click="editRow(item, index)" />
                    </NuxtLink>
                  </IconBtn>
                </td>
              </tr>
            </tbody>
            <tbody>
            </tbody>
          </v-table>
          <VCol cols="12" class="text-end">
            <VBtn color="white" class="login-btn" type="submit">Add</VBtn>
          </VCol>
        </VCardText>
      </VForm>
    </v-card-text>
  </v-card>
</template>
