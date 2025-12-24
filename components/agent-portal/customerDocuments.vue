<script setup>
import { useCustomer } from "@/composables/agentPortal/useCustomers";
import { defineProps, ref, watch } from "vue";
const {fetchCustomerDocuments} = useCustomer();

const props = defineProps({
  colorClass: {
    type: String,
    default: "bg-grey",
  },
  showSQC: {
    type: Boolean,
    default: false,
  },
  showView: {
    type: Boolean,
    default: false,
  },
  showStatus: {
    type: Boolean,
    default: false,
  },
  customer: {
    type: Array,
    required: true,
  },
  customer_id: {
    type: [String, Number],
    required: true,
  },
  isView:{
    type: Boolean,
    default: false
  }
});
defineExpose({
  refetchSenderDocuments
});

const customerDocumentsList = ref([]);

const senderDocument = ref(false);
const selectedDocument = ref(null);

function openFrontView(doc) {
  const url = doc.media?.[0]?.url;
  if (url && (url.endsWith(".pdf") || url.endsWith(".doc") || url.endsWith(".docx"))) {
    window.open(url, "_blank"); 
  } else {
    selectedDocument.value = doc;
    frontView.value = true; 
  }
}

function openBackView(doc) {
  const url = doc.media?.[1]?.url;
  if (url && (url.endsWith(".pdf") || url.endsWith(".doc") || url.endsWith(".docx"))) {
    window.open(url, "_blank"); 
  } else {
    selectedDocument.value = doc;
    backView.value = true; 
  }
}

const frontView = ref(false);
const backView = ref(false);

watch(
  () => props.customer_id,
  async (newId) => {
    if (newId) {
      const SenderDocuments = await fetchCustomerDocuments(newId);
      customerDocumentsList.value = SenderDocuments.filter(doc => doc.category === 'Identification');
    }
  },
  { immediate: true }
);


async function refetchSenderDocuments() {
  const SenderDocuments = await fetchCustomerDocuments(props.customer_id);
  customerDocumentsList.value = SenderDocuments.filter(doc => doc.category === 'Identification');
}

</script>

<template>
  <VCard class="my-5 border">
    <v-card-title :class="[
      'border-b-sm',
      'd-flex',
      'align-center',
      'justify-space-between',
      colorClass, 'bg-grey'
    ]">
      <h4 class="text-h5 py-3">Customer Documents</h4>
      <VBtn color="primary" variant="elevated" prepend-icon="tabler-plus" @click="senderDocument = true" v-if="props.isView">
        Add Documents
      </VBtn>
    </v-card-title>
    <VCardText class="px-0 pb-0">
      <VTable class="text-no-wrap" :height="customerDocumentsList.length > 5 ? '310px' : '100%'" fixed-header>
        <thead>
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>ID Ref No.</th>
            <th>Issuance date</th>
            <th>Expiry date</th>
            <th>Issuer Country</th>
            <th>Created At</th>
            <th>Status</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody class="text-color font-weight-medium">
          <tr v-for="(doc, index) in customerDocumentsList" :key="doc.id">
            <td>{{ index + 1 }}</td>
            <td>
              {{ doc.type }}
              <p :style="{ color: '#28C76F' }" class="font-weight-light fs-12 mb-0">
                <VIcon icon="tabler-point-filled" /> Primary
              </p>
            </td>
            <td>
              {{ doc.number }}
              <p :style="{ color: '#28C76F' }" class="font-weight-light fs-12 mb-0">
                <VIcon icon="tabler-point-filled" /> Active
              </p>
            </td>
            <td>{{ doc.issue_date }}</td>
            <td>{{ doc.expiry_date }}</td>
            <td>{{ doc.country }}</td>
            <td>{{ doc.created_at }}</td>
            <td>
              <VChip :style="{
                backgroundColor:
                  doc.is_verified == 'Yes' ? '#28C76F29' : '#FF9F4329',
                color: doc.is_verified == 'Yes' ? '#28C76F' : '#FF9F43',
              }" class="font-weight-light fs-12 p-1" size="small">
                {{ doc.is_verified === "Yes" ? "Verified" : "Unverified" }}
              </VChip>
            </td>

            <td>
              <template v-if="doc.media && doc.media.length">
                  <VBtn icon @click="openFrontView(doc)" class="me-2" variant="text"  v-if="doc.media[0]?.url">
                  <VIcon icon="tabler-credit-card" />
                </VBtn>
                <VBtn icon @click="openBackView(doc)" variant="text"  v-if="doc.media[1]?.url">
                  <VIcon icon="tabler-credit-card" />
                </VBtn>
              </template>
              <span v-else>-</span>
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>
  <!---Front View of document show in pop up--->
  <div class="text-center">
    <!-- Dialog -->
    <v-dialog v-model="frontView" max-width="1000" transition="scale-transition">
      <v-card>
        <v-row>
          <v-col cols="12">
            <v-card-title class="d-flex align-center justify-space-between" style="background-color: lightgray;">
              <h4 class="text-h4 py-3">Front View</h4>
              <IconBtn @click="frontView = false">
                <VIcon icon="tabler-x" />
              </IconBtn>
            </v-card-title>
          </v-col>
        </v-row>
        <v-card-text>
          <VCol cols="12">
            <!-- <img :src="selectedDocument?.media?.[0]?.url || ''" alt="Logo Image" class="ma-auto" /> -->
            <ImageViewer :imageUrl="selectedDocument?.media?.[0]?.url || ''" />
          </VCol>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
  <!---BackView of document show in pop up--->
  <div class="text-center">
    <!-- Dialog -->
    <v-dialog v-model="backView" max-width="1000" transition="scale-transition">
      <v-card>
        <v-row>
          <v-col cols="12">
            <v-card-title class="d-flex align-center justify-space-between" style="background-color: lightgray;">
              <h4 class="text-h4 py-3">Back View</h4>
              <IconBtn @click="backView = false">
                <VIcon icon="tabler-x" />
              </IconBtn>
            </v-card-title>
          </v-col>
        </v-row>
        <v-card-text>
          <VCol cols="12">
            <!-- <img :src="selectedDocument?.media?.[1]?.url || ''" alt="Logo Image" class="ma-auto" /> -->
            <ImageViewer :imageUrl="selectedDocument?.media?.[1]?.url || ''" />
          </VCol>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
