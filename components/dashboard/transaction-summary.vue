<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  statusWise: {
    type: Object, // because API gives { PKR: [...], USD: [...] }
    default: () => ({}),
  },
});

const from = ref(new Date());
const to = ref(new Date());

// generate random color
function randomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// format value or return 00
function formatValue(val) {
  if (val === null || val === undefined || val === "" || Number.isNaN(val)) {
    return "00";
  }
  return val;
}


const emit = defineEmits(['date-change']);


// computed processed data
const processedData = computed(() => {
  const allStatuses = new Set();
  const currencies = [];

  // step 1: collect all unique statuses from all currencies
  Object.values(props.statusWise).forEach((currencyRows) => {
    currencyRows.forEach((row) => {
      allStatuses.add(row.status);
    });
  });
  const statusesArray = Array.from(allStatuses);

  // step 2: build data per currency, aligned with all statuses
  Object.entries(props.statusWise).forEach(([currencyCode, rows]) => {
    const map = {};
    rows.forEach((row) => {
      map[row.status] = row;
    });

    const currencyRows = statusesArray.map((status) => {
      const r = map[status] || {};
      return {
        status,
        noOfTrans: formatValue(r.no_of_trans),
        transVolume: formatValue(r.trans_volume),
        agentFee: formatValue(r.agent_fee),
        companyFee: formatValue(r.company_fee),
      };
    });

    const total = {
      noOfTrans: currencyRows.reduce(
        (sum, r) => sum + (parseFloat(r.noOfTrans) || 0),
        0
      ),
      transVolume: currencyRows
        .reduce((sum, r) => sum + (parseFloat(r.transVolume) || 0), 0)
        .toFixed(2),
      agentFee: currencyRows
        .reduce((sum, r) => sum + (parseFloat(r.agentFee) || 0), 0)
        .toFixed(2),
      companyFee: currencyRows
        .reduce((sum, r) => sum + (parseFloat(r.companyFee) || 0), 0)
        .toFixed(2),
    };

    currencies.push({
      code: currencyCode,
      rows: currencyRows,
      bgColor: randomColor(),
      total,
    });
  });

  return {
    statuses: statusesArray,
    currencies,
  };
});

watch([from, to], ([newFrom, newTo]) => {
  emit('date-change', {
    from: newFrom,
    to: newTo
  });
});

</script>

<template>
  <v-card class="mt-5">
    <v-card-title class="d-md-flex align-center">
      <h4 class="text-h5 py-3">
        Transactions Summary (Status Wise Transactions)
      </h4>
      <div class="w-100 d-flex justify-end">
        <v-col cols="6" lg="4" xl="3">
          <AppDateTimePicker
            name="from"
            v-model="from"
            placeholder="dd/mm/yyyy"
            :config="{ dateFormat: 'd-m-Y' }"
          />
        </v-col>
        <v-col cols="6" lg="4" xl="3">
          <AppDateTimePicker
            name="to"
            v-model="to"
            placeholder="dd/mm/yyyy"
            :config="{ dateFormat: 'd-m-Y' }"
          />
        </v-col>
      </div>
    </v-card-title>

    <v-card-text class="px-0">
      <v-row>
        <!-- Left Status Column -->
        <v-col cols="4" sm="3" md="2">
          <v-table style="background-color: #dcf0f0">
            <thead>
              <tr>
                <th>Currency</th>
              </tr>
            </thead>
            <tbody>
            <tr><td>---------</td></tr>
              <tr
                v-for="(status, index) in processedData.statuses"
                :key="index"
              >
                <td>{{ status }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>

        <!-- Right Currency Tables -->
        <v-col cols="8 d-flex gap-3" sm="9" md="10" style="overflow-y: auto">
          <template
            v-for="(currency, idx) in processedData.currencies"
            :key="idx"
          >
            <v-col cols="11 px-0 py-0" sm="10" md="6">
              <v-table class="rounded elevation-5">
                <thead>
                <tr :style="{ backgroundColor: '#ffedbc' }">

                    <th colspan="4">{{ currency.code }}</th>
                  </tr>
                  <tr>
                    <th>No. of trans</th>
                    <th>Trans Volume</th>
                    <th>Agent Fee</th>
                    <th>Company Fee</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rowIndex) in currency.rows" :key="rowIndex">
                    <td>{{ row.noOfTrans }}</td>
                    <td>{{ row.transVolume }}</td>
                    <td>{{ row.agentFee }}</td>
                    <td>{{ row.companyFee }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <th>{{ currency.total.noOfTrans }}</th>
                    <th>{{ currency.total.transVolume }}</th>
                    <th>{{ currency.total.agentFee }}</th>
                    <th>{{ currency.total.companyFee }}</th>
                  </tr>
                </tfoot>
              </v-table>
            </v-col>
          </template>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
