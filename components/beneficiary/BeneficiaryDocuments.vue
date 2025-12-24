<script setup>
defineProps({
  documents: Array,
  openBackView: Function,
  openFrontView: Function,
});
</script>

<template>
    <v-card class="mt-7 px-0">
    <v-row>
      <v-col cols="12">
        <v-card-title style="background-color: lightgray">
          <h4 class="text-h4 py-3">Beneficiary Documents</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="pb-10 px-0">
      <v-table class="text-no-wrap">
        <thead>
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>Number</th>
            <th>Issuer Auth</th>
            <th>Issuance Date</th>
            <th>Expiry Date</th>
            <th>Issuance Country</th>
            <th>View</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in documents" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.number }}</td>
            <td>{{ item.issuer_authority }}</td>
            <td>{{ item.issue_date }}</td>
            <td>{{ item.expiry_date }}</td>
            <td>{{ item.country }}</td>
            <td>
               
                <template v-if="item.media && item.media.length">
                <VBtn icon @click="openFrontView(item)" class="me-2" variant="text"  v-if="item.media[0]?.url">
                  <VIcon icon="tabler-credit-card" />
                </VBtn>
                <VBtn icon @click="openBackView(item)" variant="text"  v-if="item.media[1]?.url">
                  <VIcon icon="tabler-credit-card" />
                </VBtn>
                  </template>
            </td>
           
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>


</template>



