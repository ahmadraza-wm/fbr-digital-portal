<script setup>
import AppDateTimePicker from "@/@core/components/app-form-elements/AppDateTimePicker.vue";
import BackNavigation from "@/@core/components/BackNavigation.vue";
import BenificineryLedger from "@/components/customers/BenificineryLedger.vue";
import CustomerDocuments from "@/components/customers/CustomerDocuments.vue";
import KycNotes from "@/components/customers/KycNotes.vue";
import CustomerLedger from "@/components/payment-detail/customer-ledger.vue";
import { useCustomer } from "@/composables/useCustomer";
import useUiFeedback from "@/composables/useUiFeedback";
import { useRoute } from "vue-router";
import EditDocumentForm from "@/pages/customers/edit-documents/edit-form.vue";
import AuditLog from '@/components/AuditLog.vue';
const permissionStore = usePermissionStore()
definePageMeta({
  middleware: "auth",
  permission: "customers.update"
})
const { $axios } = useNuxtApp();

const {
  loading,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  confirmAction,
} = useUiFeedback();

const {
  agents,
  fetchAgents,
} = useAgents();

const {
  fetchCustomerById,
  documents,
  fetchCustomerDocuments,
  uploadCustomerDocuments,
  documentTypes,
  countries,
  updateCustomer,
  timezones,
  nationalities,
  genderOptions,
  typesOptions,
  statusOptions,
  occupationsOptions,
  verifyOptions,
  updateDocumentStatus,
  introducerOptions,
  alertOptions,
} = useCustomer();
const route = useRoute();

function formatToDMY(dateStr) {
  const [year, month, day] = dateStr.split("-");
  return `${parseInt(day)}/${parseInt(month)}/${year}`;
}

const userList = ref([]);
const customer_ledger = ref([]);
const benificiary_ledger = ref([]);
const kyc_notes = ref([]);
const customer = ref(null);

const userId = ref("");
const customerId = ref("");
const password = ref("");
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const dob = ref("");
const gender = ref("");
const phone = ref("");
const type = ref("");
const mainAgent = ref("");
const subAgent = ref("");
const timezone = ref("");
const nationality = ref("");
const address = ref("");
const streetAddress = ref("");
const postalCode = ref("");
const country = ref("");
const state = ref("");
const city = ref("");
const occupation = ref("");
const Status = ref("");
const IsVerify = ref("");
const isIntroducer = ref("");
const notes = ref("");
const isHighAlert = ref("");
const place_of_birth = ref("");

const isReadOnly = computed(() => type.value === "online");

const options = ref({
  page: 1,
  itemsPerPage: 3,
  sortBy: [""],
  sortDesc: [false],
});

const dialog = ref(false);
const new_password = ref("");
const confirm_password = ref("");

const isOldPasswordVisible = ref(false);
const isNewPasswordVisible = ref(false);
const formRef = ref(null)
const isEmailEditable = ref(false);


const selectedDocument = ref(null);
const verifyDialog = ref(false);



function openVerifyDialog(doc) {
  selectedDocument.value = doc;
  verifyDialog.value = true;
}


const isEditModalOpen = ref(false)

function openEditDialog(doc) {
  selectedDocument.value = doc.id 
  isEditModalOpen.value = true
}

async function verifySelectedDocument() {
  if (!selectedDocument.value) return;

  try {
    await updateDocumentStatus(selectedDocument.value.id, selectedDocument.value.is_verified);
    showSuccess("Document verified successfully");
  } catch (err) {
    showError("Failed to verify document");
  } finally {
    verifyDialog.value = false;
  }
}



const handlePassword = async () => {

  const { valid } = await formRef.value.validate()
  if (!valid) {
    return // stop if validation fails
  }


  try {
    const response = await $axios.post("/change/password", {
      password: new_password.value,
      password_confirmation: confirm_password.value,
      user_id: userId.value
    });

    console.log('user_id', userId.value);

    showSuccess("Password changed successfully.");
    new_password.value = "";
    confirm_password.value = "";
    dialog.value = false;
  } catch (error) {
    let messages = [];

    if (error.response?.data?.errors) {
      messages = Object.values(error.response.data.errors).flat();
    } else if (error.response?.data?.error) {
      messages = [error.response.data.error];
    } else {
      messages = ["Something went wrong."];
    }

    showError(messages.join("\n"));
  }
};

