<script setup>
import { ref } from 'vue'

const requiredValidator = (v) => !!v || "This field is required";
const name = ref('')
const dateRange = ref('')

</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Sanction Log</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text>
      <VForm @submit.prevent="">
        <v-row>
          <v-col cols="12" sm="6" md="5">
            <span class="fs-15 label-color font-weight-medium">File Name<span class="text-red">*</span></span>
            <AppTextField name="name" type="text" v-model="name" placeholder="File name" :rules="[requiredValidator]"
              autocomplete="off" />
          </v-col>
          <v-col cols="12" sm="6" md="5">
            <span class="fs-15 label-color font-weight-medium">Date Range<span class="text-red">*</span></span>
            <AppDateRange class="cursor-pointer" placeholder="DD/MM/YYYY" v-model="dateRange"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" md="2" class="d-flex gap-4 pt-md-8">
            <VBtn type="submit" variant="tonal" class="login-btn">Search</VBtn>
            <VBtn type="reset" color="secondary" variant="tonal"> Reset </VBtn>
          </v-col>
        </v-row>
      </VForm>
    </v-card-text>
    <VCardText class="px-0 pb-0">
      <v-table class="text-no-wrap">
        <thead>
          <tr>
            <th>#</th>
            <th>Sanction type</th>
            <th>Description</th>
            <th>Uploaded by</th>
            <th>Uploaded at</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="n in 4" :key="n">
            <td>0{{ n }}</td>
            <td>Individual</td>
            <td class="text-wrap">Ali Dheere,Individual,SOM,,(Date 2022-02-18),,council,,2022/340 (OJ L56)</td>
            <td>Ali Dheere</td>
            <td>2022/340 (OJ L56)</td>
          </tr>
        </tbody>
        <tbody>
        </tbody>
      </v-table>
    </VCardText>
  </v-card>
</template>
