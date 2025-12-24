<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import FlatPickr from 'vue-flatpickr-component'
import { useTheme } from 'vuetify'
import { VField, filterFieldProps, makeVFieldProps } from 'vuetify/lib/components/VField/VField'
import { VInput, makeVInputProps } from 'vuetify/lib/components/VInput/VInput'
import { filterInputAttrs } from 'vuetify/lib/util/helpers'
import { useConfigStore } from '@core/stores/config'

/* ------------------ Props ------------------ */
const props = defineProps({
  modelValue: String,
  placeholder: String,
  autofocus: Boolean,
  config: Object, // Optional: parent can override default FlatPickr config
  ...makeVInputProps({ density: 'comfortable', hideDetails: 'auto' }),
  ...makeVFieldProps({ variant: 'outlined', color: 'primary' }),
})

const emit = defineEmits(['update:modelValue', 'click:clear'])

defineOptions({ inheritAttrs: false })

/* ------------------ Setup ------------------ */
const attrs = useAttrs()
const configStore = useConfigStore()
const [rootAttrs, compAttrs] = filterInputAttrs(attrs)

const inputProps = ref(VInput.filterProps(props))
const fieldProps = ref(filterFieldProps(props))

const refFlatPicker = ref()
const isCalendarOpen = ref(false)
const { focused } = ref({ value: false }) // simple focus tracker

/* --------- 🔥 TIME PICKER CONFIG ONLY --------- */
const defaultConfig = {
  enableTime: true,
  noCalendar: true,
  dateFormat: "H:i", // 24-hour format
  time_24hr: true,
  prevArrow: '<i class="tabler-chevron-left v-icon"></i>',
  nextArrow: '<i class="tabler-chevron-right v-icon"></i>',
}

const mergedConfig = computed(() => {
  return { ...defaultConfig, ...(props.config || {}) }
})

compAttrs.config = mergedConfig.value

const onClear = e => {
  e.stopPropagation()
  emit('update:modelValue', '')
  emit('click:clear')
}

/* ---------------- Theme Handling ---------------- */
const vuetifyTheme = useTheme()
const vuetifyThemes = Object.keys(vuetifyTheme.themes.value)

const updateTheme = () => {
  if (!refFlatPicker.value?.fp?.calendarContainer) return

  vuetifyThemes.forEach(t =>
    refFlatPicker.value.fp.calendarContainer.classList.remove(`v-theme--${t}`)
  )
  refFlatPicker.value.fp.calendarContainer.classList.add(
    `v-theme--${vuetifyTheme.global.name.value}`
  )
}

watch(() => configStore.theme, updateTheme)
onMounted(updateTheme)

/* ---------------- Sync Props ---------------- */
watch(() => props, () => {
  fieldProps.value = filterFieldProps(props)
  inputProps.value = VInput.filterProps(props)
}, { deep: true })

const emitModel = val => emit('update:modelValue', val)

const elementId = computed(() => {
  const base = fieldProps.value.id || fieldProps.value.label
  return base ? `timepicker-${base}-${Math.random().toString(36).slice(2, 7)}` : undefined
})
</script>

<template>
  <div class="app-picker-field">
    <!-- Label -->
    <label v-if="fieldProps.label" class="mb-1 text-body-2" :for="elementId">
      {{ fieldProps.label }}
    </label>

    <!-- VInput wrapper -->
    <VInput v-bind="{ ...inputProps, ...rootAttrs }" :model-value="modelValue" class="position-relative v-text-field">
      <template #default="{ id, isDirty, isValid, isDisabled, isReadonly, validate }">
        
        <!-- VField wrapper -->
        <VField
          v-bind="{ ...fieldProps, label: undefined }"
          :id="id.value"
          :active="focused || isDirty.value || isCalendarOpen"
          :focused="focused || isCalendarOpen"
          :dirty="isDirty.value || props.dirty"
          :error="isValid.value === false"
          :disabled="isDisabled.value"
          @click:clear="onClear"
        >
          <template #default="{ props: vFieldProps }">
            <div v-bind="vFieldProps">
              <!-- 🔥 FlatPickr TIME PICKER -->
              <FlatPickr
                v-bind="compAttrs"
                ref="refFlatPicker"
                :model-value="modelValue"
                :placeholder="props.placeholder || 'Select Time'"
                :readonly="isReadonly.value"
                class="flat-picker-custom-style h-100 w-100"
                @update:model-value="emitModel"
                @on-open="isCalendarOpen = true"
                @on-close="() => { isCalendarOpen = false; validate() }"
              />
            </div>
          </template>

          <template #append-inner>
            <v-icon size="20" @click="refFlatPicker?.fp?.open()">
              tabler-clock-hour-4
            </v-icon>
          </template>
        </VField>
      </template>
    </VInput>
  </div>
</template>

<style scoped>
.flat-picker-custom-style input {
  cursor: pointer;
}
</style>
