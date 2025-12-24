<script setup>
import data from "@/views/demos/forms/tables/data-table/datatable";

// Dropdown Options
const score = ref([
  { title: "10", value: "10" },
  { title: "250", value: "250" },
  { title: "100", value: "100" },
]);
const desserts = [
  {
    id: "1",
    currency: "NEC Money Transfer",
    score: "100",
    type: "Individual",
    Program: "SOM",
    list: "OFAC",
    otherInfo:
      "Ali Dheere,Individual,SOM,,(Date of UN designation: 2022-02-18),,council,amendment,2022/340 (OJ L56)",
  },
  {
    id: "2",
    currency: "NEC Money Transfer",
    score: "100",
    type: "Individual",
    Program: "SOM",
    list: "OFAC",
    otherInfo:
      "Ali Dheere,Individual,SOM,,(Date of UN designation: 2022-02-18),,council,amendment,2022/340 (OJ L56)",
  },
  {
    id: "3",
    currency: "NEC Money Transfer",
    score: "100",
    type: "Individual",
    Program: "SOM",
    list: "OFAC",
    otherInfo:
      "Ali Dheere,Individual,SOM,,(Date of UN designation: 2022-02-18),,council,amendment,2022/340 (OJ L56)",
  },
];
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Sanction List</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 mt-4 mb-2 pb-6 border-b-sm">
      <VForm @submit.prevent="">
        <v-row class="ps-0">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-14 label-color font-weight-regular">Name</span>
            <AppTextField name="name" placeholder="Muhammad Usman Faiz" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-14 label-color font-weight-regular">Score</span>
            <AppAutocomplete :items="score" name="score" placeholder="80" />
          </v-col>

          <VCol cols="12" md="6" class="d-flex gap-4 align-end justify-start">
            <VBtn type="submit" class="btn-1" variant="default"> search </VBtn>
            <VBtn type="reset" color="secondary" variant="tonal"> Reset </VBtn>
            <VBtn type="reset" color="primary" variant="tonal"> Print </VBtn>
            <VBtn type="reset" color="white" class="login-btn" variant="tonal" :to="'sanction-logs'" target="_blank">
              Sanction Logs
            </VBtn>
          </VCol>
        </v-row>
      </VForm>
    </v-card-text>
    <VCardText class="px-0">
      <VTable class="text-no-wrap">
        <thead>
          <tr>
            <th>#</th>
            <th>Sanction Name</th>
            <th>Match Score</th>
            <th>Type</th>
            <th>Program(s)</th>
            <th>List</th>
            <th>Other Info</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in desserts" :key="item.dessert">
            <td>{{ item.id }}</td>
            <td>{{ item.currency }}</td>
            <td>{{ item.score }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.Program }}</td>
            <td>{{ item.list }}</td>
            <td>
              <div class="text-wrap">{{ item.otherInfo }}</div>
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </v-card>
</template>
