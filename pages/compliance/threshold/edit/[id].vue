<script setup>
import { useThreshold } from '@/composables/useThreshold';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import AuditLog from '@/components/AuditLog.vue'

const countryCurrencyStore = useCountryCurrencyStore();
const { sending_countries, receiving_countries } = storeToRefs(countryCurrencyStore);
definePageMeta({
  middleware: "auth",
  permission: "thresholds.update"
})

const route = useRoute();
const thresholdId = route.params.id;

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
  fetchThresholdById,
  documents,
  fetchDocuments,
  submitThreshold
} = useThreshold();

onMounted(async () => {
  await fetchDocuments();
  const data = await fetchThresholdById(thresholdId);
  console.log('edit data', data)
  if (data) {
    name.value = data.name;
    sending_country_id.value = data.sending_country_id;
    receiving_country_ids.value = data.receiving_countries.map(rc => rc.receiving_country.id);

    selectedChannel.value = data.channel;

    thresholdRules.value = data.rules.map(rule => {
      const primaryDocuments = rule.documents
        .filter(doc => doc.documet_type === 'primary')
        .map(doc => doc.document_id);

      const secondaryDocuments = rule.documents
        .filter(doc => doc.documet_type === 'secondary')
        .map(doc => doc.document_id);

      return {
        day: Number(rule.days),
        limit: Number(rule.limit),
        combination: rule.document_combination,
        primaryCombination: rule.primary_document_combination,
        secondaryCombination: rule.secondary_document_combination,
        primaryDocument: primaryDocuments,
        secondaryDocument: secondaryDocuments,
      };
    });

  }
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
    id: thresholdId,
    name: name.value,
    sending_country_id: sending_country_id.value,
    receiving_country_ids: receiving_country_ids.value,
    channel: selectedChannel.value,
    edit: true,
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
</script>


<template>
  <v-card class="mt-5">
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm bg-grey py-0">
          <div class="d-flex align-center">
            <BackNavigation />
            <h4 class="text-h5 py-6 mb-0">Edit Compliance Threshold</h4>
          </div>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="border-b-sm">
      <VForm @submit.prevent="submitForm">
        <VRow>
          <VCol cols="6">
            <span class="fs-14 label-color font-weight-regular" v-html="requiredLabel('Name')"></span>
            <AppTextField name="name" :rules="[requiredValidator]" v-model="name" placeholder="Name" autocomplete="off" />
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
          <VCol cols="5">
            <VRow>
              <VCol cols="2" class="px-0">
                <span class="fs-14 label-color font-weight-regular">Days</span>
                <AppAutocomplete v-model="days" :items="daysselect" name="days" placeholder="Days" autocomplete="off" />
              </VCol>
              <VCol cols="2">
                <span class="fs-14 label-color font-weight-regular">Limit</span>
                <AppTextField type="number" v-model="limit" placeholder="Limit" />
              </VCol>
              <VCol cols="4">
                <span class="fs-14 label-color font-weight-regular">Combination</span>
                <AppAutocomplete v-model="selectedCombination" :items="combination" placeholder="Combination" />
              </VCol>
              <VCol cols="4">
                <span class="fs-14 label-color font-weight-regular">Primary Document</span>
                <AppAutocomplete v-model="selectedPrimaryDocument" :items="primaryDocumentOptions" item-title="label"
                  item-value="value" placeholder="Primary Document" multiple />
              </VCol>
            </VRow>
          </VCol>

          <VCol cols="7">
            <VRow>
              <VCol cols="3">
                <span class="fs-14 label-color font-weight-regular">Primary Combination</span>
                <AppAutocomplete v-model="selectedPrimaryCombination" :items="combination"
                  placeholder="Primary Combination" />
              </VCol>
              <VCol cols="3">
                <span class="fs-14 label-color font-weight-regular">Secondary Document</span>
                <AppAutocomplete v-model="selectedSecondaryDocument" :items="secondaryDocumentOptions"
                  item-title="label" item-value="value" placeholder="Secondary Document" multiple />
              </VCol>
              <VCol cols="3" class="px-0">
                <span class="fs-14 label-color font-weight-regular">Secondary Combination</span>
                <AppAutocomplete v-model="selectedSecondaryCombination" :items="combination"
                  placeholder="Secondary Combination" />
              </VCol>
              <VCol cols="3" class="d-flex align-center mt-2">
                <VBtn class="mt-3" @click="addThreshold">
                  {{ editIndex !== null ? 'Update Threshold' : 'Add Threshold' }}
                </VBtn>
              </VCol>
            </VRow>
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
                <th>Primary Combination</th>
                <th>Secondary Documents</th>
                <th>Secondary Combination</th>
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
          </v-table>

          <VCol cols="12" class="text-end">
            <VBtn color="white" class="login-btn" type="submit">Update</VBtn>
          </VCol>
        </VCardText>
      </VForm>
    </v-card-text>
  </v-card>
     <AuditLog
    module="Threshold"
    :id="thresholdId"
    class="mt-4"
  />
</template>
