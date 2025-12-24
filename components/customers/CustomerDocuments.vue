<script setup>
const permissionStore = usePermissionStore()
defineProps({
  isView:{
   type:Boolean,
   required: false
  },
  documents: {
    type: Array,
    required: true,
  },
    updateDocumentStatus: {
    type: Function,
    required: true,
  },
  openVerifyDialog:{
    type:Function,
    
  }

});

const emit = defineEmits(['editDocument'])
</script>

<template>
    <v-card class="mt-7 px-0">
    <v-row>
      <v-col cols="12">
        <v-card-title style="background-color: lightgray">
          <h4 class="text-h4 py-3">Customer Documents</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="pb-10 px-0">
      <v-table class="text-no-wrap" :height="documents.length > 5 ? '310px' : '100%'" fixed-header>
        <thead>
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>Number</th>
            <th>Issuer Auth</th>
            <th>Issuance Date</th>
            <th>Expiry Date</th>
            <th>Issuance Country</th>
            <th>Created At</th>
            <th>Verify</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in documents" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.number }}</td>
            <td>{{ item.issuer_authority }}</td>
            <td>{{ item.issue_date }}</td>
            <td>{{ item.expiry_date }}</td>
            <td>{{ item.country }}</td>
            <td>
              {{ item.created_at }}
            </td>
          
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
                  
                  <VListItem @click="openVerifyDialog(item)"  v-if="permissionStore.hasPermission('customer.documents.verify')">
                    <VListItemTitle>
                      {{ item.is_verified === 'Yes' ? 'Unverify' : 'Verify' }}
                    </VListItemTitle>
                  </VListItem>

                      <VListItem @click="emit('editDocument', item)" v-if="permissionStore.hasPermission('customer.document.update')">
                        <VListItemTitle>Edit</VListItemTitle>
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
    </v-card-text>
  </v-card>
</template>
