<template>
  <div class="relative w-full max-w-xs">
    <input ref="input" type="date" class="px-4 py-2 border rounded w-100 dialog-date" :placeholder="placeholder"
      v-bind="$attrs" :value="formattedValue"
      @input="$emit('update:modelValue', $event.target.value.split('-').reverse().join('-'))" @click="openDatePicker" />
  </div>
</template>

<style scoped>
.dialog-date {
  color: currentcolor;
  cursor: pointer;
}
</style>

<script setup>
import { ref } from 'vue';

// Props
const props = defineProps({
  modelValue: String,
  placeholder: {
    type: String,
    default: 'dd/mm/yyyy',
  },
})

const formattedValue = computed(() => {
  if (!props.modelValue) return '';

  // Agar already yyyy-mm-dd hai
  if (/^\d{4}-\d{2}-\d{2}$/.test(props.modelValue)) {
    return props.modelValue;
  }

  // Agar dd-mm-yyyy hai
  if (/^\d{2}-\d{2}-\d{4}$/.test(props.modelValue)) {
    const [dd, mm, yyyy] = props.modelValue.split('-');
    return `${yyyy}-${mm}-${dd}`;
  }

  return '';
});



// Refs
const input = ref(null)

// Methods
function openDatePicker(event) {
  const target = event.target
  if (typeof target.showPicker === 'function') {
    target.showPicker()
  }
}
</script>
