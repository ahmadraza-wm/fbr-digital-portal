<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 50,
  },
})

const emit = defineEmits(['update:modelValue'])

const internalValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    internalValue.value = newVal
  }
)

const handleUpdate = (newValue) => {
  emit('update:modelValue', newValue)
}
</script>

<template>
  <div class="d-flex mb-4">
    <div class="d-flex align-center gap-2">
      <span>Show</span>
      <AppSelect ref="selectRef" v-model="internalValue" :items="[
        { value: 50, title: '50' },
        { value: 100, title: '100' },
        { value: -1, title: 'All' },
      ]" style="inline-size: 6.25rem;" @update:model-value="handleUpdate" />
    </div>
  </div>
</template>
