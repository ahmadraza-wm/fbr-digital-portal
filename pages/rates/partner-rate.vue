<script setup>
import data from '@/views/demos/forms/tables/data-table/datatable';

const userList = ref([]);
const selectedPartner = ref(null);
const selectedMode = ref(null);

const partners = ref([
    { title: 'GCC Remit', value: 'GCC Remit' },
    { title: 'PAK Remit', value: 'PAK' },
    { title: 'Ireland', value: 'IE' },
]);
const options = ref({
    page: 1,
    itemsPerPage: 5,
    sortBy: [''],
    sortDesc: [false],
})

const headers = [
    {
        title: 'pay out country',
        key: 'city',
    },
    {
        title: 'Currency',
        key: 'city',
    },
    {
        title: 'Partner',
        key: 'fullName',
    },
    {
        title: 'Prefix',
        key: 'city',
    },
    {
        title: 'Mode',
        key: 'city',
    },
    {
        title: 'Cost Rate',
        key: 'city',
    },
    {
        title: 'Customer Rate',
        key: 'city',
    },

]


onMounted(() => {
    userList.value = JSON.parse(JSON.stringify(data))
})
</script>

<template>
    <v-card>
        <v-row>
            <v-col cols="12">
                <v-card-title style="background-color: lightgrey;">
                    <h4 class="text-h5 py-3">Search Partners Rate From API</h4>

                </v-card-title>
            </v-col>
        </v-row>
        <v-divider></v-divider>

        <v-card-text class="pt-1 my-4 pb-3">
            <VForm @submit.prevent="() => { }">

                <v-row class="ps-0">
                    <v-col cols="12" sm="10" md="10" class="ps-1">
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <span class="fs-15 label-color">Partner</span>
                                <AppAutocomplete name="partner" v-model="selectedPartner" :items="partners"
                                    placeholder="GCC Remit" autocomplete="off"/>
                            </v-col>

                            <v-col cols="12" sm="6" md="4">
                                <span class="fs-15 label-color">Iso2 Code</span>
                                <AppTextField type="text" name="iso2Code" v-model="code" placeholder="******" autocomplete="off"/>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <span class="fs-15 label-color">Mode</span>
                                <AppAutocomplete name="partner" v-model="selectedMode" :items="partners"
                                    placeholder="Choose" autocomplete="off"/>
                            </v-col>

                        </v-row>
                    </v-col>
                    <VCol cols="12 d-flex gap-2 align-end" sm="10" md="2">
                        <VBtn type="submit" variant="tonal" color="white" class="login-btn">
                            Search
                        </VBtn>
                        <VBtn type="reset " color="secondary" variant="tonal">
                            Reset
                        </VBtn>



                    </VCol>
                </v-row>
            </VForm>
        </v-card-text>


        <VCardText class="px-0 mt-2">
            <VDataTable class="partner-list" :headers="headers" :items="userList" :items-per-page="options.itemsPerPage"
                :page="options.page" :options="options">

                <template #bottom>
                    <VCardText class="pt-2">
                        <div class="d-flex flex-wrap justify-end gap-y-2 mt-2">

                            <VPagination v-model="options.page" :total-visible="$vuetify.display.smAndDown ? 3 : 5"
                                :length="Math.ceil(userList.length / options.itemsPerPage)" />
                        </div>

                    </VCardText>
                </template>
            </VDataTable>
        </VCardText>

    </v-card>
</template>
