<script setup>
import BackNavigation from "@/@core/components/BackNavigation.vue";
import data from "@/views/demos/forms/tables/data-table/datatable";


const userList = ref([]);
const country = ref([
    { title: "PAK", value: "PAK" },
    { title: "UAE", value: "UAE" },
    { title: "IR", value: "IR" },
]);
const options = ref({
    page: 1,
    itemsPerPage: 5,
    sortBy: [""],
    sortDesc: [false],
});

const desserts = [
    {
        id: "1",
        name: "Roze Remit",
        payerName: "NEC Money Transfer",
        addedBy: "Muhammad Usman Faiz",
        createdAt: "17 Dec 2024",
    },
    {
        id: "2",
        name: "Roze Remit",
        payerName: "NEC Money Transfer",
        addedBy: "Muhammad Usman Faiz",
        createdAt: "17 Dec 2024",
    },
    {
        id: "3",
        name: "Roze Remit",
        payerName: "NEC Money Transfer",
        addedBy: "Muhammad Usman Faiz",
        createdAt: "17 Dec 2024",
    },
];

const resolveStatusVariant = (status) => {
    if (status === 1)
        return {
            color: "primary",
            text: "Wallat Name   nagad",
        };
    else if (status === 2)
        return {
            color: "success",
            text: "Wallat Name   BBLM",
        };
    else if (status === 3)
        return {
            color: "secondary",
            text: "Wallat Name   NAGAD",
        };
    else if (status === 4)
        return {
            color: "warning",
            text: "Resigned",
        };
    else
        return {
            color: "info",
            text: "Applied",
        };
};

onMounted(() => {
    userList.value = JSON.parse(JSON.stringify(data));
});
</script>

<template>
    <v-card>
        <v-row>
            <v-col cols="12">
                <v-card-title class="d-flex align-center bg-grey">
                    <BackNavigation />

                    <h4 class="text-h5 py-3">Wallet Payer</h4>
                </v-card-title>
            </v-col>
        </v-row>
        <v-divider></v-divider>

        <v-card-text class="pt-1 my-4 pb-3">
            <VForm @submit.prevent="() => { }">

                <v-row class="ps-0">

                    <VCol cols="12" sm="6" md="6">
                        <span class="fs-13 label-color" v-html="requiredLabel('Country')"></span>
                        <AppAutocomplete :items="country" placeholder="Select Country" :rules="[requiredValidator]" />
                    </VCol>
                    <v-col cols="12" sm="6" md="6">
                        <span class="fs-13 label-color" v-html="requiredLabel('Wallet')"></span>

                        <AppAutocomplete :items="country" placeholder="Select Wallet" :rules="[requiredValidator]" />
                    </v-col>
                </v-row>
                <v-row class="ps-0">

                    <VCol cols="12" sm="6" md="6">
                        <span class="fs-13 label-color" v-html="requiredLabel('Company Name')"></span>
                        <AppAutocomplete :items="country" placeholder="Company Name" :rules="[requiredValidator]" />
                    </VCol>
                    <v-col cols="12" sm="6" md="6">
                        <span class="fs-13 label-color" v-html="requiredLabel('Payer')"></span>

                        <AppAutocomplete :items="country" placeholder="Payer" :rules="[requiredValidator]" />
                    </v-col>

                    <VCol cols="12 d-flex gap-2 align-end justify-end">
                        <VBtn type="reset" variant="tonal" color="">Reset</VBtn>
                        <VBtn type="submit" variant="tonal" class="login-btn">
                            Create Payer
                        </VBtn>
                    </VCol>
                </v-row>
            </VForm>
        </v-card-text>
        <VCardText class="bg-grey pb-3">
            <v-row class="bg-grey py-0">
                <v-col cols="12 py-0">
                    <v-card-title class="px-0">
                        <h4 class="text-h5 py-2">Country Wallets</h4>
                    </v-card-title>
                </v-col>
            </v-row>
        </VCardText>
        <VCardText class="px-0">
            <VTable class="text-no-wrap">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Company Name</th>
                        <th>Payer Name</th>
                        <th>Added By</th>
                        <th>Created At</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="item in desserts" :key="item.dessert">
                        <td>{{ item.id }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.payerName }}</td>
                        <td>{{ item.addedBy }}</td>
                        <td>{{ item.createdAt }}</td>
                        <td>
                            <div class="d-flex gap-1">
                                <IconBtn>
                                    <VIcon icon="tabler-trash" />
                                </IconBtn>
                            </div>
                        </td>

                    </tr>
                </tbody>
            </VTable>
        </VCardText>
    </v-card>
</template>