const customer_id = route.params.id;




onMounted(async () => {
  const id = route.params.id;
  fetchCustomerDocuments(customer_id);
  const data = await fetchCustomerById(id);
  if (data) {
    customerId.value = data.id;
    userId.value = data.user_id;
    firstName.value = data.first_name;
    lastName.value = data.last_name;
    password.value = data.password;
    email.value = data.email;
    gender.value = data.gender;
    dob.value = data.dob ? formatToDMY(data.dob) : "";
    phone.value = data.phone;
    type.value = data.channel;
    mainAgent.value = data.main_agent;
    subAgent.value = data.sub_agent;
    timezone.value = data.timezone;
    nationality.value = data.nationality;
    address.value = data.address;
    streetAddress.value = data.street_address;
    place_of_birth.value = data.place_of_birth;
    postalCode.value = data.postal_code;
    country.value = data.receiving_country;
    state.value = data.state;
    city.value = data.city;
    occupation.value = data.occupation;
    Status.value = data.status;
    isIntroducer.value = data.is_introducer;
    IsVerify.value = data.verified ? 1 : 0;
    notes.value = data.notes;
    isHighAlert.value = data.is_high_alert;
    customer_ledger.value = data.customer_ledger;
    benificiary_ledger.value = data.benificiary_ledger;
    kyc_notes.value = data.kyc_notes;
  }
  fetchAgents({}, false);
});

const submitCustomerForm = async () => {

  const { valid } = await formRef.value.validate();

  if (!valid) {
    return;
  }

  const payload = {
    first_name: firstName.value,
    last_name: lastName.value,
    email: email.value,
    gender: gender.value,
    dob: formatDate(dob.value),
    phone_number: phone.value,
    channel: type.value,
    agent_id: mainAgent.value,
    sub_agent: subAgent.value,
    timezone: timezone.value,
    nationality: nationality.value,
    address: address.value,
    street_address: streetAddress.value,
    place_of_birth: place_of_birth.value,
    postal_code: postalCode.value,
    receiving_country: country.value,
    state: state.value,
    status: Status.value,
    city: city.value,
    occupation: occupation.value,
    is_introducer: isIntroducer.value,
    verified: IsVerify.value,
    notes: notes.value,
    is_high_alert: Boolean(isHighAlert.value),
  };

  await updateCustomer(customerId.value, payload);
};

