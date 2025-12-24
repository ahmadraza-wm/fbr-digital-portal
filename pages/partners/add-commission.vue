<script setup>
import {
    computed,
    ref,
    watch
} from "vue";

const requiredValidator = (v) => !!v || "This field is required";

const bank_mth = ref(null)
const cash_mth = ref(null)
const mw_mth = ref(null)

const partneritem = ref([{
    label: 'JS Bank File (PKR)',
    value: 1
},
{
    label: 'Test buyer (GMD)',
    value: 3
},
{
    label: 'GCC Remit (GBP)',
    value: 4
}
]);

const method = ref([{
    label: 'Select one',
    value: null
},
{
    label: 'Fixed',
    value: 'fixed'
},
{
    label: 'Percentage',
    value: 'percentage'
},
]);

const masterCountries = [{
    label: 'United Kingdom',
    value: 'united kingdom'
},
{
    label: 'Ireland',
    value: 'ireland'
},
{
    label: 'Canada',
    value: 'canada'
},
];

const bank_amt = ref('');
const cash_amt = ref('');
const mw_amt = ref('');

const partner = ref(null);
const country = ref(null);
const countryOptions = ref([]);
const loading = ref(false);

watch(partner, (newVal) => {
    country.value = null;

    switch (newVal) {
        case 1:
            countryOptions.value = masterCountries.filter(c => ['united kingdom', 'canada'].includes(c
                .value));
            break;
        case 3:
            countryOptions.value = masterCountries.filter(c => c.value === 'ireland');
            break;
        case 4:
            countryOptions.value = masterCountries.filter(c => ['canada', 'ireland'].includes(c.value));
            break;
        default:
            countryOptions.value = [];
    }
});

const showDiv1 = computed(() => [1, 3, 4].includes(partner.value));
const showDiv2 = computed(() => [1, 3].includes(partner.value));
const showDiv3 = computed(() => [3, 4].includes(partner.value));

const isBankAmtDisabled = computed(() => !bank_mth.value);
const isCashAmtDisabled = computed(() => !cash_mth.value);
const isMWAmtDisabled = computed(() => !mw_mth.value);

const submitForm = () => {
    if (partner.value && country.value && !bank_amt.value && !cash_amt.value && !mw_amt.value) {
        alert("At least one commission amount is required.");
        return;
    }
};
</script>

<template>
    <v-card>
        <v-row>
            <v-col cols="12">
                <v-card-title class="border-b-sm d-flex align-center" style="background-color: lightgrey;">
                    <div class="d-flex align-center">
                        <BackNavigation />
                        <h4 class="text-h5 py-3">Add Partner Commission</h4>
                    </div>
                </v-card-title>
                <VForm @submit.prevent="submitForm">
                    <v-card-text class="px-4 pt-4">
                        <VRow>
                            <VCol cols="12" md="6">
                                <span class="fs-15 label-color font-weight-medium">Partner<span
                                        class="text-red">*</span></span>
                                <AppAutocomplete :items="partneritem" v-model="partner" item-title="label"
                                    item-value="value" placeholder="Choose partner" :rules="[requiredValidator]" />
                            </VCol>

                            <VCol cols="12" md="6">
                                <span class="fs-15 label-color font-weight-medium">Country<span
                                        class="text-red">*</span></span>
                                <AppAutocomplete :items="countryOptions" v-model="country" placeholder="Choose country"
                                    item-title="label" item-value="value" :rules="[requiredValidator]" />
                            </VCol>
                        </VRow>
                    </v-card-text>
                    <v-card-text class="px-0" v-if="showDiv1">
                        <VRow class="bg-grey">
                            <VCol cols="12" class="mx-4 font-weight-bold">
                                <h3 class="mb-0">Bank</h3>
                            </VCol>
                        </VRow>
                        <VRow class="px-4">
                            <VCol cols="12" md="6">
                                <span class="fs-15 label-color font-weight-medium">Method</span>
                                <AppAutocomplete :items="method" v-model="bank_mth" item-title="label"
                                    item-value="value" placeholder="Choose method" />
                            </VCol>
                            <VCol cols="12" md="6">
                                <span class="fs-15 label-color font-weight-medium">Commission Amount</span>
                                <AppTextField name="amount" v-model="bank_amt" placeholder="Commission amount"
                                    :disabled="isBankAmtDisabled"
                                    :rules="!isBankAmtDisabled ? [requiredValidator] : []" autocomplete="off" />
                            </VCol>
                        </VRow>
                    </v-card-text>
                    <v-card-text class="px-0" v-if="showDiv2">
                        <VRow class="bg-grey">
                            <VCol cols="12" class="mx-4 font-weight-bold">
                                <h3 class="mb-0">Cash</h3>
                            </VCol>
                        </VRow>
                        <VRow class="px-4">
                            <VCol cols="12" md="6">
                                <span class="fs-15 label-color font-weight-medium">Method</span>
                                <AppAutocomplete :items="method" v-model="cash_mth" item-title="label"
                                    item-value="value" placeholder="Choose method" />
                            </VCol>
                            <VCol cols="12" md="6">
                                <span class="fs-15 label-color font-weight-medium">Commission Amount</span>
                                <AppTextField name="amount" v-model="cash_amt" placeholder="Commission amount"
                                    :disabled="isCashAmtDisabled"
                                    :rules="!isCashAmtDisabled ? [requiredValidator] : []" autocomplete="off" />
                            </VCol>
                        </VRow>
                    </v-card-text>
                    <v-card-text class="px-0" v-if="showDiv3">
                        <VRow class="bg-grey">
                            <VCol cols="12" class="mx-4 font-weight-bold">
                                <h3 class="mb-0">Mobile Wallet</h3>
                            </VCol>
                        </VRow>
                        <VRow class="px-4">
                            <VCol cols="12" md="6">
                                <span class="fs-15 label-color font-weight-medium">Method</span>
                                <AppAutocomplete :items="method" v-model="mw_mth" item-title="label" item-value="value"
                                    placeholder="Choose method" />
                            </VCol>
                            <VCol cols="12" md="6">
                                <span class="fs-15 label-color font-weight-medium">Commission Amount</span>
                                <AppTextField name="amount" v-model="mw_amt" placeholder="Commission amount"
                                    :disabled="isMWAmtDisabled" :rules="!isMWAmtDisabled ? [requiredValidator] : []" autocomplete="off" />
                            </VCol>
                        </VRow>
                    </v-card-text>
                    <v-card-text class="px-4 pt-4">
                        <VRow>
                            <VCol cols="12" class="d-flex justify-end gap-4">
                                <VBtn type="reset" color="secondary" variant="tonal"> Reset </VBtn>
                                  <VBtn type="submit" variant="tonal" class="login-btn" :loading="loading">
                                    Add Entry
                                </VBtn>
                            </VCol>
                        </VRow>
                    </v-card-text>
                </VForm>
            </v-col>
        </v-row>
    </v-card>

</template>
