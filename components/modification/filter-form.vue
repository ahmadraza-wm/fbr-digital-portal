<script setup>
import { ref, defineEmits, defineExpose } from 'vue'
const props = defineProps({
  statusType: {
    type: String,
    default: 'changeStatus',
  },
})
const emit = defineEmits(['search', 'reset'])

const code = ref(null)
const invoice = ref(null)

defineExpose({ code, invoice })

const emitSearch = () => {
  emit('search', {
    code: code.value, invoice: invoice.value, status: props.statusType,
  })
}

const emitReset = () => {
  code.value = null
  invoice.value = null
  emit('reset')
}
</script>

<template>
  <VForm @submit.prevent="">
    <v-row class="ps-0">
      <v-col cols="12" sm="6" md="4">
        <span class="fs-15 label-color font-weight-medium">Invoice #</span>
        <AppTextField name="invoice"  v-model="invoice" placeholder="*******" autocomplete="off"/>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <span class="fs-15 label-color font-weight-medium">Transfer Code</span>
        <AppTextField name="code" type="text" v-model="code" placeholder="Transfer code" autocomplete="off" />
      </v-col>
      <v-col cols="12 d-flex gap-2 align-end justify-start" sm="6" md="4">
        <VBtn @click="emitSearch" type="submit" class="login-btn" variant="tonal">Search</VBtn>
        <VBtn @click="emitReset" type="reset" color="secondary" variant="tonal">Reset</VBtn>
      </v-col>
    </v-row>
  </VForm>
</template>
