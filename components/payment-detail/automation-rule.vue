<script setup>
import { computed, ref } from 'vue'

const rules = ref([
    { title: "Active", value: "Active" },
    { title: "Inactive", value: "InActive" },
])

const showTable = ref(false)
const selectedStatus = ref(null)
// Sample table data
const allRows = ref([
    {
        id: 1,
        rule: "If the beneficiary account details are modified.",
        status: "InActive",
        payload: "-----",
        createdAt: "16 May, 2025 06:45 AM"
    },
    {
        id: 2,
        rule: "If the beneficiary account details are modified.",
        status: "InActive",
        payload: "-----",
        createdAt: "16 May, 2025 06:45 AM"
    },
    {
        id: 3,
        rule: "If the beneficiary account details are modified.",
        status: "Active",
        payload: "-----",
        createdAt: "16 May, 2025 06:45 AM"
    },
])

// Filtered rows based on dropdown selection
const filteredRows = computed(() => {
    if (!selectedStatus.value) return allRows.value
    return allRows.value.filter(row => row.status === selectedStatus.value)
})

const toggleTable = () => {
    showTable.value = !showTable.value

    // Reset selection properly
    if (!showTable.value) selectedStatus.value = null
}

</script>

<template>
    <VCard class="my-5 border">
        <v-card-title class="border-b-sm bg-grey d-flex align-center justify-space-between bg-grey">
            <VRow>
                <VCol cols="6">
                    <h4 class="text-h5 py-3">Automation Rules</h4>
                </VCol>
                <VCol cols="6" class="d-flex align-center justify-space-end">
                    <VRow>
                        <!-- Select dropdown only shown if table is visible -->
                        <VCol cols="6" class="py-0" v-if="showTable">
                            <AppAutocomplete class="rounded" v-model="selectedStatus" name="select" :items="rules"
                                placeholder="Please Select" style="border-radius: 10px;background-color: white;" />
                        </VCol>

                        <VCol :cols="showTable ? 6 : 12" class="text-end py-0">
                            <VBtn :color="showTable ? 'error' : 'primary'" variant="elevated" @click="toggleTable">
                                {{ showTable ? 'Hide Automation Rules' : 'Show Automation Rules' }}
                            </VBtn>
                        </VCol>
                    </VRow>
                </VCol>
            </VRow>
        </v-card-title>

        <VCardText v-if="showTable" class="px-0 pb-0">
            <VTable class="text-no-wrap">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Rule</th>
                        <th>Status</th>
                        <th>Payload</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody class="pb-2 text-color font-weight-medium">
                    <tr v-for="(row, index) in filteredRows" :key="row.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ row.rule }}</td>
                        <td :class="row.status === 'Active' ? 'text-success' : 'text-red'">{{ row.status }}</td>
                        <td>{{ row.payload }}</td>
                        <td>{{ row.createdAt }}</td>
                    </tr>
                </tbody>
            </VTable>
        </VCardText>
    </VCard>
</template>
