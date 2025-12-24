<script setup>
import { defineProps } from "vue";

const cusLedger = ref(false);

const props = defineProps({
  ledger: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-card-title style="background-color: lightgray">
        <h4 class="text-h4 py-3">Customer Ledger</h4>
      </v-card-title>
    </v-col>
  </v-row>
  <v-card-text class="pb-10 px-0">
    <v-table class="text-no-wrap">
      <thead>
        <tr>
          <th>Trx in days</th>
          <th>LC</th>
          <th>Trx Count</th>
          <th>Bene Count</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="ledger.length === 0">
          <td colspan="5" class="text-center">No records found</td>
        </tr>
        <tr v-for="(item, index) in ledger" :key="index">
          <td>{{ item.days }}</td>
          <td>{{ item.total_sending_amount }}</td>
          <td>{{ item.total_transactions }}</td>
          <td>{{ item.total_beneficiaries }}</td>

          <td>
            <div class="d-flex gap-1">
              <IconBtn>
                <NuxtLink class="menu-link" @click="cusLedger = true">
                  <VIcon icon="tabler-eye" />
                </NuxtLink>
              </IconBtn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card-text>

  <div class="text-center pa-4">
        <!-- Dialog -->
        <v-dialog v-model="cusLedger" max-width="1020" transition="scale-transition">
            <v-card>
                <VCardTitle class="bg-grey">
                    <h4 class="text-h4 pt-3">Transfers List of Statuses (REF,CAN,INC,PEN)</h4>
                </VCardTitle>
                <VCardText class="pt-2">
                    <v-table class="text-no-wrap">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Date</th>
                                <th>Transfer Code</th>
                                <th>Sender</th>
                                <th>Beneficiary</th>
                                <th>Amount</th>
                                <th>Partner</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in customerLedger" :key="item.id" class="py-1">
                                <td>{{ item.sr }}</td>
                                <td>{{ item.date }}<br>
                                    {{ item.time }}
                                </td>
                                <td>
                                    <div>
                                        <p class="mb-0"> {{ item.code }}
                                        </p>
                                        <VChip :color="resolveChannelVariant(item.channel).color"
                                            class="font-weight-medium me-1" size="small">
                                            {{ resolveChannelVariant(item.channel).text }}
                                        </VChip>
                                        <VChip :color="resolveStatusVariant(item.status).color"
                                            class="font-weight-medium" size="small">
                                            {{ resolveStatusVariant(item.status).text }}
                                        </VChip>
                                    </div>
                                </td>
                                <td>
                                    <p class="mb-0"> {{ item.senderCode }}
                                        <VChip :color="resolveVerifyVariant(item.verify).color"
                                            class="font-weight-medium" size="small">
                                            {{ resolveVerifyVariant(item.verify).text }}
                                        </VChip>
                                    </p>
                                    <p class="mb-0">{{ item.senderName }}</p>
                                    <p class="mb-0">{{ item.SenderBank }}</p>
                                    <p class="mb-0 fs-12 text-decoration-underline text-success">{{ item.paymentMethod
                                        }}</p>
                                </td>
                                <td>
                                    <p class="mb-0"> {{ item.senderCode }}
                                        <VChip :color="resolveVerifyVariant(item.verify).color"
                                            class="font-weight-medium" size="small">
                                            {{ resolveVerifyVariant(item.verify).text }}
                                        </VChip>
                                    </p>
                                    <p class="mb-0">{{ item.ReceiverName }}</p>
                                    <p class="mb-0">{{ item.SenderBank }}</p>
                                    <p class="mb-0 fs-12 text-decoration-underline text-success">{{ item.receivingMethod
                                        }}</p>
                                </td>
                                <td>
                                    <p class="mb-0">{{ item.sendAmount }}</p>
                                    <p class="mb-0">{{ item.rate }}</p>
                                    <p class="mb-0">{{ item.totalAmount }}</p>
                                </td>
                                <td>
                                    <p class="mb-0">{{ item.partner}}</p>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </VCardText>
            </v-card>
        </v-dialog>
    </div>

</template>


