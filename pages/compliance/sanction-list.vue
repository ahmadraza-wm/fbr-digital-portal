<script setup>
import { ref,onMounted } from 'vue'
import { useSanctionlist } from "@/composables/useSanctionlist";
import Compliance from '../payments/compliance.vue';
import Sanction from '../payments/sanction.vue';
definePageMeta({
  middleware: "auth",
  permission: "compliance.sanction.list"
})
const requiredValidator = (v) => !!v || "This field is required";
const showdata = ref(false)

const route = useRoute()

const filterData = ref({

    name:'',
    score:'80'

  
   });

const {
  sanctionlists,
  filterSanctionlist
} = useSanctionlist();  
  

onMounted(() => {
  if (route.query.name) {
    filterData.value.name = route.query.name
  }
})

const search = async () => {

  const plainFilters = { ...filterData.value };

  await filterSanctionlist(plainFilters); 

  showdata.value = true;

};

const resetForm = () => {
  filterData.value = { 
  name: "",
  score:"",

  };
  showdata.value = false

}

const printPage = () => {
  window.print()
}



const options = ref({
  itemsPerPage: 5,
  page: 1,
});



const headers = ref([
  { title: "#", key: "sr_no" },
  { title: "Sanction Name", key: "name" },
  { title: "Match Score", key: "score" },
  { title: "Type", key: "type" },
  { title: "Program(s)", key: "sanction_type" },
  { title: "List", key: "list" },
  { title: "Other Info", key: "description" },
]);



</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex justify-space-between align-center">
          <h4 class="text-h5 py-3">Sanction List</h4>
          <div>
            <VBtn variant="tonal" color="secondary" class="mr-2" @click="printPage">Print</VBtn>
            <VBtn variant="elevated" class="primary" :to="`/compliance/sanction-log`" target="_blank">Sanction Logs</VBtn>
          </div>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Name<span class="text-red">*</span></span>
            <AppTextField name="name" type="text" v-model="filterData.name" placeholder="Name" :rules="[requiredValidator]" autocomplete="off" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-15 label-color font-weight-medium">Score<span class="text-red">*</span></span>
            <AppTextField name="score" type="number" v-model="filterData.score" placeholder="Score" :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" md="3" class="d-flex gap-4 pt-md-8">
            <VBtn @click="search" type="submit" variant="tonal" class="login-btn">Search</VBtn>
            <VBtn  @click="resetForm"  type="reset" color="secondary" variant="tonal" > Reset </VBtn>
          </v-col>
        </v-row>
    </v-card-text>
      <VCardText class="d-flex flex-wrap gap-4 border-t-sm pb-2" v-if="showdata">
      <div class="me-3 d-flex gap-3 mt-5">
        <ItemsPerPageSelector
          v-model="options.itemsPerPage"
          @update:model-value="updateItemsPerPage"
        />
      </div>
      <VSpacer />

    
    </VCardText>

    <VCardText class="px-0">
      <PaginatedDataTable v-if="showdata"
        :headers="headers"
        :items="sanctionlists"
        :options="options"
        :loading="loading"
        :search="search"
        @update:options="options = $event"
      >
        <!-- Forward the custom slot templates -->
        <template #item.status="{ item }">
          <VChip
            :color="resolveStatusVariant(item.status).color"
            class="font-weight-medium"
            size="small"
          >
            {{ resolveStatusVariant(item.status).text }}
          </VChip>
        </template>

       
      </PaginatedDataTable>
    </VCardText>
   
  </v-card>
</template>
