<template>
  <div>
    <VDataTable :headers="headers" :items="items" :loading="loading" :search="search" :items-per-page="-1"
      hide-default-footer>
      <!-- Forward all slots -->
      <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>

      <!-- MAIN CUSTOM BODY -->
      <template #body="{ items, columns }">
        <template v-for="(row, i) in items" :key="'row-' + i">

          <!-- MAIN TABLE ROW -->
          <!-- MAIN TABLE ROW -->
          <tr>
            <template v-for="col in columns" :key="col.key">
              <!-- Default: normal td -->
              <td v-if="!col.rowspan">
                <slot :name="`item.${col.key}`" :item="row" :value="row[col.key]">
                  {{ row[col.key] }}
                </slot>
              </td>

              <!-- Rowspan td: parent can pass `rowspan` prop in headers or items -->
              <td v-else :rowspan="col.rowspan">
                <slot :name="`item.${col.key}`" :item="row" :value="row[col.key]">
                  {{ row[col.key] }}
                </slot>
              </td>
            </template>
          </tr>


          <!-- 🔥 CUSTOM EXTRA ROW ADDED FROM PARENT -->
          <slot name="row-extra" :item="row" :index="i" />
        </template>
      </template>
    </VDataTable>

    <!-- PAGINATION FOOTER -->
    <div class="d-flex justify-space-between align-center px-5 border-t-sm py-4">
      <div>
        Showing {{ props.pagination?.meta?.from }} to
        {{ props.pagination?.meta?.to }} of
        {{ props.pagination?.meta?.total }} entries
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
