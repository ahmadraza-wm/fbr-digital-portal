<script setup>
const test = ref(false);
</script>
<template>
  <VBtn @click="test = true">
    test model
  </VBtn>
  <v-dialog v-model="test" max-width="500">
    <v-card>
      <h3>Date Input</h3>
      <LazyAppDateTimePicker />

    </v-card>
  </v-dialog>

</template>
