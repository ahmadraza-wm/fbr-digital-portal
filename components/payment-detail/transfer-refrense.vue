<script setup>
import { ref } from 'vue'

const showTable = ref(false)

const toggleTable = () => {
    showTable.value = !showTable.value
}
</script>

<template>
    <VCard class="border">
        <v-card-title class="border-b-sm bg-grey d-flex align-center justify-space-between">
            <h4 class="text-h5 py-3">Transfer References (PAY BY CARD (Debit/Credit))
            </h4>
            <VBtn :color="showTable ? 'error' : 'primary'" variant="elevated" @click="toggleTable">
                {{ showTable ? 'Hide Transfer Refrense' : 'Show Transfer Refrense' }}
            </VBtn>

        </v-card-title>

        <VCardText v-if="showTable" class="px-0 pb-0">
            <VTable class="text-no-wrap">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>References</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody class="pb-2 text-color font-weight-medium">
                    <tr>
                        <td>1</td>
                        <td>Status Change</td>
                        <td>16 May, 2025 06:45 AM</td>
                    </tr>
                </tbody>
            </VTable>
        </VCardText>
    </VCard>
</template>
