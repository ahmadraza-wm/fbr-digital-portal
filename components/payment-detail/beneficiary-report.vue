<script setup>
import { ref, onMounted, watch } from "vue";
import { useNuxtApp } from "#app";

const props = defineProps({
  transaction_id: {
    type: [String, Number],
    required: true,
  },
});

const { $axios } = useNuxtApp();

const byName = ref([]);
const byPhone = ref([]);
const byBank = ref([]);
const loading = ref(false);

const fetchData = async () => {
  if (!props.transaction_id) return;

  loading.value = true;
  try {
    const response = await $axios.get("/transaction/beneficiary/link/report", {
      params: { transaction_id: props.transaction_id },
    });

    if (response.data?.success) {
      const data = response.data.data;
      byName.value = data.by_name || [];
      byPhone.value = data.by_phone || [];
      byBank.value = data.by_bank || [];
    }
  } catch (error) {
    console.error("Error fetching beneficiary report", error);
  } finally {
    loading.value = false;
  }
};

watch(() => props.transaction_id, fetchData, { immediate: true });
</script>

<template>
  <VCol cols="12  mb-0 pt-0 pb-0 px-0">
    <p class="text-h5 mb-0 border-b-sm ps-4 pb-2">
      Duplication by Name
      <VBadge color="primary" :content="byName.length" inline class="ms-2" />
    </p>
    <VTable class="text-no-wrap">
      <thead>
        <tr>
          <th>#</th>
          <th>Beneficiary ID</th>
          <th>Beneficiary</th>
          <th>Sender ID</th>
          <th>Sender</th>
          <th>Total Paid</th>
          <th>Total Volume</th>
        </tr>
      </thead>
      <tbody class="text-color font-weight-medium">
        <tr v-for="(item, index) in byName" :key="'name-' + index">
          <td>{{ index + 1 }}</td>
          <td>
            <NuxtLink
              :to="`/beneficiaries/view-beneficiary/${item.id}`"
              target="_blank"
              class="link-color"
            >
              {{ item.id }}
            </NuxtLink>
          </td>
          <td>
            <div class="font-weight-medium">{{ item.name }}</div>
            <div class="text-caption text-medium-emphasis">
              {{ item.country || "-" }}
            </div>
          </td>

          <td>
            <NuxtLink
              :to="`/customers/view/${item?.customer?.id}`"
              target="_blank"
              class="link-color"
            >
              {{ item?.customer?.id }}
            </NuxtLink>
          </td>
          <td>
            {{ item.customer?.user?.first_name }}
            {{ item.customer?.user?.last_name }}
          </td>
          <td>{{ item.transactions_count }}</td>
          <td>{{ item.transactions_sum }}</td>
        </tr>
        <tr v-if="!byName.length">
          <td colspan="7" class="text-center">No data</td>
        </tr>
      </tbody>
    </VTable>
  </VCol>
  <VCol cols="12  mb-0 pt-2 pb-0 px-0">
    <p class="text-h5 mb-0 border-sm ps-4 py-2">
      Duplication by Phone
      <VBadge color="primary" :content="byPhone.length" inline class="ms-2" />
    </p>

    <VTable class="text-no-wrap">
      <thead>
        <tr>
          <th>#</th>
          <th>Beneficiary ID</th>
          <th>Beneficiary</th>
          <th>Sender ID</th>
          <th>Sender</th>
          <th>Total Paid</th>
          <th>Total Volume</th>
        </tr>
      </thead>
      <tbody class="text-color font-weight-medium">
        <tr v-for="(item, index) in byPhone" :key="'phone-' + index">
          <td>{{ index + 1 }}</td>
          <td>
            <NuxtLink
              :to="`/beneficiaries/view-beneficiary/${item.id}`"
              target="_blank"
              class="link-color"
            >
              {{ item.id }}
            </NuxtLink>
          </td>
          <td>
            <div class="font-weight-medium">{{ item.name }}</div>
            <div class="text-caption text-medium-emphasis">
              {{ item.country || "-" }}
            </div>
          </td>

          <td>
            <NuxtLink
              :to="`/customers/view/${item?.customer?.id}`"
              target="_blank"
              class="link-color"
            >
              {{ item?.customer?.id }}
            </NuxtLink>
          </td>
          <td>{{ item.customer?.user?.name }}</td>
          <td>{{ item.transactions_count }}</td>
          <td>{{ item.transactions_sum }}</td>
        </tr>
        <tr v-if="!byPhone.length">
          <td colspan="7" class="text-center">No data</td>
        </tr>
      </tbody>
    </VTable>
  </VCol>
  <VCol cols="12  mb-0 pt-2 pb-0 px-0">
    <p class="text-h5 mb-0 border-sm ps-4 py-2">
      Duplication by Bank
      <VBadge color="primary" :content="byBank.length" inline class="ms-2" />
    </p>

    <VTable class="text-no-wrap">
      <thead>
        <tr>
          <th>#</th>
          <th>Beneficiary ID</th>
          <th>Beneficiary</th>
          <th>Sender ID</th>
          <th>Sender</th>
          <th>Total Paid</th>
          <th>Total Volume</th>
        </tr>
      </thead>
      <tbody class="text-color font-weight-medium">
        <tr v-for="(item, index) in byBank" :key="'bank-' + index">
          <td>{{ index + 1 }}</td>
          <td>
            <NuxtLink
              :to="`/beneficiaries/view-beneficiary/${item.id}`"
              target="_blank"
              class="link-color"
            >
              {{ item.id }}
            </NuxtLink>
          </td>
           <td>
            <div class="font-weight-medium">{{ item.name }}</div>
            <div class="text-caption text-medium-emphasis">
              {{ item.country || "-" }}
            </div>
          </td>
          <td>
            <NuxtLink
              :to="`/customers/view/${item?.customer?.id}`"
              target="_blank"
              class="link-color"
            >
              {{ item?.customer?.id }}
            </NuxtLink>
          </td>
          <td>{{ item.customer?.user?.name }}</td>
          <td>{{ item.transactions_count }}</td>
          <td>{{ item.transactions_sum }}</td>
        </tr>
        <tr v-if="!byBank.length">
          <td colspan="7" class="text-center">No data</td>
        </tr>
      </tbody>
    </VTable>
  </VCol>
</template>
