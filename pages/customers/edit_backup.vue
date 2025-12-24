<script setup>
import AppDateTimePicker from "@/@core/components/app-form-elements/AppDateTimePicker.vue";
import { VChip, VFileInput } from "vuetify/components";
import data from "@/views/demos/forms/tables/data-table/datatable";
import AppSelect from "@/@core/components/app-form-elements/AppSelect.vue";
import BackNavigation from "@/@core/components/BackNavigation.vue";

const userList = ref([]);
const isPasswordVisible = ref(false);
import { ref } from "vue";
import { text } from "@/views/demos/components/button/demoCodeButton";
const firstName = ref('');
const lastName = ref('');
const dialog = ref(false);
const notes = ref(false);
const cusLedger = ref(false);
const dob = ref('');
const email = ref('usman@rozeremit.com')
const isEmailEditable = ref(false)
const partners = ref([
    { title: "GCC Remit", value: "GCC Remit" },
    { title: "PAK Remit", value: "PAK" },
    { title: "Ireland", value: "IE" },
]);
const documents = ref([
    {
        trx: "360 days",
        lc: "Roze Remit",
        trxCount: "Bangladesh",
        beneCount: "Bank Transfer",
        expiryDate: "24-04-2025",
    },
    {
        trx: "360 days",
        lc: "Roze Remit",
        trxCount: "Bangladesh",
        beneCount: "Bank Transfer",
    },
]);

const ledger = ref([
    {
        id: "01",
        date: "08 Jan, 2025",
        name: "Muhammad Usman Faiz",
        relation: "Son",
        contact: "+923244771966",
        sendingMethod: "Pay By Card",
        methodType: "Debit/Credit Card",
        sendingPurpose: "Family Maintenance",
        sendingAmount: "GBP 138.72",
        recevingAmount: "GBP 138.72",
        status: "paid",
    },
    {
        id: "02",
        date: "08 Jan, 2025",
        name: "Muhammad Usman Faiz",
        relation: "Son",
        contact: "+923244771966",
        sendingMethod: "Pay By Card",
        methodType: "Debit/Credit Card",
        sendingPurpose: "Family Maintenance",
        sendingAmount: "GBP 138.72",
        recevingAmount: "GBP 138.72",
        status: "paid",
    },
    {
        id: "03",
        date: "08 Jan, 2025",
        name: "Muhammad Usman Faiz",
        relation: "Son",
        contact: "+923244771966",
        sendingMethod: "Pay By Card",
        methodType: "Debit/Credit Card",
        sendingPurpose: "Family Maintenance",
        sendingAmount: "GBP 138.72",
        recevingAmount: "GBP 138.72",
        status: "paid",
    },
]);
const document = ref([
    {
        id: "01",
        type: "Passport",
        number: "G3799231",
        issueAuth: "MONZO",
        issuanseDate: "28 sep,2022",
        expiryDate: "27 sep, 2032",
        issuerCountry: "Ghana",
        status: "Verified",
    },
    {
        id: "02",
        type: "Passport",
        number: "G3799231",
        issueAuth: "MONZO",
        issuanseDate: "28 sep,2022",
        expiryDate: "27 sep, 2032",
        issuerCountry: "Ghana",
        status: "Verified",
    },
    {
        id: "03",
        type: "Passport",
        number: "G3799231",
        issueAuth: "MONZO",
        issuanseDate: "28 sep,2022",
        expiryDate: "27 sep, 2032",
        issuerCountry: "Ghana",
        status: "Verified",
    },
]);
const options = ref({
    page: 1,
    itemsPerPage: 3,
    sortBy: [""],
    sortDesc: [false],
});
const headers = [
    {
        title: "#",
        key: "id",
    },
    {
        title: "Remarks",
        key: "fullName",
    },
    {
        title: "Created By",
        key: "fullName",
    },
    {
        title: "Created At",
        key: "startDate",
    },
];
const kycNotes = [
    {
        title: "#",
        key: "id",
    },
    {
        title: "customer remarks",
        key: "post",
    },
    {
        title: "category",
        key: "city",
    },
    {
        title: "Attachment",
        key: "fullName",
    },
    {
        title: "Issuance Date",
        key: "startDate",
    },
    {
        title: "Expiry Date",
        key: "startDate",
    },
    {
        title: "Added By",
        key: "fullName",
    },
    {
        title: "Payment #",
        key: "payment",
    },
    {
        title: "Created At",
        key: "startDate",
    },
];

