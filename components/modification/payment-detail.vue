<script setup>
defineProps({
  data: {
    type: Array,

    default: () => [],
  },
  resolveStatusVariant: {
    type: Function,
    default: () => () => ({}), // fallback to avoid crash
  },
  status: {
    type: String,
    default: '',
  },
})

</script>
<template>
  <section v-for="item in data" :key="item.index">
    <v-row>
      <v-col cols="12 px-0">
        <v-card-title class="border-b-sm border-t-sm" style="background-color: #FBFAFA;">
          <h4 class="text-h5 py-3">Payment Details</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-row class="px-5 border-b-sm">
      <v-col cols="6" sm="4" md="3" class="pb-1">
        <p class="font-weight-medium text-color mb-0 lh-22">Transfer Code</p>
        <p class="font-weight-medium mb-0 lh-22 text-color1">{{ item.transaction_code }}</p>
      </v-col>
      <v-col cols="6" sm="4" md="3" class="pb-1">
        <p class="font-weight-medium text-color mb-0 lh-22">Sender</p>
        <p class="font-weight-medium mb-0 lh-22 text-color1">{{ item.customer_name }}</p>
      </v-col>
      <v-col cols="6" sm="4" md="3" class="pb-1">
        <p class="font-weight-medium text-color mb-0 lh-22">Beneficiary</p>
        <p class="font-weight-medium mb-0 lh-22 text-color1">{{ item.beneficiary_first_name }} {{ item.beneficiary_last_name }}</p>
      </v-col>
      <v-col cols="6" sm="4" md="3" class="pb-1">
        <p class="font-weight-medium text-color mb-0 lh-22">Sending Country</p>
        <p class="font-weight-medium mb-0 lh-22 text-color1">{{ item.sending_country }}</p>
      </v-col>
    </v-row>
    <v-row class="px-5 border-b-sm">
      <v-col cols="6" sm="4" md="3" class="pb-1">
        <p class="font-weight-medium text-color mb-0 lh-22">Receiving Country</p>
        <p class="font-weight-medium mb-0 lh-22 text-color1">{{ item.receiving_country }}</p>
      </v-col>
      <v-col cols="6" sm="4" md="3" class="pb-1">
        <p class="font-weight-medium text-color mb-0 lh-22">Sending Amount</p>
        <p class="font-weight-medium mb-0 lh-22 text-color1">{{ item.sending_amount }}</p>
      </v-col>
      <v-col cols="6" sm="4" md="3" class="pb-1">
        <p class="font-weight-medium text-color mb-0 lh-22">Receiving Amount</p>
        <p class="font-weight-medium mb-0 lh-22 text-color1">{{ item.receiving_amount }}</p>
      </v-col>
      <v-col cols="6" sm="4" md="3" class="pb-1">
        <p class="font-weight-medium text-color mb-0 lh-22">Agent Rate</p>
        <p class="font-weight-medium mb-0 lh-22 text-color1">{{ item.agent_rate }}</p>
      </v-col>
    </v-row>
    <v-row class="px-5 border-b-sm">
      <v-col cols="6" sm="4" md="3" class="pb-1">
        <p class="font-weight-medium text-color mb-0 lh-22">Customer Rate</p>
        <p class="font-weight-medium mb-0 lh-22 text-color1">{{ item.customer_rate }}</p>
      </v-col>
      <v-col cols="6" sm="4" md="3" class="pb-1">
        <p class="font-weight-medium text-color mb-0 lh-22">Status</p>
        <p class="font-weight-medium mb-0 lh-22 text-color1">
          <!-- <VChip :style="{
            ...resolveStatusVariant(item.status_value),
            fontSize: '12px',
            marginTop: '4px',
            marginBottom: '5px',
          }" class="font-weight-regular p-1" size="small">
            {{ resolveStatusVariant(item.status_value).text }}
          </VChip> -->
          <span :style="{
            color: resolveStatusVariant(item.status).color,
            backgroundColor: resolveStatusVariant(item.status).background,
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
          }">
            {{ resolveStatusVariant(item.status).text }}
          </span>
          

        </p>
      </v-col>
    </v-row>
  </section>
</template>
