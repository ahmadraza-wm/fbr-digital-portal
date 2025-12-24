<script setup>
import { Bar } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels
)

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  },
  chartOptions: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>
