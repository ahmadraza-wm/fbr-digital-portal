<script setup>
import PayerForm from '@/components/partners/PayerForm.vue'
definePageMeta({
  middleware: "auth",
  permission: "payers.create"
})
</script>

<template>
<v-card>
    <v-card-title class="border-b-sm">
       <h4 class="text-h5 py-2 px-2">Create Payer</h4>
    </v-card-title>
    <v-card-text class="py-5">
        <PayerForm :isEdit="false" />
    </v-card-text>
</v-card>

</template>
