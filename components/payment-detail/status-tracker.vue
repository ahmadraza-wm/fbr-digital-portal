<script setup>
import { ref, onMounted, watch } from "vue";
import { useNuxtApp } from "#app";

const { $axios } = useNuxtApp();

const props = defineProps({
  transaction_id: {
    type: [String, Number],
    required: true,
  },
});
const statusHistory = ref([]);
const totalDuration = ref(0);

const fetchStatusHistory = async () => {
  try {
    const res = await $axios.get(
      `/transactions/status/tracker/${props.transaction_id}`
    );
    if (res.data?.success) {
      statusHistory.value = res.data.data.status_histories || [];
      totalDuration.value = res.data.data.total_duration || 0;
    }
  } catch (error) {
    console.error("Error fetching transaction status:", error);
  }
};

const formatStatus = (status) => {
  // Optional formatting if needed (e.g., capitalize)
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatTotalDuration = (duration) => {
  // Example: convert seconds to readable format if needed
  if (!duration || duration === 0) return "-";
  const days = Math.floor(duration / 86400);
  const hours = Math.floor((duration % 86400) / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;
  return `${
    days ? `${days} day${days > 1 ? "s" : ""} ` : ""
  }${minutes} mins, ${seconds} sec`;
};

onMounted(() => {
  fetchStatusHistory();
});

watch(() => props.transaction_id, fetchStatusHistory, { immediate: true });
</script>

<template>
  <VCol cols="12" class="mb-0 pt-2 pb-0 px-0">
    <p class="text-h5 mb-0 border-b-sm ps-2">
      Status Tracker
      <VBadge
        color="primary"
        :content="statusHistory.length"
        inline
        class="ms-2"
      />
    </p>

    <VTable class="text-no-wrap">
      <thead>
        <tr>
          <th>Status</th>
          <th>Time</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody class="text-color text-color font-weight-medium">
        <tr v-for="(entry, index) in statusHistory" :key="index">
          <td class="fs-14 font-weight-bold">
            {{ formatStatus(entry.status) }}
          </td>
          <td>{{ entry.time }}</td>
          <td>{{ entry.total_duration }}</td>
        </tr>

        <tr>
          <td></td>
          <td class="fs-14 font-weight-bold">Total Duration</td>
          <td>{{ totalDuration || '-' }}</td>
        </tr>
      </tbody>
    </VTable>
  </VCol>
</template>
