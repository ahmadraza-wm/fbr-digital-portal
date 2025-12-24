<script setup>
import { computed } from "vue";
import charges from "@images/svg/Charges.svg";
import recevied from "@images/svg/Receiving-Amount.svg";
import sending from "@images/svg/Sending-Amount.svg";
import transaction from "@images/svg/Total-Transaction.svg";

const props = defineProps({
  totalTransactions: Number,
  totalSendingAmount: Number,
  totalCharges: Number,
  totalReceivingAmount: Number,
});

const cards = computed(() => [
  { title: "Total Transaction", value: props.totalTransactions, icon: transaction },
  { title: "Total Sending Amount", value: props.totalSendingAmount, icon: sending },
  { title: "Total Charges", value: props.totalCharges, icon: charges },
  { title: "Total Receiving Amount", value: props.totalReceivingAmount, icon: recevied },
]);
</script>
<template>
    <v-card>
        <v-card-text class="d-flex justify-space-between border-e-lg flex-wrap px-1 py-5">
            <div v-for="(item, index) in cards" :key="index"
                class="info-card d-flex justify-space-between align-center py-4 px-2" :style="{
                    flex: '1 0 20%',
                    maxWidth: '20%',
                    borderRight: index < cards.length - 1 ? '1px solid #e0e0e0' : 'none',
                }">
                <div>
                    <h4 class="mb-1 text-color2 font-weight-regular fs-14">
                        {{ item.title }}
                    </h4>
                    <p class="text-h5 font-weight-semibold mb-0">{{ item.value }}</p>
                </div>
                <div class="payment-icon me-2 d-flex">
                    <component :is="item.icon" class="ma-auto" />
                </div>
            </div>
        </v-card-text>
    </v-card>
</template>
