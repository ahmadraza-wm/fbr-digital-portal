<script setup>
import HourlyTransferChart from "@/components/dashboard/hourlyTransferChart.vue";
import { ref, watch, computed } from "vue";
import { useAgents } from "@/composables/useAgents";


const { agents, fetchAgents } = useAgents()

const props = defineProps({
  hourlyData: {
    type: Array,
    default: () => [],
  },
});

const fromDate = ref(new Date());
const toDate = ref(new Date());
const agent = ref("");
const dataShowBy = ref("count");

const agentList = [
  { title: "Please Select", value: "" },
  { title: "Muhammad Talha", value: "MTH" },
  { title: "Muhammad Usman", value: "MUS" },
  { title: "Ahmad Raza", value: "ARZ" },
];

const categoryList = [
  { title: "By Count", value: "count" },
  { title: "By Volume", value: "volume" },
];

const chartDataByCount = ref({ labels: [], datasets: [] });
const chartDataByVolume = ref({ labels: [], datasets: [] });

const yAxisTitle = computed(() =>
  dataShowBy.value === "volume" ? "Amount" : "Transfers"
);

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
    },
    datalabels: {
      anchor: "end",
      align: "end",
      formatter: (value) =>
        dataShowBy.value === "volume"
          ? value >= 1000
            ? (value / 1000).toFixed(1) + "k"
            : value
          : value,
      color: "#000",
      font: {
        weight: "bold",
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: yAxisTitle.value,
      },
    },
    x: {
      title: {
        display: true,
        text: "Hour of the Day",
      },
    },
  },
}));

const buildChartData = () => {
  const labels = Array.from({ length: 24 }, (_, i) =>
    `${i.toString().padStart(2, "0")}:00`
  );
  const countData = Array(24).fill(0);
  const volumeData = Array(24).fill(0);

  props.hourlyData.forEach((item) => {
    const hour = Number(item.hour);
    if (hour >= 0 && hour <= 23) {
      countData[hour] = item.transaction_count;
      volumeData[hour] = item.total_volume;
    }
  });

  chartDataByCount.value = {
    labels,
    datasets: [
      {
        label: "Total Transfers",
        backgroundColor: "#42A5F5",
        data: countData,
      },
    ],
  };

  chartDataByVolume.value = {
    labels,
    datasets: [
      {
        label: "Total Volume",
        backgroundColor: "#26C6DA",
        data: volumeData,
      },
    ],
  };
};
const filters = ref({
  force_fetch: true
})
onMounted(() => {
  fetchAgents(filters.value)
})

const emit = defineEmits(['filtersChanged']);

watch([agent, fromDate, toDate], () => {
  emit('filtersChanged', {
    agent_id: agent.value,
    from_date: fromDate.value,
    to_date: toDate.value
  })
})

watch(() => props.hourlyData, buildChartData, { immediate: true });



</script>

<template>
  <v-card class="mt-5">
    <v-card-title class="d-md-flex align-center" style="background-color: #dcf0f0">
      <h4 class="text-h5">Transfer Stats (Hourly)</h4>
      <div class="w-100 d-flex justify-end">
        <v-col cols="3" xl="2">
          <v-autocomplete
            v-model="agent"
            :items="agents"
            item-title="name"
            item-value="id"
            placeholder="Please Select"
          />
        </v-col>
        <v-col cols="3" xl="2">
          <v-autocomplete
            v-model="dataShowBy"
            :items="categoryList"
            placeholder="Select Metric"
          />
        </v-col>
        <v-col cols="3" xl="2">
          <AppDateTimePicker
            name="from"
            v-model="fromDate"
            placeholder="dd/mm/yyyy"
            :config="{ dateFormat: 'd-m-Y' }"
          />
        </v-col>
        <v-col cols="3" xl="2">
          <AppDateTimePicker
            name="to"
            v-model="toDate"
            placeholder="dd/mm/yyyy"
            :config="{ dateFormat: 'd-m-Y' }"
          />
        </v-col>
      </div>
    </v-card-title>

    <v-card-text class="chart-wrapper">
      <HourlyTransferChart
        :chart-data="dataShowBy === 'count' ? chartDataByCount : chartDataByVolume"
        :chart-options="chartOptions"
      />
    </v-card-text>
  </v-card>
</template>

<style lang="scss">
.chart-wrapper {
  position: relative;
  block-size: 400px;
  inline-size: 100%;
}
</style>