onMounted(() => {
    userList.value = JSON.parse(JSON.stringify(data));
});
const handleSubmit = async () => {
    const { valid } = await formRef.value.validate();

    if (valid) {
        dialog.value = false;
    }
};
</script>
<template>
    <v-card>
        <v-row>
            <v-col cols="12">
                <v-card-title class="bg-grey d-flex align-center">
                    <BackNavigation />
                    <h4 class="text-h4 py-3">Edit Customer details</h4>
                </v-card-title>
            </v-col>
        </v-row>
        <VCardText>
            <VForm @submit.prevent="">
                <v-row>
                    <VCol cols="12">
                        <span class="fs-13 label-color" v-html="requiredLabel('Customer ID')"></span>
                        <AppTextField name="customerId" type="number" :rules="[requiredValidator]"
                            placeholder="123456" />
                    </VCol>
                </v-row>
                <v-row>
                    <v-col cols="12" md="6">
                        <span class="fs-13 label-color" v-html="requiredLabel('First Name')"></span>
                        <AppTextField type="text" name="firstName" v-model="firstName" placeholder="Muhammad Usman"
                            :rules="[requiredValidator]" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <span class="fs-13 label-color" v-html="requiredLabel('Last Name')"></span>
                        <AppTextField type="text" name="lastName" v-model="lastName" placeholder="Faiz"
                            :rules="[requiredValidator]" />
                    </v-col>
                </v-row>
                <v-row class="align-center">
                    <v-col cols="9">
                        <span class="fs-13 label-color" v-html="requiredLabel('Email')"></span>
                        <AppTextField type="email" name="email" v-model="email" :readonly="!isEmailEditable"
                            :class="{ 'readonly-style': !isEmailEditable }" :rules="[requiredValidator]"
                            placeholder="usman@rozeremit.com" />
                    </v-col>
                    <v-col cols="3" class="d-flex align-center justify-end pt-8 pe-6">
                        <v-btn color="success" variant="tonal" class="mx-3">
                            Verified!
                        </v-btn>
                        <v-btn color="secondary" variant="tonal" @click="isEmailEditable = true">
                            Edit Email
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="6">
                        <span class="fs-13 label-color" v-html="requiredLabel('Password')"></span>
                        <AppTextField placeholder="············" :rules="[requiredValidator]" :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                            " @click:append-inner="isPasswordVisible = !isPasswordVisible" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <span class="fs-13 label-color" v-html="requiredLabel('Gender')"></span>
                        <AppAutocomplete name="gender" placeholder="Male" :rules="[requiredValidator]" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <span class="fs-13 label-color" v-html="requiredLabel('Phone')"></span>
                        <AppTextField name="phone" placeholder="phone" :rules="[requiredValidator]" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <span class="fs-13 label-color" v-html="requiredLabel('Type')"></span>
                        <AppAutocomplete name="type" :items="partners" placeholder="Online"
                            :rules="[requiredValidator]" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <span class="fs-13 label-color">Main Agent</span>
                        <AppAutocomplete name="mainAgent" :items="partners" placeholder="Owusu skyere" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <span class="fs-13 label-color">Sub Agent</span>
                        <AppAutocomplete name="mainAgent" :items="partners" placeholder="Owusu skyere" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <span class="fs-13 label-color">Timezone</span>
                        <AppAutocomplete name="mainAgent" :items="partners" placeholder="UTC+1" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <span class="fs-13 label-color" v-html="requiredLabel('DOB')"></span>
                        <AppDateTimePicker name="dob" v-model="dob" placeholder="mm/dd/yy" :rules="[requiredValidator]"
                            :config="{ dateFormat: 'd/m/Y' }" />
                    </v-col>
                    <v-col cols=" 12" md="6">
                        <span class="fs-13 label-color">Place of Birth</span>
                        <AppTextField name="mainAgent" placeholder="Owusu skyere" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <span class="fs-13 label-color" v-html="requiredLabel('Nationality')"></span>
                        <AppAutocomplete name="nationality" :items="partners" placeholder="Pakistani" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <span class="fs-13 label-color" v-html="requiredLabel('House # / Office')"></span>
                        <AppTextField name="address" placeholder="Type..." :rules="[requiredValidator]" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <span class="fs-13 label-color" v-html="requiredLabel('Street Address')"></span>
                        <AppTextField name="address" placeholder="Type..." :rules="[requiredValidator]" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <span class="fs-13 label-color" v-html="requiredLabel('Postal Code')"></span>
                        <AppTextField name="postalCode" placeholder="1236547" :rules="[requiredValidator]" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <span class="fs-13 label-color" v-html="requiredLabel('Country')"></span>
                        <AppTextField name="country" placeholder="United Kingdom" :rules="[requiredValidator]" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <span class="fs-13 label-color">State</span>
                        <AppAutocomplete name="state" :items="partners" placeholder="ANGUS" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <span class="fs-13 label-color">City</span>
                        <AppTextField name="city" placeholder="Type." />
                    </v-col>
                    <v-col cols="12" md="6">
                        <span class="fs-13 label-color" v-html="requiredLabel('Occupation')"></span>
                        <AppAutocomplete name="occupation" :items="partners" placeholder="Education"
                            :rules="[requiredValidator]" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <span class="fs-13 label-color">Status</span>
                        <AppAutocomplete name="active" :items="partners" placeholder="Active" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <span class="fs-13 label-color" v-html="requiredLabel('Verify')"></span>
                        <AppAutocomplete name="verify" :items="partners" placeholder="No"
                            :rules="[requiredValidator]" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <span class="fs-13 label-color">Is Introducer?</span>
                        <AppAutocomplete name="verify" :items="partners" placeholder="No" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <span class="fs-13 label-color">Notes</span>
                        <AppTextField name="notes" placeholder="Type..." />
                    </v-col>
                    <v-col cols="12" md="6">
                        <span class="fs-13 label-color">Is High Alert?</span>
                        <AppAutocomplete name="verify" :items="partners" placeholder="No" />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="6">
                        <VBtn class="login-btn" color="white" type="submit">Update Customer</VBtn>
                        <VBtn color="secondary" variant="tonal" class="mx-4">Discard</VBtn>
                    </v-col>
                    <v-col cols="12" md="6" class="text-end">
                        <VBtn color="primary" @click="dialog = true">
                            Change Password
                        </VBtn>
                    </v-col>
                </v-row>
            </VForm>
        </VCardText>
    </v-card>
    <v-card class="mt-7 px-0">
        <v-row>
            <v-col cols="12">
                <v-card-title style="background-color: lightgray;">
                    <h4 class="text-h4 py-3">Customer Ledger</h4>
                </v-card-title>
            </v-col>
        </v-row>
        <v-card-text class="pb-10 px-0">
            <v-table class="text-no-wrap">
                <thead>
                    <tr>
                        <th>Trx in days</th>
                        <th>LC</th>
                        <th>Trx Count</th>
                        <th>Bene Count</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="item in documents" :key="item.id">
                        <td>{{ item.trx }}</td>
                        <td>{{ item.lc }}</td>
                        <td>{{ item.trxCount }}</td>
                        <td>{{ item.beneCount }}</td>

                        <td>
                            <div class="d-flex gap-1">
                                <IconBtn>
                                    <NuxtLink class="menu-link" @click="cusLedger = true">
                                        <VIcon icon="tabler-eye" />
                                    </NuxtLink>
                                </IconBtn>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card-text>
    </v-card>
    <v-card class="mt-7 px-0">
        <v-row>
            <v-col cols="12">
                <v-card-title style="background-color: lightgray;">
                    <h4 class="text-h4 py-3">Beneficiary Ledger</h4>
                </v-card-title>
            </v-col>
        </v-row>
        <v-card-text class="pb-10 px-0">
            <v-table class="text-no-wrap">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Date and Pin</th>
                        <th>Bene Name (1)</th>
                        <th>Bene Relation</th>
                        <th>Contact #</th>
                        <th>Sending Method</th>
                        <th>Sending Purpose</th>
                        <th>Sending Amount</th>
                        <th>Receiving Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="item in ledger" :key="item.id">
                        <td>{{ item.id }}</td>
                        <td>
                            {{ item.date }}
                            <br />
                            <li style="color: green;">
                                <span class="text-decoration-underline">4484545</span>
                            </li>
                        </td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.relation }}</td>
                        <td>{{ item.contact }}</td>
                        <td>
                            {{ item.sendingMethod }}
                            <br />
                            <span class="fs-13">({{ item.methodType }})</span>
                        </td>
                        <td>{{ item.sendingPurpose }}</td>
                        <td>{{ item.sendingAmount }}</td>
                        <td>{{ item.recevingAmount }}</td>
                        <td>
                            <VChip color="success"> {{ item.status }} </VChip>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card-text>
    </v-card>
    <v-card class="mt-7 px-0">
        <v-row>
            <v-col cols="12">
                <v-card-title style="background-color: lightgray;">
                    <h4 class="text-h4 py-3">Customer Documents</h4>
                </v-card-title>
            </v-col>
        </v-row>
        <v-card-text class="pb-10 px-0">
            <v-table class="text-no-wrap">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Number</th>
                        <th>Issuer Auth</th>
                        <th>Issuance Date</th>
                        <th>Expiry Date</th>
                        <th>Issuer Country</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in document" :key="item.id">
                        <td>{{ item.id }}</td>
                        <td>
                            {{ item.type }}
                            <br />
                            <li style="color: green;">
                                <span class="fs-12">Primary</span>
                            </li>
                        </td>
                        <td>
                            {{ item.number }}
                            <br />
                            <li style="color: green;">
                                <span class="fs-12">Active</span>
                            </li>
                        </td>
                        <td>{{ item.issueAuth }}</td>
                        <td>{{ item.issuanseDate }}</td>
                        <td>{{ item.expiryDate }}</td>
                        <td>{{ item.issuerCountry }}</td>

                        <td>
                            <VChip color="success"> {{ item.status }} </VChip>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card-text>
    </v-card>
    <v-card class="mt-7 px-0">
        <v-row>
            <v-col cols="12">
                <v-card-title style="background-color: lightgray;">
                    <h4 class="text-h4 py-3">KYC Notes</h4>
                </v-card-title>
            </v-col>
        </v-row>
        <VCardText class="d-flex flex-wrap gap-4">
            <div class="me-3 d-flex gap-3">
                <span class="fs-16 pt-2">Show</span>
                <AppAutocomplete v-model="options.itemsPerPage" :items="[
                    { value: 10, title: '10' },
                    { value: 25, title: '25' },
                    { value: 50, title: '50' },
                    { value: 100, title: '100' },
                    { value: -1, title: 'All' },
                ]" style="inline-size: 6.25rem;" @update:model-value="options.itemsPerPage = parseInt($event, 10)" />
            </div>
            <VSpacer />

            <!-- 👉 Add user button -->
            <VBtn color="primary" variant="elevated" @click="notes = true">
                Add Notes
            </VBtn>
        </VCardText>

        <v-card-text class="pb-10 px-0 pt-0">
            <VDataTable class="partner-list" :headers="kycNotes" :items="userList"
                :items-per-page="options.itemsPerPage" :page="options.page" :options="options">
                <!-- status -->
                <template #item.payment="{ item }">
                    <VChip color="success"> RPL37736 </VChip>
                </template>
                <!-- Actions -->
                <template #item.action="{ item }">
                    <div class="d-flex gap-1">
                        <VBtn icon variant="text" color="medium-emphasis">
                            <VIcon icon="tabler-dots-vertical" />
                            <VMenu activator="parent">
                                <VList>
                                    <VListItem :to="'customers/view'">
                                        <VListItemTitle>View</VListItemTitle>
                                    </VListItem>

                                    <VListItem>
                                        <VListItemTitle>Edit</VListItemTitle>
                                    </VListItem>
                                </VList>
                            </VMenu>
                        </VBtn>
                    </div>
                </template>

                <template #bottom>
                    <VCardText class="pt-2">
                        <div class="d-flex flex-wrap justify-end gap-y-2 mt-2">
                            <VPagination v-model="options.page" :total-visible="$vuetify.display.smAndDown ? 3 : 5"
                                :length="Math.ceil(userList.length / options.itemsPerPage)" />
                        </div>
                    </VCardText>
                </template>
            </VDataTable>
        </v-card-text>
    </v-card>
    <v-card class="mt-7 px-0">
        <v-row>
            <v-col cols="12">
                <v-card-title style="background-color: lightgray;">
                    <h4 class="text-h4 py-3">Audit Log</h4>
                </v-card-title>
            </v-col>
        </v-row>
        <v-card-text class="pb-10 px-0 pt-0">
            <VDataTable class="partner-list" :headers="headers" :items="userList" :items-per-page="options.itemsPerPage"
                :page="options.page" :options="options">
                <!----Name with id and status-->
                <template #item.nameWithId="{ item }">
                    <div style="display: flex; align-items: center;">
                        <span>{{ item.id }}.</span>
                        <VChip :style="{
                            backgroundColor:
                                item.status === 'verified' ? '#28C76F29' : '#FF9F4329',
                            color: item.status === 'verified' ? '#28C76F' : '#FF9F43',
                            marginLeft: '8px',
                            marginTop: '5px',
                        }" class="font-weight-light fs-12 p-1" size="small">
                            {{ item.status === "verified" ? "Verified" : "Unverified" }}
                        </VChip>
                    </div>
                    <div class="fs-13">{{ item.fullName }}</div>
                </template>
                <!-- Email/Phone -->
                <template #item.contact="{ item }">
                    <div>
                        <div>{{ item.email }}</div>
                        <div class="fs-13">{{ item.city }}</div>
                    </div>
                </template>
                <!---Address-->
                <template #item.address="{ item }">
                    <div>
                        <div>{{ item.email }}</div>
                        <div class="fs-13">{{ item.city }}</div>
                    </div>
                </template>
                <template #item.channel="{ item }">
                    <div class="fs-13">{{ item.city }}</div>

                    <div style="display: flex; align-items: center;">
                        <VChip :style="{
                            backgroundColor: item.status === 1 ? '#28C76F29' : '#FF9F4329',
                            color: item.status === 1 ? '#28C76F' : '#FF9F43',

                            marginTop: '2px',
                        }" class="font-weight-light fs-12 p-1" size="small">
                            {{ item.status === 1 ? "Active" : "Inactive" }}
                        </VChip>
                    </div>
                </template>
                <!-- status -->
                <template #item.status="{ item }">
                    <VChip :color="resolveStatusVariant(item.status).color" class="font-weight-medium" size="small">
                        {{ resolveStatusVariant(item.status).text }}
                    </VChip>
                </template>
                <!-- Actions -->
                <template #item.action="{ item }">
                    <div class="d-flex gap-1">
                        <VBtn icon variant="text" color="medium-emphasis">
                            <VIcon icon="tabler-dots-vertical" />
                            <VMenu activator="parent">
                                <VList>
                                    <VListItem :to="'customers/view'">
                                        <VListItemTitle>View</VListItemTitle>
                                    </VListItem>

                                    <VListItem>
                                        <VListItemTitle>Edit</VListItemTitle>
                                    </VListItem>
                                </VList>
                            </VMenu>
                        </VBtn>
                    </div>
                </template>

                <template #bottom>
                    <VCardText class="pt-2">
                        <div class="d-flex flex-wrap justify-end gap-y-2 mt-2">
                            <VPagination v-model="options.page" :total-visible="$vuetify.display.smAndDown ? 3 : 5"
                                :length="Math.ceil(userList.length / options.itemsPerPage)" />
                        </div>
                    </VCardText>
                </template>
            </VDataTable>
        </v-card-text>
    </v-card>
    <!---Change password pop up design by usman faiz -->
    <div class="text-center pa-4">
        <!-- Dialog -->
        <v-dialog v-model="dialog" max-width="800" persistent transition="scale-transition">
            <v-card>
                <VCardTitle>
                    <h4 class="text-h4 pt-3">Change Password</h4>
                </VCardTitle>
                <VCardText class="pt-2">
                    <VForm>
                        <VRow>
                            <VCol cols="6">
                                <span class="fs-13 label-color" v-html="requiredLabel('Old Password')"></span>
                                <AppTextField placeholder="············" :rules="[passwordValidator, requiredValidator]"
                                    :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                                        " @click:append-inner="isPasswordVisible = !isPasswordVisible" />
                            </VCol>
                            <VCol cols="12" md="6">
                                <span class="fs-13 label-color" v-html="requiredLabel('New Password')"></span>
                                <AppTextField placeholder="············" :rules="[passwordValidator, requiredValidator]"
                                    :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                                        " @click:append-inner="isPasswordVisible = !isPasswordVisible" />
                            </VCol>
                            <VCol>
                                <VBtn color="primary" variant="elevated" type="submit" class="me-3"
                                    @click="handleSubmit">
                                    Save Changes</VBtn>
                                <VBtn color="secondary" variant="tonal" @click="dialog = false">Discard</VBtn>
                            </VCol>
                        </VRow>
                    </VForm>
                </VCardText>
            </v-card>
        </v-dialog>
    </div>
    <!---Add Notes pop up design by usman faiz -->
    <div class="text-center pa-4">
        <!-- Dialog -->
        <v-dialog v-model="notes" max-width="800" persistent transition="scale-transition">
            <v-card>
                <VCardTitle class="bg-grey">
                    <h4 class="text-h4 pt-3">Add Notes</h4>
                </VCardTitle>
                <VCardText class="pt-2">
                    <VForm>
                        <VRow>
                            <VCol cols="12">
                                <span class="fs-13 label-color" v-html="requiredLabel('Category')"></span>
                                <AppAutocomplete placeholder="Please Select" :rules="[requiredValidator]" />
                            </VCol>
                            <VCol cols="12" md="12">
                                <span class="fs-13 label-color" v-html="requiredLabel('Note')"></span>
                                <AppTextarea placeholder="Type here..." rows="2" />
                            </VCol>

                            <VCol cols="12">
                                <VCheckbox label="Do you also want to update E-KYC status of the customer?" />
                            </VCol>
                            <v-col cols="12">
                                <span class="fs-15 label-color font-weight-medium"
                                    v-html="requiredLabel('Attachment')"></span>
                                <VFileInput chips label="Choose File" />
                            </v-col>
                            <VCol>
                                <VBtn color="white" variant="elevated" type="submit" class="me-3 login-btn"
                                    @click="handleSubmit">Add Notes</VBtn>
                                <VBtn color="secondary" variant="tonal" @click="notes = false">Close</VBtn>
                            </VCol>
                        </VRow>
                    </VForm>
                </VCardText>
            </v-card>
        </v-dialog>
    </div>

</template>
