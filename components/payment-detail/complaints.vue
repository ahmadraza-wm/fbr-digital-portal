<script setup>
const props = defineProps({
  complaints: {
    type: Array,
    default: () => []
  }
});

const showTable = ref(false);

const toggleTable = () => {
  showTable.value = !showTable.value;
};
</script>

<template>
  <VCard class="my-5 border">
    <v-card-title class="border-b-sm bg-grey d-flex align-center justify-space-between bg-grey">
      <h4 class="text-h5 py-3">Complaints</h4>
      <VBtn :color="showTable ? 'error' : 'primary'" variant="elevated" @click="toggleTable">
        {{ showTable ? 'Hide Complaints' : 'Show Complaints' }}
      </VBtn>
    </v-card-title>

    <VCardText class="px-0 pb-0" v-if="showTable">
      <VTable class="text-no-wrap">
        <thead>
          <tr>
            <th>#</th>
            <th>Category</th>
            <th>Description</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody class="pb-2 text-color font-weight-medium">
          <tr v-for="(complaint, index) in complaints" :key="complaint.id">
            <td>{{ index + 1 }}</td>
            <td>{{ complaint.type }}</td>
            <td>{{ complaint.description }}</td>
            <td>
              <VChip :color="complaint.status === 'closed' ? 'success' : 'warning'">
                {{ complaint.status }}
              </VChip>
            </td>
            <td>{{ complaint.created_at }}</td>
          </tr>
          <tr v-if="!complaints.length">
            <td colspan="5" class="text-center">No complaints found</td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>
  <!--Sender Add Document  pop up design by usman faiz -->
  <div class="text-center">
    <!-- Dialog -->
    <v-dialog v-model="supportRemarks" max-width="600" transition="scale-transition">
      <v-card>
        <v-row>
          <v-col cols="12">
            <v-card-title class="d-flex align-center border-b-sm justify-space-between">
              <h4 class="text-h4 py-3">Add Support Remarks

              </h4>
              <IconBtn @click="supportRemarks = false">
                <VIcon icon="tabler-x" />
              </IconBtn>
            </v-card-title>
          </v-col>
        </v-row>
        <V-card-text class="pt-2">
          <VForm @submit.prevent="">
            <v-row class="ps-0 mt-0">

              <v-col cols="12" sm="12" md="12">
                <span class="fs-15 label-color font-weight-medium" v-html="requiredLabel('Remarks')"></span>
                <AppTextField name="supportRemarks" Placeholder="Support Remarks" />
              </v-col>


              <VCol cols="12" md="12" class="d-flex gap-2 align-end justify-start">
                <VBtn type="submit" color="primary" variant="elevated">
                  Add Support Remarks
                </VBtn>
                <VBtn type="reset" color="secondary" variant="tonal">
                  Reset
                </VBtn>
              </VCol>
            </v-row>
          </VForm>
        </V-card-text>
      </v-card>
    </v-dialog>
  </div>



</template>