const formatDate = (inputDate) => {
  if (!inputDate) return "";
  const [day, month, year] = inputDate.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`; // Y-m-d
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
      <VForm @submit.prevent="submitCustomerForm" ref="formRef">
        <v-row>
          <VCol cols="12">
            <span class="fs-13 label-color" v-html="requiredLabel('Customer ID')"></span>
            <AppTextField name="customerId" v-model="customerId" type="number" :rules="[requiredValidator]" readonly
              placeholder="Enter Cutomer ID" />
          </VCol>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <span class="fs-13 label-color" v-html="requiredLabel('First Name')"></span>
            <AppTextField type="text" name="firstName" v-model="firstName" placeholder="First Name"
              :rules="[requiredValidator]" autocomplete="off" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-13 label-color" v-html="requiredLabel('Last Name')"></span>
            <AppTextField type="text" name="lastName" v-model="lastName" placeholder="LAst Name"
              :rules="[requiredValidator]" autocomplete="off"/>
          </v-col>
        </v-row>
        <v-row class="align-center">
          <v-col cols="9">
            <span class="fs-13 label-color" v-html="requiredLabel('Email')"></span>
            <AppTextField type="email" name="email" v-model="email" :readonly="!isEmailEditable"
              :class="{ 'readonly-style': !isEmailEditable }" :rules="[requiredValidator]" placeholder="Enter Email" />
          </v-col>
          <v-col cols="3" class="d-flex align-center justify-end pt-8 pe-6">
            <v-btn color="success" variant="tonal" class="mx-3"> Verified! </v-btn>
            <v-btn color="primary" variant="elevated" @click="isEmailEditable = true">
              Edit Email
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <!-- <v-col cols="12" md="6">
            <span class="fs-13 label-color">Password</span>
            <AppTextField
              placeholder="············"
              :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
              @click:append-inner="isPasswordVisible = !isPasswordVisible"
              readonly
            />
          </v-col> -->
          <v-col cols="12" md="6">
            <span class="fs-13 label-color" v-html="requiredLabel('Gender')"></span>
            <AppAutocomplete name="gender" v-model="gender" :items="genderOptions" item-title="text" item-value="value"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-13 label-color" v-html="requiredLabel('Phone')"></span>
            <AppTextField name="phone" v-model="phone" placeholder="Enter phone" :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-13 label-color" v-html="requiredLabel('Type')"></span>
            <AppAutocomplete name="type" :items="typesOptions" v-model="type" item-title="text" item-value="value"
              placeholder="Online" :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-13 label-color">Main Agent</span>
            <AppAutocomplete name="mainAgent" :items="agents" v-model="mainAgent" item-title="name" item-value="id"
              placeholder="Owusu skyere" :readonly="isReadOnly" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-13 label-color">Sub Agent</span>
            <AppAutocomplete name="mainAgent" :items="agents" item-title="name" item-value="id" v-model="subAgent"
              placeholder="Owusu skyere" :readonly="isReadOnly" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-13 label-color">Timezone</span>
            <AppAutocomplete name="mainAgent" :items="timezones" v-model="timezone" item-title="title"
              item-value="value" placeholder="UTC+1" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-13 label-color" v-html="requiredLabel('DOB')"></span>
            <AppDateTimePicker name="dob" v-model="dob" placeholder="mm/dd/yy" :rules="[requiredValidator]"
              :config="{ dateFormat: 'd/m/Y' }" />
          </v-col>
          <v-col cols=" 12" md="6">
            <span class="fs-13 label-color">Place of Birth</span>
            <AppTextField name="mainAgent" v-model="place_of_birth" placeholder="Owusu skyere" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-13 label-color" v-html="requiredLabel('Nationality')"></span>
            <AppAutocomplete name="nationality" v-model="nationality" :items="nationalities" item-title="title"
              item-value="value" placeholder="Pakistani" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-13 label-color" v-html="requiredLabel('House # / Office')"></span>
            <AppTextField name="place_of_birth" v-model="address" placeholder="Enter House/Ofiice Address"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-13 label-color" v-html="requiredLabel('Street Address')"></span>
            <AppTextField name="address" v-model="streetAddress" placeholder="Enter House/Ofiice Street Address"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-13 label-color" v-html="requiredLabel('Postal Code')"></span>
            <AppTextField name="postalCode" v-model="postalCode" placeholder="Enter Postal Code"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-13 label-color" v-html="requiredLabel('Country')"></span>
            <AppTextField name="country" v-model="country" readonly />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-13 label-color">State</span>
            <AppAutocomplete name="state" v-model="state" :items="partners" placeholder="ANGUS" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-13 label-color">City</span>
            <AppTextField name="city" v-model="city" placeholder="Enter City Name" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-13 label-color" v-html="requiredLabel('Occupation')"></span>
            <AppAutocomplete name="occupation" v-model="occupation" :items="occupationsOptions" item-title="name"
              item-value="value" placeholder="Education" :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-13 label-color">Status</span>
            <AppAutocomplete name="active" v-model="Status" :items="statusOptions" item-title="text" item-value="value"
              placeholder="Active" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-13 label-color" v-html="requiredLabel('Verify')"></span>
            <AppAutocomplete name="verify" v-model="IsVerify" :items="verifyOptions" item-title="text"
              item-value="value" placeholder="No" :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-13 label-color">Is Introducer?</span>
            <AppAutocomplete name="verify" v-model="isIntroducer" :items="introducerOptions" item-title="text"
              item-value="value" placeholder="No" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-13 label-color">Notes</span>
            <AppTextField name="notes" v-model="notes" placeholder="Add Notes" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-13 label-color">Is High Alert?</span>
            <AppAutocomplete name="verify" v-model="isHighAlert" :items="alertOptions" item-title="text"
              item-value="value" placeholder="No" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12 d-flex justify-end">
            <VBtn color="primary" @click="dialog = true" v-if="permissionStore.hasPermission('change.customer.password')"> Change Password </VBtn>
            <VBtn color="secondary" variant="tonal" class="mx-4">Reset</VBtn>
            <VBtn class="login-btn" color="white" type="submit">Update Customer</VBtn>
          </v-col>
        </v-row>
      </VForm>
    </VCardText>
  </v-card>
  <CustomerLedger :ledger="customer_ledger" :customer_id="customerId" v-if="permissionStore.hasPermission('customer.ledger.details')"/>
  <v-card class="mt-5 px-0" v-if="permissionStore.hasPermission('beneficiary.ledger.details')">
    <BenificineryLedger :ledger="benificiary_ledger" />
  </v-card>
  <CustomerDocuments :documents="documents" :updateDocumentStatus="updateDocumentStatus" :openVerifyDialog="openVerifyDialog" @editDocument="openEditDialog" v-if="permissionStore.hasPermission('customer.document.view')"/>


   <v-dialog v-model="isEditModalOpen" max-width="900">
  <v-card>
    <v-card-title class="d-flex justify-space-between pt-4 pb-2 px-6 border-b-sm">
      <h4 class="text-h4">Edit Document</h4>
      <VIcon icon="tabler-x" @click="isEditModalOpen = false" />
    </v-card-title>

    <v-card-text class="pt-4">
      <EditDocumentForm
        v-if="isEditModalOpen"
        :documentIdProp="selectedDocument"
        :documentTypesProp="documentTypes"
        @refetchSenderDocuments="fetchCustomerDocuments(customer_id)"
        @closeModal="isEditModalOpen = false"
      />
    </v-card-text>
  </v-card>
</v-dialog>


  <v-card class="mt-5 px-0">
    <KycNotes :kyc_notes="kyc_notes" :customer_id="customerId" v-if="permissionStore.hasPermission('kyc_notes.index')"/>
  </v-card>

   <AuditLog module="CustomerDetail" :id="customerId" class="mt-4"/>
  <!-- <v-card class="mt-5 px-0">
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
        <template #item.nameWithId="{ item }">
          <div style="display: flex; align-items: center;">
            <span>{{ item.id }}.</span>
            <VChip :style="{
              backgroundColor: item.status === 'verified' ? '#28C76F29' : '#FF9F4329',
              color: item.status === 'verified' ? '#28C76F' : '#FF9F43',
              marginLeft: '8px',
              marginTop: '5px',
            }" class="font-weight-light fs-12 p-1" size="small">
              {{ item.status === "verified" ? "Verified" : "Unverified" }}
            </VChip>
          </div>
          <div class="fs-13">{{ item.fullName }}</div>
        </template>
        <template #item.contact="{ item }">
          <div>
            <div>{{ item.email }}</div>
            <div class="fs-13">{{ item.city }}</div>
          </div>
        </template>
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
        <template #item.status="{ item }">
          <VChip :color="resolveStatusVariant(item.status).color" class="font-weight-medium" size="small">
            {{ resolveStatusVariant(item.status).text }}
          </VChip>
        </template>
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
  </v-card> -->




    <div class="text-center">
      <v-dialog v-model="verifyDialog" max-width="1000" transition="scale-transition">
      <v-card>
        <v-row>
          <v-col cols="12">
            <v-card-title class="d-flex align-center justify-space-between" style="background-color: lightgray;">
              <h4 class="text-h4 py-3">Attention</h4>
              <IconBtn @click="verifyDialog = false">
                <VIcon icon="tabler-x" />
              </IconBtn>
            </v-card-title>
          </v-col>
        </v-row>

        <v-card-text>
          <p class="text-red mb-0 fs-16 font-weight-bold text-center">
            Are you sure you want to verify this document?
          </p>
          <p class="text-red mb-0 fs-16 font-weight-bold text-center">
            Verifying the primary document will also verify the customer profile.
          </p>
          <p class="text-red mb-0 fs-14 font-weight-bold text-center">
            (The customer will not be able to edit their profile.)
          </p>
        </v-card-text>

        <v-card-text>
          <VTable class="text-no-wrap">
            <thead>
              <tr>
                <th>Type</th>
                <th>Number</th>
                <th>Issuer Auth</th>
                <th>Issuance date</th>
                <th>Expiry date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ selectedDocument?.type }}</td>
                <td>{{ selectedDocument?.number }}</td>
                <td>{{ selectedDocument?.issuer_authority }}</td>
                <td>{{ selectedDocument?.issue_date }}</td>
                <td>{{ selectedDocument?.expiry_date }}</td>
              </tr>
            </tbody>
          </VTable>
        </v-card-text>

        <v-card-text>
          <VCol cols="12" v-if="selectedDocument?.media?.[0]?.url">
            <p class="fs-16 font-weight-medium">Front</p>
            <div class="d-flex justify-center">
              <img :src="selectedDocument?.media?.[0]?.url" alt="Front Image" class="rounded border"
                style="max-inline-size: 100%;" />
            </div>
          </VCol>

          <VCol cols="12" v-if="selectedDocument?.media?.[1]?.url">
            <p class="fs-16 font-weight-medium">Back</p>
            <div class="d-flex justify-center">
              <img :src="selectedDocument?.media?.[1]?.url" alt="Back Image" class="rounded border"
                style="max-inline-size: 100%;" />
            </div>
          </VCol>
        </v-card-text>

        <v-card-actions class="d-flex gap-3 justify-end">
          <VBtn class="px-2" variant="tonal" color="secondary" @click="verifyDialog = false">
            Discard
          </VBtn>
          <VBtn class="login-btn" variant="tonal" color="white" @click="verifySelectedDocument">
            Approve
          </VBtn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </div>  


  <!---Change password pop up design by usman faiz -->
  <div class="text-center pa-4">
    <!-- Dialog -->
    <v-dialog v-model="dialog" max-width="800" persistent transition="scale-transition">
      <v-card>
        <VCardTitle>
          <h4 class="text-h4 pt-3">Change Password</h4>
        </VCardTitle>
        <VCardText class="pt-2">
          <VForm ref="formRef" @submit.prevent="handlePassword">
            <VRow>
              <VCol cols="6">
                <span class="fs-13 label-color" v-html="requiredLabel('Password')"></span>
                <AppTextField v-model="new_password" placeholder="············"
                  :type="isOldPasswordVisible ? 'text' : 'password'" :rules="[passwordValidator, requiredValidator]"
                  :append-inner-icon="isOldPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                    " @click:append-inner="isOldPasswordVisible = !isOldPasswordVisible" />
              </VCol>
              <VCol cols="12" md="6">
                <span class="fs-13 label-color" v-html="requiredLabel('Confirm Password')"></span>
                <AppTextField v-model="confirm_password" placeholder="············"
                  :type="isNewPasswordVisible ? 'text' : 'password'" :rules="[passwordValidator, requiredValidator]"
                  :append-inner-icon="isNewPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                    " @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible" />
              </VCol>
              <VCol class="d-flex gap-2 justify-end">
                <VBtn color="secondary" variant="tonal" @click="dialog = false">
                  Discard
                </VBtn>
                <VBtn color="primary" variant="elevated" class="login-btn" type="submit">
                  Save Changes
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </v-card>
    </v-dialog>
  </div>
</template>
