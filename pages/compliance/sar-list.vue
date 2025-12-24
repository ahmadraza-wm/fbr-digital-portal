<script setup>
import { ref } from 'vue'

const requiredValidator = (v) => !!v || "This field is required";
const from = ref(null)
const to = ref(null)

const resetForm = () => {
  from.value = null
  to.value = null
}

</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">SAR List</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text>
      <VForm @submit.prevent="">
        <v-row>
          <v-col cols="12" md="5">
            <span class="fs-13 label-color">From<span class="text-red">*</span></span>
            <AppDateTimePicker name="startdate" v-model="from" :rules="[requiredValidator]"
              placeholder="dd/mm/yyyy" :config="{ dateFormat: 'd/m/Y' }" />
          </v-col>
          <v-col cols="12" md="5">
            <span class="fs-13 label-color">To<span class="text-red">*</span></span>
            <AppDateTimePicker name="enddate" v-model="to" :rules="[requiredValidator]" placeholder="dd/mm/yyyy"
              :config="{ dateFormat: 'd/m/Y' }" />
          </v-col>

          <v-col cols="12" md="2" class="d-flex gap-2 mt-md-6">
            <VBtn type="submit" variant="tonal" class="login-btn">Search</VBtn>
            <VBtn type="reset" color="secondary" variant="tonal" @click="resetForm" > Reset </VBtn>
          </v-col>
        </v-row>
      </VForm>
    </v-card-text>
    <VCardText class="px-0 pb-0 border-t-sm">
      <v-table class="text-no-wrap">
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Agent</th>
            <th>Payment #</th>
            <th>Customer ID</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="n in 4" :key="n">
            <td>0{{ n }}</td>
            <td>26-Jul-2023</td>
            <td>Glasgow BR</td>
            <td>RA842978</td>
            <td>330</td>
            <td class="text-wrap">Submission Date: 26-07-2023; SAR Ref #: 1799900; Unique Ref #:8355742; Reason: Proof of address</td>
          </tr>
        </tbody>
        <tbody>
        </tbody>
      </v-table>
    </VCardText>
  </v-card>
</template>
