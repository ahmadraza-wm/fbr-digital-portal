<script setup>
const permissionStore = usePermissionStore()
defineProps({
  documents: {
    type: Array,
    required: true,
  },
  updateDocumentStatus: {
    type: Function,
    required: true,
  },
  agentId: {
    type: [String, Number],
    required: true,
  },
  isView:{
    type: Boolean
  }
});

const emit = defineEmits(['editDocument'])
definePageMeta({
  middleware: "auth",
  permission: "agent_documents.store"
})
</script>
<template>
  <VCard class="my-5">
    <v-card-title class="border-b-sm" style="background-color: lightgrey;">
      <h4 class="text-h5 py-3">Agent Documents</h4>
    </v-card-title>
    <VCardText class="px-0 pb-0">
      <v-table class="text-no-wrap">
        <thead>
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>Number</th>
            <th>Issuer Auth</th>
            <th>Issuance date</th>
            <th>Expiry date</th>
            <th>Issuer Country</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in documents" :key="item.id">
            <td>{{item.id}}</td>
            <td>{{ item.type }}
            </td>
            <td>{{ item.number }}
            </td>
            <td>{{ item.issuer_authority }}</td>
            <td>{{ item.issue_date }}</td>
            <td>{{ item.expiry_date }}</td>
            <td>{{ item.country }}</td>
            <td>
             <VChip
                :style="{
                  backgroundColor: item.is_verified === 'Yes' ? '#28C76F29' : '#FF9F4329',
                  color: item.is_verified === 'Yes' ? '#28C76F' : '#FF9F43',
                  marginLeft: '8px',
                  marginTop: '5px',
                }"
                class="font-weight-light fs-12 p-1"
                size="small"
              >
                {{ item.is_verified === 
                'Yes' ? 'Verified' : 'Unverified' }}
              </VChip>

            </td>
            <td>
                          <div class="d-flex gap-1">
                <VBtn icon variant="text" color="medium-emphasis">
                  <VMenu>
                    <template #activator="{ props }">
                      <VBtn icon variant="text" color="medium-emphasis" v-bind="props">
                        <VIcon icon="tabler-dots-vertical" />
                      </VBtn>
                    </template>
                    <VList>
                  
                     <VListItem @click="updateDocumentStatus(agentId, item.id)"  v-if="permissionStore.hasPermission('agent.documents.verify')">
                        <VListItemTitle>
                           {{ item.is_verified ===  'Yes' ? 'Unverify' : 'Verify' }}
                        </VListItemTitle>
                      </VListItem>
                      <VListItem @click="emit('editDocument', item)" v-if="isView && permissionStore.hasPermission('agent.documents.update')">
                        <VListItemTitle>
                           Edit
                        </VListItemTitle>
                      </VListItem>
                     <VListItem 
                      v-if="item.media[0]?.url"
                       :href="item.media[0].url"
                       tag="a"
                        target="_blank"
                        rel="noopener noreferrer"
                       >
                      <VListItemTitle>Front View</VListItemTitle>
                    </VListItem>
                    <VListItem 
                      v-if="item.media[1]?.url"
                    
                      :href="item.media[1].url"
                        tag="a"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                      <VListItemTitle>Back View</VListItemTitle>
                    </VListItem>
                    </VList>
                  </VMenu>
                </VBtn>
              </div>
            </td>
          </tr>
          
        </tbody>
      </v-table>
    </VCardText>
  </VCard>
</template>
