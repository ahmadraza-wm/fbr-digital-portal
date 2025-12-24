<script setup>
const currentDate = new Date();
const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate() + 1 );
const from = ref(previousDate)
const to = ref(currentDate)
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Customer Alert Activity Export</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="5">
            <span class="fs-15 label-color font-weight-medium">From<span class="text-red">*</span></span>
            <AppDateTimePicker name="from" v-model="from" placeholder="dd/mm/yyyy" :config="{ dateFormat: 'd/m/Y' }" :rules="[requiredValidator]"/>
          </v-col>
          <v-col cols="12" sm="6" md="5">
            <span class="fs-15 label-color font-weight-medium">To<span class="text-red">*</span></span>
            <AppDateTimePicker name="to" v-model="to" placeholder="dd/mm/yyyy" :config="{ dateFormat: 'd/m/Y' }" :rules="[requiredValidator]"/>
          </v-col>
          <v-col cols="12 d-flex gap-2 pt-md-8 justify-start" sm="6" md="2">
            <VBtn type="submit" class="login-btn" variant="tonal">
              Export
            </VBtn>
          </v-col>
        </v-row>
      </VForm>
    </v-card-text>
  </v-card>
</template>
