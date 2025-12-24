<script setup>
const permissionStore = usePermissionStore()
defineProps({
  banks: {
    type: Array,
    required: true,
  },
  beneficiary_id: {
    type: Number,
    required: true,
  },
});
</script>
<template>
  <v-card-title
    class="border-b-sm d-flex justify-space-between align-center"
    style="background-color: lightgrey"
  >
    <h4 class="text-h5 py-3">Beneficiary Banks</h4>
    <VBtn
      variant="elevated"
      :to="`/beneficiaries/add-bank/${beneficiary_id}`"
      color="primary" v-if="permissionStore.hasPermission('beneficiary.bank.create')"
    >
      Add Bank
    </VBtn>
  </v-card-title>
  <VCardText class="px-0 pb-0">
    <VTable class="text-no-wrap">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Sort Code</th>
          <th>Branch code</th>
          <th>Account #</th>
          <th>Iban</th>
          <th>Country</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) in banks" :key="item.id">
          <td>{{ index + 1 }}</td>
          <td>{{ item.bank.name }}</td>
          <td>{{ item.sort_code }}</td>
          <td>{{ item.branch_code }}</td>
          <td>{{ item.account_number }}</td>
          <td>{{ item.iban }}</td>
          <td>{{ item.bank.country }}</td>
          <td>
            <VChip
                :style="{
                  backgroundColor: '#28C76F29', 
                  color: '#28C76F',              
                  marginTop: '4px',
                }"
                class="font-weight-light fs-12 p-1 mt-1"
                size="small"
              >
                Active
              </VChip>
          </td>
        </tr>
      </tbody>
    </VTable>
  </VCardText>
</template>
