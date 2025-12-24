<script setup>
import CheckSign from "@images/svg/check1.png";
import CheckSign1 from "@images/svg/check2.png";
import { ref, reactive } from "vue";

const props = defineProps({
  sender: Object,
  transaction: Object,
});

const unverifyCustomer = ref(false);
const verifyCustomer = ref(false);

const formData = reactive({
  date: null,
  additionalDocument: false,
});
</script>
<template>
  <VRow class="d-flex align-center">
    <VCol cols="9 mt-8 border pa-0">
      <VCol cols="12" class="d-flex" style="background-color: #fbfafa">
        <p class="fs-16 font-weight-medium mb-0">Personal Details</p>
      </VCol>
      <VRow class="border-b-sm mt-1 mx-0">
        <VCol cols="3" class="py-4">
          <p class="fs-15 font-weight-medium text-color mb-1">ID</p>
          <NuxtLink
            class="cursor-pointer pa-1"
            color="primary"
            :to="'/customers/edit/id=1'"
            target="_blank"
            style="background-color: #7367f029"
          >
            <span
              >{{ sender?.id || "---" }}
              <VIcon icon="tabler-pencil" size="20"> </VIcon>
            </span>
          </NuxtLink>
        </VCol>
        <VCol cols="3" class="py-4">
          <p class="fs-15 font-weight-medium text-color mb-1">First Name</p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">
            {{ sender?.user.first_name || "---" }}
          </p>
        </VCol>
        <VCol cols="3" class="py-4">
          <p class="fs-15 font-weight-medium text-color mb-1">Last Name</p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">
            {{ sender?.user.last_name || "---" }}
          </p>
        </VCol>

        <VCol cols="3" class="py-4">
          <p class="fs-15 font-weight-medium text-color mb-1">Phone</p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">
            {{ sender?.phone_number || "---" }}
          </p>
        </VCol>
      </VRow>
      <VRow class="border-b-sm mt-1 mx-0">
        <VCol cols="3" class="py-4">
          <p class="fs-15 font-weight-medium text-color mb-1">Email</p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">
            {{ sender?.user.email || "---" }}
          </p>
        </VCol>
        <VCol cols="3" class="py-4">
          <p class="fs-15 font-weight-medium text-color mb-1">Gender</p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">
            {{ sender?.customer_detail.gender || "---" }}
          </p>
        </VCol>

        <VCol cols="3" class="py-4">
          <p class="fs-15 font-weight-medium text-color mb-1">Date of Birth</p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">
            {{ sender?.customer_detail.dob || "---" }}
          </p>
        </VCol>
      </VRow>
      <VCol cols="12" class="d-flex mt-2" style="background-color: #fbfafa">
        <p class="fs-16 font-weight-medium mb-0">Other Details</p>
      </VCol>
      <VRow class="border-b-sm mt-1 mx-0">
        <VCol cols="3" class="py-4">
          <p class="fs-15 font-weight-medium text-color mb-1">Address</p>
          <p class="mb-0 fs-15 font-weight-medium">
            {{ sender?.customer_detail.address || "---" }}
          </p>
        </VCol>
        <VCol cols="3" class="py-4">
          <p class="fs-15 font-weight-medium text-color mb-1">Postal Code:</p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">
            {{ sender?.customer_detail.postal_code || "---" }}
          </p>
        </VCol>

        <VCol cols="3" class="py-4">
          <p class="fs-15 font-weight-medium text-color mb-1">City Name:</p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">
            {{ sender?.customer_detail.city || "---" }}
          </p>
        </VCol>
        <VCol cols="3" class="py-4">
          <p class="fs-15 font-weight-medium text-color mb-1">Nationality:</p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">
            {{ sender?.customer_detail.nationality || "---" }}
          </p>
        </VCol>
      </VRow>
      <VRow class="border-b-sm mt-1 mx-0">
        <VCol cols="3" class="py-4">
          <p class="fs-15 font-weight-medium text-color mb-1">Place of Birth</p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">
            {{ sender?.customer_detail.place_of_birth || "---" }}
          </p>
        </VCol>
        <VCol cols="3" class="py-4">
          <p class="fs-15 font-weight-medium text-color mb-1">
            Source of Fund:
          </p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">------</p>
        </VCol>
        <VCol cols="3" class="py-4">
          <p class="fs-15 font-weight-medium text-color mb-1">
            Sending Reason:
          </p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">
            {{ transaction?.sending_reason || "---" }}
          </p>
        </VCol>
        <VCol cols="3" class="py-4">
          <p class="fs-15 font-weight-medium text-color mb-1">Type:</p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">
            {{ transaction?.sending_method || "---" }}
          </p>
        </VCol>
      </VRow>
      <VRow class="mt-1 mx-0">
        <VCol cols="3" class="py-4">
          <p class="fs-15 font-weight-medium text-color mb-1">Signup Date:</p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">------</p>
        </VCol>
        <VCol cols="3" class="py-4">
          <p class="fs-15 font-weight-medium text-color mb-1">Sales Code:</p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">-------</p>
        </VCol>
        <VCol cols="6" class="py-4">
          <p class="fs-15 font-weight-medium text-color mb-1">Occupation:</p>
          <p class="text-color1 mb-0 fs-15 font-weight-medium">
            {{ sender?.occupation || "---" }}
          </p>
        </VCol>
      </VRow>
    </VCol>
    <VCol cols="3" class="d-flex flex-column justify-center">
      <div class="text-center mb-8">
        <p class="fs-16 font-weight-medium mb-0 text-success">
          Customer Profile Verified
        </p>
        <p>
          <NuxtLink
            class="text-red fs-16 font-weight-medium cursor-pointer text-decoration-underline"
            @click="unverifyCustomer = true"
            >Mark Unverify?</NuxtLink
          >
        </p>
        <img :src="CheckSign" width="50" />
      </div>
      <div class="text-center">
        <p class="fs-16 font-weight-medium mb-0 text-red">E-KYC Unverified</p>
        <p>
          <NuxtLink
            class="text-red fs-16 font-weight-medium cursor-pointer text-decoration-underline text-success"
            @click="verifyCustomer = true"
          >
            Mark Verify?
          </NuxtLink>
        </p>
        <img :src="CheckSign1" width="50" />
      </div>
    </VCol>
  </VRow>

  <!--- Unverify Customer pop up design by usman faiz -->
  <div class="text-center">
    <!-- Dialog -->
    <v-dialog
      v-model="unverifyCustomer"
      max-width="600"
      transition="scale-transition"
    >
      <v-card>
        <v-row>
          <v-col cols="12">
            <v-card-title
              class="d-flex align-center border-b-sm justify-space-between"
            >
              <h4 class="text-h4 py-3">Confirmation?</h4>
              <IconBtn @click="unverifyCustomer = false">
                <VIcon icon="tabler-x" />
              </IconBtn>
            </v-card-title>
          </v-col>
        </v-row>
        <V-card-text class="py-5 border-b-sm">
          <p class="fs-18 font-weight-medium mb-0">
            Are you sure you want to <span class="text-red">Unverify</span> this
            customer?
          </p>
        </V-card-text>
        <v-card-text class="mt-4">
          <VBtn color="red" @click="unverifyCustomer = false"> Unverify </VBtn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>

  <!--- verify Customer pop up design by usman faiz -->
  <div class="text-center">
    <!-- Dialog -->
    <v-dialog
      v-model="verifyCustomer"
      max-width="600"
      transition="scale-transition"
    >
      <v-card>
        <v-row>
          <v-col cols="12">
            <v-card-title
              class="d-flex align-center border-b-sm justify-space-between"
            >
              <h4 class="text-h4 py-3">Confirmation?</h4>
              <IconBtn @click="verifyCustomer = false">
                <VIcon icon="tabler-x" />
              </IconBtn>
            </v-card-title>
          </v-col>
        </v-row>
        <VForm @submit.prevent="">
          <V-card-text class="py-5 border-b-sm">
            <p class="fs-18 font-weight-medium mb-0">
              Are you sure you want to update the E-KYC of this customer?
            </p>
            <VRow class="d-flex align-center mt-4">
              <VCol cols="9">
                <span class="fs-13 label-color"
                  >Verified Till Date<span class="text-red">*</span></span
                >
                <AppDateTimePicker
                  v-model="formData.date"
                  name="date"
                  placeholder="dd/mm/yyyy"
                  :rules="[requiredValidator]"
                  :config="{ dateFormat: 'd/m/Y' }"
                >
                </AppDateTimePicker>
              </VCol>
              <VCol cols="3" class="d-flex align-center mt-4">
                <VCheckbox>
                  <template #label>
                    <span class="text-red font-weight-bold">Unverify</span>
                  </template>
                </VCheckbox>
              </VCol>
            </VRow>
            <VCol cols="12" class="px-0">
              <VCheckbox
                label="Additional Document"
                v-model="formData.additionalDocument"
              ></VCheckbox>
            </VCol>
            <VCol cols="12" v-if="formData.additionalDocument">
              <span class="fs-13 label-color"
                >Verified Address Till Date
                <span class="text-red">*</span></span
              >
              <AppDateTimePicker
                v-model="formData.adddate"
                name="date"
                placeholder="dd/mm/yyyy"
                :rules="[requiredValidator]"
                :config="{ dateFormat: 'd/m/Y' }"
              >
              </AppDateTimePicker>
            </VCol>
          </V-card-text>
          <v-card-text class="mt-4">
            <VBtn color="red" @click="verifyCustomer = false"> Unverify </VBtn>
          </v-card-text>
        </VForm>
      </v-card>
    </v-dialog>
  </div>
</template>
