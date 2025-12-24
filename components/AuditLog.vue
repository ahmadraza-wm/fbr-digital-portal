<script setup>
import { ref, computed, watchEffect } from "vue";
import { useNuxtApp } from "#app";

const { $axios } = useNuxtApp();

const props = defineProps({
  module: { type: String, required: true },
  id: { type: [Number, String], default: null },
});

const auditLogs = ref({});     
const sections = ref([]);       
const currentTab = ref("");     
const options = ref({
  page: 1,
  itemsPerPage: 10,
});

const activeLogs = computed(() => auditLogs.value[currentTab.value] || []);

const startIndex = computed(() =>
  options.value.itemsPerPage === -1 ? 0 : (options.value.page - 1) * options.value.itemsPerPage
);
const endIndex = computed(() => {
  if (options.value.itemsPerPage === -1) return activeLogs.value.length;
  const end = startIndex.value + options.value.itemsPerPage;
  return end > activeLogs.value.length ? activeLogs.value.length : end;
});
const paginatedLogs = computed(() =>
  activeLogs.value.slice(startIndex.value, endIndex.value)
);
const totalPages = computed(() =>
  Math.ceil(activeLogs.value.length / options.value.itemsPerPage)
);

const fetchLogs = async () => {
  try {
    const params = { model: props.module, id: props.id };
    const response = await $axios.get("/audit/logs", { params });

    console.log("response", response.data);

    if (response?.data?.message?.includes("Record Not Found")) {
      auditLogs.value = {};
      sections.value = [];
      currentTab.value = "";
      return;
    }

    const data = response.data.data || {};

    auditLogs.value = Object.entries(data).reduce((acc, [section, logs]) => {
      acc[section] = (logs || []).map((log) => {
        let cleanedRemarks = (log.changes || [])
          .map((part) => part.replace(/[\\\/",]/g, "").trim())
          .join(" | ");

        return {
          id: `${section}-${log.id}`,
          remarks: cleanedRemarks,
          createdBy: log.created_by?.name || "N/A",
          createdAt: log.created_at,
        };
      });
      return acc;
    }, {});

    sections.value = Object.keys(auditLogs.value);

    if (sections.value.length > 0) {
      currentTab.value = sections.value[0];
    }
  } catch (err) {
    console.error("Failed to fetch audit logs", err);

    if (
      err.response?.status === 404 
    ) {
      auditLogs.value = {};
      sections.value = [];
      currentTab.value = "";
    }
  }
};

watchEffect(() => {
  if (props.module && props.id) {
    fetchLogs();
  }
});
</script>


<template>
  <VCard>
    <v-card-title class="border-b-sm pt-6 pb-8" style="background-color: lightgrey">
      <h4 class="text-h5">Audit Log</h4>
    </v-card-title>

    <VCardText v-if="sections.length === 0" class="text-center py-6">
      <span class="text-medium-emphasis">No logs found</span>
    </VCardText>

    <template v-else>
      <VTabs v-model="currentTab" class="v-tabs-pill bg-white border-b-sm pt-4 px-8">
        <VTab v-for="section in sections" :key="section" :value="section">
          {{ section }}
        </VTab>
      </VTabs>

      <VCardText class="px-0">
        <VWindow v-model="currentTab">
          <VWindowItem v-for="section in sections" :key="section" :value="section">
            <VTable class="text-no-wrap border-b-sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Remarks</th>
                  <th>Created by</th>
                  <th>Created at</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(log, index) in paginatedLogs" :key="log.id">
                  <td>{{ startIndex + index + 1 }}</td>
                  <td class="text-wrap">{{ log.remarks }}</td>
                  <td>{{ log.createdBy }}</td>
                  <td>{{ log.createdAt }}</td>
                </tr>
                <tr v-if="paginatedLogs.length === 0">
                  <td colspan="4" class="text-center">No logs found</td>
                </tr>
              </tbody>
            </VTable>

            <VCardText class="pt-0 pb-0">
              <div class="d-flex justify-space-between align-center flex-wrap mt-3">
                <div class="fs-14 text-medium-emphasis">
                  Showing <strong>{{ startIndex + 1 }}</strong> to
                  <strong>{{ endIndex }}</strong> of
                  <strong>{{ activeLogs.length }}</strong> entries
                </div>
                <VPagination v-model="options.page" :length="totalPages" :total-visible="5" />
              </div>
            </VCardText>
          </VWindowItem>
        </VWindow>
      </VCardText>
    </template>
  </VCard>
</template>

