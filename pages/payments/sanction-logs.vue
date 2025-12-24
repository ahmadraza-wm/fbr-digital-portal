<script setup>

// Dropdown Options
const score = ref([
    { title: "10", value: "10" },
    { title: "250", value: "250" },
    { title: "100", value: "100" },
]);
const desserts = [
    {
        id: "1",
        type: "Individual",
        otherInfo:
            "Ali Dheere,Individual,SOM,,(Date of UN designation: 2022-02-18),,council,amendment,2022/340 (OJ L56)",
        uploadedBy: "Muhammad Usman Faiz",
        uploadedAt: "2022/340 (OJ L56)"
        },
    {
        id: "2",
        currency: "NEC Money Transfer",
        type: "Individual",
 otherInfo:
            "Ali Dheere,Individual,SOM,,(Date of UN designation: 2022-02-18),,council,amendment,2022/340 (OJ L56)",
        uploadedBy: "Muhammad Usman Faiz",
        uploadedAt: "2022/340 (OJ L56)"
        },
    {
        id: "3",
        score: "100",
        type: "Individual",
        otherInfo:
            "Ali Dheere,Individual,SOM,,(Date of UN designation: 2022-02-18),,council,amendment,2022/340 (OJ L56)",
        uploadedBy: "Muhammad Usman Faiz",
        uploadedAt: "2022/340 (OJ L56)"
        },
];
</script>

<template>
    <v-card>
        <v-row>
            <v-col cols="12">
                <v-card-title class="border-b-sm">
                    <h4 class="text-h5 py-3">Sanction Logs</h4>
                </v-card-title>
            </v-col>
        </v-row>

        <v-card-text class="pt-1 mt-4 mb-2 pb-6 border-b-sm">
            <VForm @submit.prevent="">
                <v-row class="ps-0">
                    <V-col cols="12" md="9">
                        <v-row> <v-col cols="12" sm="6" md="6">
                                <span class="fs-14 label-color font-weight-regular">Full Name</span>
                                <AppTextField name="name" placeholder="Muhammad Usman Faiz" />
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <span class="fs-14 label-color font-weight-regular">Date Range</span>
                                <AppDateTimePicker placeholder="DD/MM/YYYY"
                                    :config="{ mode: 'range', dateFormat: 'd-F-Y' }" />
                            </v-col>
                        </v-row>
                    </V-col>

                    <VCol cols="12" md="3" class="d-flex gap-4 align-end justify-start">
                        <VBtn type="submit" color="secoondary" variant="tonal"> search </VBtn>
                        <VBtn type="reset" color="white" class="login-btn" variant="tonal"> Reset </VBtn>

                    </VCol>
                </v-row>
            </VForm>
        </v-card-text>
        <VCardText class="px-0">
            <VTable class="text-no-wrap">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Sanction type</th>
                        <th>Description</th>
                        <th>Uploaded by</th>
                        <th>Uploaded at</th>

                    </tr>
                </thead>

                <tbody>
                    <tr v-for="item in desserts" :key="item.dessert">
                        <td>{{ item.id }}</td>
                        <td>{{ item.type }}</td>

                        <td>
                            <div class="text-wrap">{{ item.otherInfo }}</div>
                        </td>
                        <td>{{ item.uploadedBy }}</td>
                        <td>{{ item.uploadedAt  }}</td>


                    </tr>
                </tbody>
            </VTable>
        </VCardText>
    </v-card>
</template>
