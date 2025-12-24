<script setup>
import AuditLog from '@/components/AuditLog.vue';
import AgentDocument from '@/components/agents/AgentDocument.vue';
import { useAgents } from "@/composables/useAgents";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
const countryCurrencyStore = useCountryCurrencyStore();
const { countries, currencies } = storeToRefs(countryCurrencyStore);
const { $axios } = useNuxtApp();
definePageMeta({
  middleware: "auth",
  permission: "agents.show"
})

const route = useRoute();
const agentData = ref([]);

const {
     agents,
    documents,
    updateDocumentStatus,
    fetchAgentDocuments,
} = useAgents()




onMounted(async () => {
  try {
    const id = route.params.id;
    const response = await $axios.get(`/agents/${id}`);
    agentData.value = response.data.data;
    fetchAgentDocuments(id);
  } catch (error) {
    console.error("Failed to fetch agent data", error);
  }
});

</script>
<template>
 <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex align-center" style="background-color: lightgrey;" >
          <BackNavigation />
          <h4 class="text-h5 py-4">Agent Details</h4>
        </v-card-title>
        <v-card-title class="py-0 border-b-sm header_bg">
          <h4 class="text-h5 py-5">Personal Details</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="px-0 pt-0">
  <v-row class="border-b-md px-5">
    <v-col cols="6" sm="4" md="3" class="pb-1">
      <p class="font-weight-medium text-color mb-0 lh-22">Business Name</p>
      <p class="font-weight-medium mb-0 lh-22 text-color1">{{agentData?.business_name || "---" }}</p>
    </v-col>
    <v-col cols="6" sm="4" md="3" class="pb-1">
      <p class="font-weight-medium text-color mb-0 lh-22">Name</p>
      <p class="font-weight-medium mb-0 lh-22 text-color1">{{agentData?.name || "---" }}</p>
    </v-col>
    <v-col cols="6" sm="4" md="3" class="pb-1">
      <p class="font-weight-medium text-color mb-0 lh-22">Relation Type</p>
      <p class="font-weight-medium mb-0 lh-22 text-color1">{{agentData?.relation_type || "---" }}</p>
    </v-col>
    <v-col cols="6" sm="4" md="3" class="pb-1">
      <p class="font-weight-medium text-color mb-0 lh-22">Relation Name</p>
      <p class="font-weight-medium mb-0 lh-22 text-color1">{{agentData?.relation_name || "---" }}</p>
    </v-col>
  </v-row>
  <v-row class="border-b-md px-5">
    <v-col cols="6" sm="4" md="3" class="pb-1">
      <p class="font-weight-medium text-color mb-0 lh-22">Email</p>
      <p class="font-weight-medium mb-0 lh-22 text-color1">{{agentData?.email || "---" }}</p>
    </v-col>
    <v-col cols="6" sm="4" md="3" class="pb-1">
      <p class="font-weight-medium text-color mb-0 lh-22">Phone</p>
      <p class="font-weight-medium mb-0 lh-22 text-color1">{{agentData?.phone || "---" }}</p>
    </v-col>
    <v-col cols="6" sm="4" md="3" class="pb-1">
      <p class="font-weight-medium text-color mb-0 lh-22">DOB</p>
      <p class="font-weight-medium mb-0 lh-22 text-color1">{{agentData?.dob || "---" }}</p>
    </v-col>
    <v-col cols="6" sm="4" md="3" class="pb-1">
      <p class="font-weight-medium text-color mb-0 lh-22">Nationality</p>
      <p class="font-weight-medium mb-0 lh-22 text-color1">{{agentData?.nationality || "---" }}</p>
    </v-col>
  </v-row>
  <v-row class="border-b-md px-5">
    <v-col cols="6" sm="4" md="3" class="pb-1">
      <p class="font-weight-medium text-color mb-0 lh-22">Gender</p>
      <p class="font-weight-medium mb-0 lh-22 text-color1">{{agentData?.gender || "---" }}</p>
    </v-col>
    <v-col cols="6" sm="4" md="3" class="pb-1">
      <p class="font-weight-medium text-color mb-0 lh-22">Country</p>
      <p class="font-weight-medium mb-0 lh-22 text-color1">{{ countries.find(c => c.id === agentData?.country_id)?.name || 'N/A' }}</p>
    </v-col>
    <v-col cols="6" sm="4" md="3" class="pb-1">
      <p class="font-weight-medium text-color mb-0 lh-22">City</p>
      <p class="font-weight-medium mb-0 lh-22 text-color1">{{agentData?.city || "---" }}</p>
    </v-col>
  </v-row>
  <v-row>
      <v-col cols="12 pt-0">
        <v-card-title class="py-0 border-b-md header_bg">
          <h4 class="text-h5 py-5">Other Details</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-row class="border-b-md px-5">
      <v-col cols="6" sm="4" md="3" class="pb-1">
        <p class="font-weight-medium text-color mb-0 lh-22">Channel</p>
        <p class="font-weight-medium mb-0 lh-22 text-color1">{{agentData?.channel || "---" }}</p>
      </v-col>
      <v-col cols="6" sm="4" md="3" class="pb-1">
        <p class="font-weight-medium text-color mb-0 lh-22">Type</p>
        <p class="font-weight-medium mb-0 lh-22 text-color1">{{agentData?.type || "---" }}</p>
      </v-col>
      <v-col cols="6" sm="4" md="3" class="pb-1">
        <p class="font-weight-medium text-color mb-0 lh-22">Main Agent</p>
        <p class="font-weight-medium mb-0 lh-22 text-color1">{{ agentData?.main_agent_name }}</p>
      </v-col>
      <v-col cols="6" sm="4" md="3" class="pb-1">
        <p class="font-weight-medium text-color mb-0 lh-22">Sub Agent</p>
        <p class="font-weight-medium mb-0 lh-22 text-color1">{{ agentData?.sub_agent_name }}</p>
      </v-col>
  </v-row>
  <v-row class="border-b-md px-5">
      <v-col cols="6" sm="4" md="3" class="pb-1">
        <p class="font-weight-medium text-color mb-0 lh-22">Time Zone</p>
        <p class="font-weight-medium mb-0 lh-22 text-color1">{{agentData?.timezone || "---" }}</p>
      </v-col>
      <v-col cols="6" sm="4" md="3" class="pb-1">
        <p class="font-weight-medium text-color mb-0 lh-22">Agent Code/Prefix</p>
        <p class="font-weight-medium mb-0 lh-22 text-color1">{{agentData?.agent_code || "---" }}</p>
      </v-col>
      <v-col cols="6" sm="4" md="3" class="pb-1">
        <p class="font-weight-medium text-color mb-0 lh-22">Status</p>
        <p class="font-weight-medium mb-0 lh-22 text-color1">
           <VChip
              :color="agentData?.status == 1 ? 'success' : 'error'"
              class="font-weight-medium"
              size="small"
            >
              {{ agentData?.status == 1 ? "Active" : "Inactive" }}
            </VChip>
        </p>
      </v-col>
      <v-col cols="6" sm="4" md="3" class="pb-1">
        <p class="font-weight-medium text-color mb-0 lh-22">New Payment Allow</p>
        <p class="font-weight-medium mb-0 lh-22 text-color1">{{ agentData?.new_payment_allow == 1 ? 'Yes' : 'No' || "---"  }}</p>
      </v-col>
  </v-row>
  <v-row class="border-b-md px-5">
      <v-col cols="6" sm="4" md="3" class="pb-1">
        <p class="font-weight-medium text-color mb-0 lh-22">Hold Payment</p>
        <p class="font-weight-medium mb-0 lh-22 text-color1">{{ agentData?.hold_payment == 1 ? 'Yes' : 'No' || "---"  }}</p>
      </v-col>
      <v-col cols="6" sm="4" md="3" class="pb-1">
        <p class="font-weight-medium text-color mb-0 lh-22">Pending Payment</p>
        <p class="font-weight-medium mb-0 lh-22 text-color1">{{ agentData?.pending_all_payments == 1 ? 'Yes' : 'No' || "---"  }}</p>
      </v-col>
      <v-col cols="6" sm="4" md="3" class="pb-1">
        <p class="font-weight-medium text-color mb-0 lh-22">House # / Office</p>
        <p class="font-weight-medium mb-0 lh-22 text-color1">{{ agentData?.house_office_number || "---"  }}</p>
      </v-col>
      <v-col cols="6" sm="4" md="3" class="pb-1">
        <p class="font-weight-medium text-color mb-0 lh-22">Street Address</p>
        <p class="font-weight-medium mb-0 lh-22 text-color1">{{ agentData?.address || "---" }}</p>
      </v-col>
  </v-row>
  <v-row class="border-b-md px-5">
      <v-col cols="6" sm="4" md="3" class="pb-1">
        <p class="font-weight-medium text-color mb-0 lh-22">Postal Code</p>
        <p class="font-weight-medium mb-0 lh-22 text-color1">{{ agentData?.postal_code || "---" }}</p>
      </v-col>
      <v-col cols="6" sm="4" md="3" class="pb-1">
        <p class="font-weight-medium text-color mb-0 lh-22">MLR #</p>
        <p class="font-weight-medium mb-0 lh-22 text-color1">{{ agentData?.mlr_number || "---"  }}</p>
      </v-col>
  
      <v-col cols="6" sm="4" md="3" class="pb-1">
        <p class="font-weight-medium text-color mb-0 lh-22">Base Currency</p>
        <p class="font-weight-medium mb-0 lh-22 text-color1"> {{ agentData?.base_currency }}</p>
      </v-col>
         <v-col cols="6" sm="4" md="3" class="pb-1">
        <p class="font-weight-medium text-color mb-0 lh-22">FSA Registration Number</p>
        <p class="font-weight-medium mb-0 lh-22 text-color1">{{ agentData?.fsa_registration_number || "---" }}</p>
      </v-col>
  </v-row>
  <v-row class="border-b-md px-5">
   
      <v-col cols="6" sm="4" md="3" class="pb-1">
        <p class="font-weight-medium text-color mb-0 lh-22">Charges include in balance</p>
        <p class="font-weight-medium mb-0 lh-22 text-color1">{{ agentData?.charges_include_in_balance == 1 ? 'Yes' : 'No' || "---" }}</p>
      </v-col>
      
                <v-col cols="6" sm="4" md="3" class="pb-1">
                    <p class="font-weight-medium text-color mb-0 lh-22">Is Partner</p>
                    <p class="font-weight-medium mb-0 lh-22 text-color1">
                        <VChip :style="{
              backgroundColor:
              agentData?.is_partner == 1 ? '#28C76F29' : '#FF9F4329',
              color: agentData?.is_partner == 1 ? '#28C76F' : '#FF9F43',

              marginTop: '2px',
            }" class="font-weight-light fs-12 p-1" size="small">
              {{ agentData?.is_partner == 1 ? "Yes" : "No"  || "---" }}
            </VChip>
        </p>
      </v-col>
       <v-col cols="6" sm="4" md="3" class="pb-1">
                    <p class="font-weight-medium text-color mb-0 lh-22">User Id</p>
                    <p class="font-weight-medium mb-0 lh-22 text-color1">{{ agentData?.id || "---" }}</p>
                </v-col>
  </v-row>
  <v-row class="border-b-md px-5">
    
               
            </v-row>
        </v-card-text>
    </v-card>
    <AgentDocument :documents="documents" :updateDocumentStatus="updateDocumentStatus" :agentId="route.params.id" :isView="false" />
    <AuditLog module="agent" :id="route.params.id"/>
</template>
