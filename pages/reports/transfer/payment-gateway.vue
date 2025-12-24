<script setup>
import data from "@/views/demos/forms/tables/data-table/datatable";
const dateRange = ref(null)
const scountry = ref('all')
const rcountry = ref('all')
const smethod = ref('all')
const gateway = ref('all')
const reference = ref(null)
const code = ref(null)
const userList = ref([]);
const options = ref({
    page: 1,
    itemsPerPage: 5,
    sortBy: [""],
    sortDesc: [false],
});

const search = () => {
    userList.value = JSON.parse(JSON.stringify(data));
}

const resetFilters = () => {
    scountry.value = 'all'
    rcountry.value = 'all'
    smethod.value = 'all'
    gateway.value = 'all'
    code.value = null
    reference.value = null
    dateRange.value = null
    userList.value = []
};

const countryItem = ref([{
    title: "All",
    value: "all"
},
{
    title: "Canada",
    value: "canada"
},
{
    title: "Ireland",
    value: "ireland"
},
{
    title: "Switzerland",
    value: "switzerland"
}
])

const smethodItem = ref([{
    title: "All",
    value: "all"
},
{
    title: "Pay by Bank",
    value: "Pay by Bank"
},
{
    title: "Pay by Debit Card",
    value: "Pay by Debit Card"
},
{
    title: "Digital Wallet",
    value: "Digital Wallet"
}
])

const gatewayItem = ref([{
    title: "All",
    value: "all"
},
{
    title: "Cash (Cash)",
    value: "cash"
},
{
    title: "Paycrossv2 (PAY BY CARD (Debit/Credit))",
    value: "paycrossv2"
},
{
    title: "Open Banking (PAY BY BANK)",
    value: "open-banking"
},
{
    title: "Paycrossv2 (Paycrossv2)",
    value: "paycrossv2"
},
{
    title: "Paycrossv2 (Paycrossv2)",
    value: "paycrossv2"
},
{
    title: "Paycrossv2 (Paycrossv2)",
    value: "paycrossv2"
},
{
    title: "Paycrossv2 (Paycrossv2)",
    value: "paycrossv2"
},
{
    title: "Paycrossv2 (Paycrossv2)",
    value: "paycrossv2"
},
{
    title: "Emerchantpay (PAY BY CARD (Debit/Credit))",
    value: "emerchantpay"
},
{
    title: "Emerchantpay (PAY BY CARD (Debit/Credit))",
    value: "emerchantpay"
},
{
    title: "Emerchantpay (Emerchantpay)",
    value: "emerchantpay"
},
{
    title: "Emerchantpay (Emerchantpay)",
    value: "emerchantpay"
},
{
    title: "Emerchantpay (Emerchantpay)",
    value: "emerchantpay"
}
]);

