<script setup>
import ThresholdLinks from "@/components/payment-detail/threshold-links.vue";
import { useCustomer } from "@/composables/useCustomer";

const { cusLedger, customerLedger, fetchCustomerLedger } = useCustomer();

const props = defineProps({
  headingType: {
    type: String,
    default: "ledger",
  },
  ledger: {
    type: Array,
    default: () => [],
  },
  customer_id: {
    type: [String, Number],
    required: true,
  },
});


const openLedger = (days) => {
  fetchCustomerLedger(props.customer_id, days);
    cusLedger.value = true;

};


  const resolveStatusVariant = (status) => {
        const variants = {
            incomplete: {
                color: "#FFFFFF",
                background: "#FF5733", // Bright Red
                text: "INCOMPLETE",
            },
            awaiting_funds: {
                color: "#FFFFFF",
                background: "#FF9800", // Orange
                text: "AWAITING FUNDS",
            },
            verifying_transfer: {
                color: "#FFFFFF",
                background: "#4CAF50", // Green
                text: "VERIFYING TRANSFER",
            },
            compliance_review: {
                color: "#FFFFFF",
                background: "#673AB7", // Purple
                text: "COMPLIANCE REVIEW",
            },
            compliance_held: {
                color: "#FFFFFF",
                background: "#009688", // Teal
                text: "COMPLIANCE HELD",
            },
            processing_transfer: {
                color: "#FFFFFF",
                background: "#2196F3", // Blue
                text: "PROCESSING TRANSFER",
            },
            available_for_collection: {
                color: "#FFFFFF",
                background: "#9C27B0", // Deep Purple
                text: "AVAILABLE FOR COLLECTION",
            },
            send_to_partner: {
                color: "#FFFFFF",
                background: "#795548", // Brown
                text: "SEND TO PARTNER",
            },
            paid: {
                color: "#FFFFFF",
                background: "#4CAF50", // Green
                text: "PAID",
            },
            canceled: {
                color: "#FFFFFF",
                background: "#F44336", // Red
                text: "CANCELED",
            },
            canceling: {
                color: "#FFFFFF",
                background: "#FF5722", // Deep Orange
                text: "CANCELING",
            },
            refunded: {
                color: "#FFFFFF",
                background: "#607D8B", // Blue Grey
                text: "REFUNDED",
            },
            reward_granted: {
                color: "#FFFFFF",
                background: "#198754", // Blue Grey
                text: "Reward Granted",
            },
            pending: {
                color: "#FFFFFF",
                background: "#FF5733",
                text: "Pending",
            },
        };

        return (
            variants[status] || {
                color: "#757575", // Default color (gray)
                background: "#E0E0E0", // Default background (light gray)
                text: "UNKNOWN",
            }
        );
    };

const resolveChannelVariant = (channel) => {
  if (channel === "online")
    return {
      color: "info",
      text: "Online",
    };
};

const resolveVerifyVariant = (verify) => {
  if (verify === "verified")
    return {
      color: "success",
      text: "Verified",
    };
};
</script>

