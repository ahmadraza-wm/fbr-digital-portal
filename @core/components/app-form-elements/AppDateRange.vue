<template>
    <div class="w-full">
        <v-text-field ref="dateInputRef" v-model="model" :placeholder="placeholder"  :id="id" outlined hide-details
            readonly density="comfortable" />
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
    id: { type: String, default: 'kt_daterangepicker_4' },
    placeholder: { type: String, default: 'Pick date range' },
    modelValue: String,
});

const emit = defineEmits(['update:modelValue']);
const model = ref(props.modelValue || '');
const dateInputRef = ref(null);

watch(() => props.modelValue, (val) => {
    if (val !== model.value) model.value = val;
});

watch(model, (val) => {
    emit('update:modelValue', val);
});

onMounted(async () => {
    const waitFor = (fn) =>
        new Promise((resolve) => {
            const interval = setInterval(() => {
                if (fn()) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });

    await waitFor(() => window.$ && window.moment && window.$.fn.daterangepicker);

    const inputEl = dateInputRef.value?.$el.querySelector('input');

    if (!inputEl) return;

    const start = window.moment().subtract(29, 'days');
    const end = window.moment();

    window.$(inputEl).daterangepicker(
        {
            startDate: start,
            endDate: end,
            autoUpdateInput: false,
            locale: {
                cancelLabel: 'Clear',
            },
            ranges: {
                Today: [window.moment(), window.moment()],
                Yesterday: [window.moment().subtract(1, 'days'), window.moment().subtract(1, 'days')],
                'Last 7 Days': [window.moment().subtract(6, 'days'), window.moment()],
                'Last 30 Days': [window.moment().subtract(29, 'days'), window.moment()],
                'This Month': [window.moment().startOf('month'), window.moment().endOf('month')],
                'Last Month': [window.moment().subtract(1, 'month').startOf('month'), window.moment().subtract(1, 'month').endOf('month')],
            },
        },
        function (start, end) {
            // Format the date range as "DD-MM-YYYY"
            const val = start.format('DD-MM-YYYY') + ' - ' + end.format('DD-MM-YYYY');
            model.value = val; // Update model value
        }
    );

    window.$(inputEl).on('cancel.daterangepicker', function () {
        model.value = ''; // Reset value when cancelled
    });
});
</script>
  
