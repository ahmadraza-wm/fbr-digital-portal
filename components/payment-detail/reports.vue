<script setup>
import { ref, watch, nextTick } from "vue";
import { useNuxtApp } from "#app";
import BeneficiaryReports from "@/components/payment-detail/beneficiary-report.vue";
import StatusTracker from "@/components/payment-detail/status-tracker.vue";
const permissionStore = usePermissionStore()
const props = defineProps({
  transaction_id: {
    type: [String, Number],
    required: true,
  },
});

const { $axios } = useNuxtApp();

const currentTab = ref("tab-1");
const beneficiaryLinks = ref([]);
const loading = ref(false);
const statusHistory = ref([]);


const fetchBeneficiaryReport = async () => {
  if (!props.transaction_id) return;

  loading.value = true;
  try {
    const response = await $axios.get("/transaction/sender/link/report", {
      params: {
        transaction_id: props.transaction_id,
      },
    });

    if (response.data?.success) {
      beneficiaryLinks.value = response.data.data || [];
    }
  } catch (error) {
    console.error("Failed to fetch beneficiary report", error);
  } finally {
    loading.value = false;
  }
};

const reportCounts = ref({ byName: 0, byPhone: 0, byBank: 0, statusTracker: 0 });

const fetchBeneficiaryCounts = async () => {
  try {
    const res = await $axios.get("/transaction/beneficiary/link/report", {
      params: { transaction_id: props.transaction_id },
    });

   const statusResponses = await $axios.get(
      `/transactions/status/tracker/${props.transaction_id}`
    );
    if (statusResponses.data?.success) {
      statusHistory.value = statusResponses.data.data.status_histories || [];
    }
    if (res.data?.success) {
      const data = res.data.data;
      reportCounts.value = {
        byName: (data.by_name || []).length,
        byPhone: (data.by_phone || []).length,
        byBank: (data.by_bank || []).length,
      };
    }
  } catch (error) {
    console.error("Error fetching report counts", error);
  }
};

const handleReportCounts = (counts) => {
  reportCounts.value = counts;
};

watch(
  () => props.transaction_id,
  async (newVal) => {
    if (newVal) {
      await nextTick(); // Wait until DOM is ready
      fetchBeneficiaryReport();
      fetchBeneficiaryCounts();
    }
  },
  { immediate: true }
);
</script>

<template>
  <VCard class="my-5">
    <VTabs v-model="currentTab" class="v-tabs-pill bg-grey pt-8 px-8" color="primary">
      <VTab value="tab-1" prepend-icon="tabler-link" v-if="permissionStore.hasPermission('sender_link_report')"
        >Sender Link Report
        <VBadge color="warning" :content="beneficiaryLinks.length" inline class="ms-2"
      /></VTab>
      <VTab value="tab-2" prepend-icon="tabler-link"  v-if="permissionStore.hasPermission('beneficiary_link_report')">
        Beneficiary Link Report

        <VBadge
          color="warning"
          :content="reportCounts.byName"
          inline
          class="ms-2"
          title="By Name"
        />
        <VBadge
          color="secondary"
          :content="reportCounts.byPhone"
          inline
          class="ms-2"
          title="By Phone"
        />
        <VBadge
          color="success"
          :content="reportCounts.byBank"
          inline
          class="ms-2"
          title="By Bank"
        />
      </VTab>
      <VTab value="tab-3" prepend-icon="tabler-link">Card Link Report</VTab>
      <VTab value="tab-4" prepend-icon="tabler-link" v-if="permissionStore.hasPermission('get_status_durations')">Status Tracker <VBadge color="warning" :content="statusHistory.length" inline class="ms-2"
      /></VTab>
    </VTabs>

    <VCardText class="px-0">
      <VWindow v-model="currentTab">
        <VWindowItem value="tab-1" class="" v-if="permissionStore.hasPermission('sender_link_report')">
          <VCol cols="12  mb-0 pt-0 pb-0 px-0">
            <p class="text-h5 mb-0 border-b-sm ps-4 pb-2">Sender link report</p>
            <div v-if="loading" class="text-center my-4">
              <VProgressCircular indeterminate color="primary" />
            </div>

            <VTable class="text-no-wrap" v-if="!loading">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer Id</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>DOB</th>
                  <th>Postal Code</th>
                  <th>No. of Payments</th>
                  <th>Total Volume</th>
                  <th>Phone</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody class="text-color font-weight-medium">
                <tr v-for="(entry, index) in beneficiaryLinks" :key="entry.id">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <NuxtLink
                      :to="`/customers/view/${entry?.id}`"
                      class="link-color"
                      target="_blank"
                    >
                      {{ entry?.id }}
                    </NuxtLink>
                  </td>
                  <td>{{ entry?.user?.first_name }}</td>
                  <td>{{ entry?.user?.last_name }}</td>
                  <td>{{ entry?.customer_detail?.dob }}</td>
                  <td>{{ entry?.customer_detail?.postal_code }}</td>
                  <td>{{ entry.transactions_count }}</td>
                  <td>{{ entry.transactions_sum }}</td>
                  <td>{{ entry.phone_number }}</td>
                  <td>{{ entry?.customer_detail?.address }}</td>
                </tr>
                <tr v-if="!beneficiaryLinks.length">
                  <td colspan="10" class="text-center text-grey">No data available.</td>
                </tr>
              </tbody>
            </VTable>
          </VCol>
        </VWindowItem>
        <VWindowItem value="tab-2"  v-if="permissionStore.hasPermission('beneficiary_link_report')">
          <BeneficiaryReports :transaction_id="props.transaction_id" />
        </VWindowItem>
        <VWindowItem value="tab-3">
          <CardReports />
        </VWindowItem>
        <VWindowItem value="tab-4" v-if="permissionStore.hasPermission('get_status_durations')">
          <StatusTracker :transaction_id="props.transaction_id" />
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCard>
</template>
