<template>
  <div>
    <VDataTable
      class="partner-list"
      :headers="headers"
      :items="items"
      :items-per-page="options.itemsPerPage"
      :page="options.page"
      :loading="loading"
      :search="search"
      @update:page="updatePage"
      @update:items-per-page="updateItemsPerPage"
    >
      <!-- serial number -->
      <template #item.sr_no="{ index }">
        {{ (options.page - 1) * options.itemsPerPage + index + 1 }}
      </template>

      <!-- forward any custom slots -->
      <template v-for="(_, name) in $slots" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps" />
      </template>

      <!-- table footer -->
      <template #bottom>
        <VCardText class="pt-2 d-flex align-center justify-space-between">
          <div class="pt-2">
            Showing {{ startEntry }} to {{ endEntry }} of {{ total }} entries
          </div>
          <div class="d-flex flex-wrap justify-end gap-y-2 mt-2">
            <VPagination
              v-model="options.page"
              :total-visible="$vuetify.display.smAndDown ? 3 : 5"
              :length="totalPages"
              @input="updatePage"
            />
          </div>
        </VCardText>
      </template>
    </VDataTable>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  headers: Array,
  items: Array,
  options: Object,
  loading: Boolean,
  total: Number,
  search: String,
});

const emit = defineEmits(["update:options"]);

function updatePage(newPage) {
  const maxPage = totalPages.value || 1;
  const clampedPage = Math.min(Number(newPage), maxPage);

  console.log(`➡️ moving to page: ${clampedPage} / ${maxPage}`);

  emit("update:options", {
    ...props.options,
    page: clampedPage,
  });
}



function updateItemsPerPage(val) {
  const newItemsPerPage = parseInt(val, 10);
  const newTotalPages = Math.ceil(props.total / newItemsPerPage) || 1;
  emit("update:options", {
    ...props.options,
    itemsPerPage: newItemsPerPage,
    page: Math.min(1, newTotalPages),
  });
}

const startEntry = computed(() => {
  if (!props.total || props.total === 0) return 0;
  const val = (props.options.page - 1) * props.options.itemsPerPage + 1;
  console.log("Start entry:", val);
  return val;
});

const endEntry = computed(() => {
  if (!props.total || props.total === 0) return 0;
  const end = props.options.page * props.options.itemsPerPage;
  const val = end > props.total ? props.total : end;
  console.log("End entry:", val);
  return val;
});


const totalPages = computed(() => {
  if (props.backendLastPage) {
    return props.backendLastPage;
  }

  if (!props.total || props.options.itemsPerPage === 0) return 1;
  if (props.options.itemsPerPage === -1) return 1;

  return Math.ceil(props.total / props.options.itemsPerPage);
});


</script>
