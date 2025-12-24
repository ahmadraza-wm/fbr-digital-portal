<script setup>
import { ref } from 'vue'
import { defineProps } from 'vue'

const props = defineProps({
  partner_responses: {
    type: Array,
    default: () => []
  }
})

const showTable = ref(false)
const payloadDialog = ref(false)
const jsonDialog = ref(false)

const selectedPayload = ref(null)
const selectedJson = ref(null)

const toggleTable = () => {
  showTable.value = !showTable.value
}


const cleanString = (str) => {
  if (!str) return "";
  
  try {
    
    str = str.replace(/\\"/g, '"').replace(/\\\//g, '/');
    
    const parsed = JSON.parse(str);
    return JSON.stringify(parsed, null, 2);
  } catch {
  
    return (
      str
        .replace(/[{}[\]\\"]/g, "") 
        .replace(/,/g, "\n") 
        .replace(/:/g, ": ") 
        .replace(/\s*\n\s*/g, "\n") 
        .trim()
    );
  }
};
const openPayload = (item) => {
  try {
    
    const data = typeof item.payload === "string" ? JSON.parse(item.payload) : item.payload;
    selectedPayload.value = JSON.stringify(data, null, 2);
  } catch {
    
    selectedPayload.value = cleanString(item.payload);
   
  }
  payloadDialog.value = true;
};

const openJsonResponse = (item) => {
  try {
    const data = typeof item.json_response === "string" ? JSON.parse(item.json_response) : item.json_response;
    selectedJson.value = JSON.stringify(data, null, 2);
  } catch {
    selectedJson.value = cleanString(item.json_response);
 
  }
  jsonDialog.value = true;
};





</script>

<template>
  <VCard class="border">
    <v-card-title class="border-b-sm bg-grey d-flex align-center justify-space-between bg-grey">
      <h4 class="text-h5 py-3">Partner Response History</h4>
      <VBtn :color="showTable ? 'error' : 'primary'" variant="elevated" @click="toggleTable">
        {{ showTable ? 'Hide Partner Response History' : 'Show Partner Response History' }}
      </VBtn>
    </v-card-title>

    <VCardText v-if="showTable" class="px-0 pb-0">
      <VTable class="text-no-wrap">
        <thead>
          <tr>
            <th>#</th>
            <th>Partner</th>
            <th>User</th>
            <th>Response Code</th>
            <th>Payload</th>
            <th>JSON Response</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody class="pb-2 text-color font-weight-medium">
          <tr v-for="(item, index) in props.partner_responses" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.partner }}</td>
            <td>{{ item.partner_user }}</td>
            <td>{{ item.partner_response_code }}</td>
            <td>
              <NuxtLink class="text-success cursor-pointer" @click="openPayload(item)">
                Show Payload
              </NuxtLink>
            </td>
            <td>
              <NuxtLink class="text-primary cursor-pointer" @click="openJsonResponse(item)">
                Show JSON Response
              </NuxtLink>
            </td>
            <td>{{ item.created_at || 'N/A' }}</td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>

  <!-- Payload Dialog -->
  <v-dialog v-model="payloadDialog" max-width="1000" transition="scale-transition">
    <v-card>
      <v-row>
        <v-col cols="12">
          <v-card-title
            class="d-flex align-center justify-space-between"
            style="background-color: lightgray"
          >
            <h4 class="text-h4 py-3">View Payload</h4>
            <IconBtn @click="payloadDialog = false">
              <VIcon icon="tabler-x" />
            </IconBtn>
          </v-card-title>
        </v-col>
      </v-row>

      <v-card-text class="mt-5">
        <pre
          class="bg-lightgrey pa-5"
          style="white-space: pre-wrap; word-break: break-word;"
        >
{{ selectedPayload || 'No Payload Available' }}
        </pre>
        <VCol cols="12" class="text-end">
          <VBtn color="secondary" variant="tonal" @click="payloadDialog = false">Close</VBtn>
        </VCol>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- JSON Response Dialog -->
  <v-dialog v-model="jsonDialog" max-width="1000" transition="scale-transition">
    <v-card>
      <v-row>
        <v-col cols="12">
          <v-card-title
            class="d-flex align-center justify-space-between"
            style="background-color: lightgray"
          >
            <h4 class="text-h4 py-3">View JSON Response</h4>
            <IconBtn @click="jsonDialog = false">
              <VIcon icon="tabler-x" />
            </IconBtn>
          </v-card-title>
        </v-col>
      </v-row>

      <v-card-text class="mt-5">
        <pre
          class="bg-lightgrey pa-5"
          style="white-space: pre-wrap; word-break: break-word;"
        >
{{ selectedJson || 'No JSON Response Available' }}
        </pre>
        <VCol cols="12" class="text-end">
          <VBtn color="secondary" variant="tonal" @click="jsonDialog = false">Close</VBtn>
        </VCol>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
