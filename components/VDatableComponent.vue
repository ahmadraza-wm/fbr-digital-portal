<template>
  <div>
    <VDataTable :headers="headers" :items="items" :loading="loading" :search="search" :items-per-page="-1"
      hide-default-footer>
      <template #item.sr_no="{ index }">
        {{ (props.pagination?.meta?.from || 1) + index }}
      </template>

      <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
    </VDataTable>
    <div class="d-flex justify-space-between align-center px-5 border-t-sm py-4 ">
      <div>
        Showing {{ props.pagination?.meta?.from }} to {{ props.pagination?.meta?.to }} of {{ props.pagination?.meta?.total }} entries
      </div>
      <v-pagination :model-value="pageNo" :length="pageLength" total-visible="7" @update:model-value="onPageChange" />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  headers: Array,
  items: { type: Array, default: () => [] },
  loading: Boolean,
  search: String,
  pagination: Object,
  pageNo: Number,
});
const emit = defineEmits(["update:pageNo"]);

const pageLength = computed(() => props.pagination?.meta?.last_page || 1);

const onPageChange = (newPage) => {
  emit("update:pageNo", newPage);
};

const itemsWithSrNo = computed(() => {
  const startIndex = ((props.pageNo || 1) - 1) * (props.itemsPerPage || 10);
  return props.items.map((item, index) => ({
    ...item,
    sr_no: startIndex + index + 1,
  }));
});
</script>