const headers = [{
    title: "#",
    key: "sr_no",
},
{
    title: "Date",
    key: "date",
},
{
    title: "Transfer Code",
    key: "code",
},
{
    title: "Reference #",
    key: "reference",
},
{
    title: "Order #",
    key: "order",
},
{
    title: "Amount",
    key: "amount",
},
{
    title: "Sending Country",
    key: "scountry",
},
{
    title: "Receiving Country",
    key: "rcountry",
},
{
    title: "Status",
    key: "status",
},
{
    title: "Gateway Type",
    key: "type",
},
{
    title: "Gateway Name",
    key: "name",
}
];
</script>
<template>
    <v-card>
        <v-row>
            <v-col cols="12">
                <v-card-title class="border-b-sm">
                    <h4 class="text-h5 py-3">Payment Gateway Report</h4>
                </v-card-title>
            </v-col>
        </v-row>

        <v-card-text class="pt-1 my-4 pb-3">
            <v-row class="ps-0">
                <v-col cols="12" sm="6" md="3">
                    <span class="fs-15 label-color font-weight-medium">Transfer Code</span>
                    <AppTextField name="code" type="text" v-model="code" placeholder="Transfer code" autocomplete="off" />
                </v-col>
                <v-col cols="12" sm="6" md="3">
                    <span class="fs-15 label-color font-weight-medium">Sending Country</span>
                    <AppAutocomplete :items="countryItem" v-model="scountry" placeholder="Select country" />
                </v-col>
                <v-col cols="12" sm="6" md="3">
                    <span class="fs-15 label-color font-weight-medium">Receiving Country</span>
                    <AppAutocomplete :items="countryItem" v-model="rcountry" placeholder="Select country" />
                </v-col>
                <v-col cols="12" sm="6" md="3">
                    <span class="fs-15 label-color font-weight-medium">Sending Method</span>
                    <AppAutocomplete :items="smethodItem" v-model="smethod" placeholder="Select method" />
                </v-col>
                <v-col cols="12" sm="6" md="3">
                    <span class="fs-15 label-color font-weight-medium">Gateway</span>
                    <AppAutocomplete :items="gatewayItem" v-model="gateway" placeholder="Select gateway" />
                </v-col>
                <v-col cols="12" sm="6" md="3">
                    <span class="fs-15 label-color font-weight-medium">Reference #</span>
                    <AppTextField name="reference" type="text" v-model="reference" placeholder="Reference #" autocomplete="off" />
                </v-col>
                <v-col cols="12" sm="6" md="3">
                    <span class="fs-15 label-color font-weight-medium">Date Range</span>
                    <AppDateRange class="cursor-pointer" placeholder="DD/MM/YYYY" v-model="dateRange" />
                </v-col>
                <v-col cols="12 d-flex gap-2 align-end justify-start" sm="6" md="3">
                    <VBtn @click="search" type="submit" class="login-btn" variant="tonal">
                        search
                    </VBtn>
                    <VBtn @click="resetFilters" type="reset" color="secondary" variant="tonal">
                        Reset
                    </VBtn>
                </v-col>
            </v-row>
        </v-card-text>
        <VCardText class="flex-wrap gap-4 d-flex justify-space-between align-center border-t-sm">
            <div class="me-3 d-flex gap-3 pt-6">
                <span class="fs-16 pt-2">Show</span>
                <AppAutocomplete v-model="options.itemsPerPage" :items="[
                    { value: -1, title: 'All' },
                    { value: 5, title: '5' },
                    { value: 10, title: '10' },
                    { value: 25, title: '25' },
                    { value: 50, title: '50' },
                    { value: 100, title: '100' },
                ]" style="inline-size: 6.25rem;" @update:model-value="itemsPerPage = parseInt($event, 10)" />
            </div>
            <div class="gap-3 pt-6">
                <VBtn variant="elevated" color="secondary" v-if="userList.length">
                    <VIcon icon="tabler-upload" class="mr-1" />
                    Export.csv
                </VBtn>
            </div>
        </VCardText>

        <VCardText class="px-0">
            <PaginatedDataTable :headers="headers" :items="userList" :options="options" :loading="loading"
                :search="search" @update:options="options = $event">
                <template #item.date="{ item }">
                    <div class="fs-13 text-wrap">
                        03 Dec, 2024 07:21 pm
                    </div>
                </template>
                <template #item.code="{ item }">
                    <div class="fs-13 text-wrap">
                        119934023879
                    </div>
                </template>
                <template #item.reference="{ item }">
                    <div class="fs-13 text-wrap text-break">
                        48babe57fb36d13d212f05d3c39c24bc
                    </div>
                </template>
                <template #item.order="{ item }">
                    <div class="fs-13 text-wrap text-break">
                        7da60c3ca4e29579a209f08293880c08
                    </div>
                </template>
                <template #item.amount="{ item }">
                    <div class="fs-13 text-wrap">GBP 26.00</div>
                </template>
                <template #item.scountry="{ item }">
                    <div class="fs-13 text-wrap">United Kingdom</div>
                </template>
                <template #item.rcountry="{ item }">
                    <div class="fs-13 text-wrap">
                        Bangladesh
                    </div>
                </template>
                <template #item.status="{ item }">
                    <div class="fs-13 text-wrap">
                        PAI
                    </div>
                </template>
                <template #item.type="{ item }">
                    <div class="fs-13 text-wrap">
                        PAY BY CARD <br> (Debit/Credit)
                    </div>
                </template>
                <template #item.name="{ item }">
                    <div class="fs-13 text-wrap">
                        Paycrossv2
                    </div>
                </template>
                <template #bottom>
                    <VCardText class="pt-2 pb-0">
                        <div class="d-flex flex-wrap justify-space-between align-center gap-y-2 mt-2">
                            <span class="text-caption text-muted">
                                Showing
                                {{ (options.page - 1) * options.itemsPerPage + 1 }}
                                to
                                {{ Math.min(options.page * options.itemsPerPage, userList.length) }}
                                of {{ userList.length }} entries
                            </span>
                            <VPagination v-model="options.page" :total-visible="$vuetify.display.smAndDown ? 3 : 5"
                                :length="Math.ceil(userList.length / options.itemsPerPage)" />
                        </div>
                    </VCardText>
                </template>
            </PaginatedDataTable>
        </VCardText>
    </v-card>
</template>
