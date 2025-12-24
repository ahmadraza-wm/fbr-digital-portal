<script setup>
import BackNavigation from "@/@core/components/BackNavigation.vue";


const partners = ref([
  { title: "Bank Transfer", value: "bank" },
  { title: "Cash Pickup", value: "cash" },
  { title: "Mobile Wallet", value: "wallet" },
]);
const desserts = [
  {
    id: "1",
    currency: "NEC Money Transfer",
    createdBy: "Real Time",
    createdAt: "17 Dec 2024",
  },
  {
    id: "2",
    currency: "NEC Money Transfer",
    createdBy: "Real Time",
    createdAt: "17 Dec 2024",
  },
  {
    id: "3",
    currency: "NEC Money Transfer",
    createdBy: "Real Time",
    createdAt: "17 Dec 2024",
  },
];
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex align-center">
          <BackNavigation />
          <h4 class="text-h5 py-3">Payer Partner Code</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <v-row class="ps-0">
        <v-col cols="12" sm="6" md="4">
          <span class="fs-16 label-color font-weight-medium">Payer Name</span>

          <AppTextField v-model="name" name="name" Placeholder="Payer Name" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <span class="fs-13 label-color" v-html="requiredLabel('Partner')"></span>
          <AppAutocomplete v-model="selectedMethod" :items="partners" placeholder="Select Partner" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <span class="fs-13 label-color" v-html="requiredLabel('Refrence code')"></span>
          <AppAutocomplete v-model="selectedMethod" :items="partners" placeholder="Algeria" />
        </v-col>

        <VCol cols="12">
          <VBtn type="submit" variant="tonal" color="white" class="login-btn me-2"> Create Partner Code</VBtn>
          <VBtn type="reset" color="secondary" variant="tonal">
            Reset
          </VBtn>
        </VCol>
      </v-row>
    </v-card-text>
  </v-card>
  <VCard class="my-5">
    <v-card-title class="border-b-sm">
      <h4 class="text-h5 py-3">Partner Code</h4>
    </v-card-title>
    <VCardText class="px-0">
      <VTable class="text-no-wrap">
        <thead>
          <tr>
            <th>#</th>
            <th>Partner Name</th>
            <th>Reference Code</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in desserts" :key="item.dessert">
            <td>{{ item.id }}</td>
            <td>{{ item.currency }}</td>
            <td>{{ item.createdBy }}</td>
            <td>{{ item.createdAt }}</td>
            <td>
              <IconBtn>
                <NuxtLink class="menu-link" to="">
                  <VIcon icon="tabler-edit" />
                </NuxtLink>
              </IconBtn>
              <IconBtn>
                <VIcon icon="tabler-trash" />
              </IconBtn>
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>
</template>