<template>
  <VCard class="my-5 border">
    <VCardTitle
      class="border-b-sm bg-grey d-flex align-center justify-space-between bg-grey"
    >
      <h4 v-if="headingType === 'ledger'" class="text-h5 py-3">
        Customer Ledger
      </h4>
      <h4 v-else-if="headingType === 'threshold'" class="text-h5 py-3">
        Threshold
      </h4>
    </VCardTitle>
    <VCardText class="px-0 pb-0">
      <h1 v-if="headingType === 'threshold'" class="mb-0 text-h5 pa-4">
        Customer Ledger
      </h1>

      <VTable class="text-no-wrap" :height="ledger.length > 5 ? '310px' : '100%'" fixed-header>
        <thead>
          <tr>
            <th>Trx in days</th>
            <th>LC</th>
            <th>Trx Count</th>
            <th>Bene Count</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody class="pb-2 text-color font-weight-medium">
          <tr v-for="(item, index) in ledger" :key="index">
            <td class="text-truncate">{{ item.days }} days</td>
            <td class="text-truncate">
              {{ parseFloat(item.total_sending_amount).toFixed(2) }}
            </td>
            <td class="text-truncate">
              {{ item.total_transactions }}
            </td>
            <td class="text-truncate">
              {{ item.total_beneficiaries }}
            </td>
            <td>
              <VBtn
                icon
                variant="text"
                color="medium-emphasis"
                @click="openLedger(item.days)"
              >
                <VIcon icon="tabler-eye" />
              </VBtn>
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
    <VCardText v-if="headingType === 'threshold'">
      <ThresholdLinks />
    </VCardText>
  </VCard>

  <div class="text-center">
    <!-- Dialog -->
    <VDialog v-model="cusLedger" max-width="1140" transition="scale-transition">
      <VCard>
        <VCardTitle
          class="d-flex align-center justify-space-between border-b-sm"
        >
          <h4 class="text-h4 pt-3">Transfers List</h4>
          <IconBtn @click="cusLedger = false">
            <VIcon icon="tabler-x" />
          </IconBtn>
        </VCardTitle>
        <VCardText class="pt-2">
          <VTable class="text-no-wrap">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Transfer Code</th>
                <th>Sender</th>
                <th>Beneficiary</th>
                <th>Amount</th>
                <th>Partner</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in customerLedger" :key="item.id" class="py-1">
                <td class="text-truncate">
                  {{ item.sr }}
                </td>
                <td class="text-truncate">
                  {{ item.date }}<br />{{ item.time }}
                </td>
                <td class="text-truncate">
                  <p class="mb-0">
                    {{ item.code }}
                  </p>
                   <p class="mb-0">
                    {{ item.channel }}
                  </p>

                    <VChip
                      :style="{
                        ...resolveStatusVariant(item.status),
                        fontSize: '10px',
                        marginTop: '2px',
                      }"
                      class="font-weight-light p-1"
                      size="small"
                    >
                      {{ resolveStatusVariant(item.status).text }} 
                      
                    </VChip>



                </td>
                <td class="text-truncate">
                  <p class="mb-0">
                    <span color="red">
                      <NuxtLink to="payments/sanction" target="_blank">
                        <VIcon :icon="item.sender_sanction? 'tabler-circle-check-filled' : 'tabler-circle-x-filled'" :color="item.sender_sanction? 'success' : 'error'" size="20" />
                      </NuxtLink>
                    </span>
                  {{ item.customer_id}} -   {{ item.senderName }}
                  </p>
                  <p class="mb-0">
                    {{ item.phone }}
                  </p>
                  <p class="mb-0">
                    {{ item.SenderBank }} -   {{ item.sending_country }}
                  </p>
                

                
                </td>
                <td class="text-truncate">
                  <p class="mb-0">
                    <NuxtLink to="payments/sanction" target="_blank">
                     <VIcon :icon="item.beneficiary_sanction? 'tabler-circle-check-filled' : 'tabler-circle-x-filled'" :color="item.beneficiary_sanction? 'success' : 'error'" size="20" />
                    </NuxtLink>
                    {{ item.customer_id }} -   {{ item.beneficiary_first_name }} {{ item.beneficiary_last_name }}
                   
                  </p>
                 
                   <p class="mb-0">
                    {{ item.phone }}
                  </p>
                  <p class="mb-0 fs-12 ">
                    {{ item.receivingMethod }} -   {{ item.receiving_country }}
                  </p>
                
                </td>
                <td class="text-truncate">
                  <p class="mb-0">
                    {{ item.sendAmount }} GBP
                  </p>
                  <p class="mb-0">
                    {{ item.rate }} PKR
                  </p>
                  <p class="mb-0">
                    {{ item.totalAmount }} PKR
                  </p>
                </td>
                <td>
                  <p class="mb-0">
                    {{ item.partner }}
                  </p>
                </td>
                <td>
                  <NuxtLink :to="`/payments/detail/${item.id}`" target="_blank">
                    <VIcon icon="tabler-search"></VIcon>
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
