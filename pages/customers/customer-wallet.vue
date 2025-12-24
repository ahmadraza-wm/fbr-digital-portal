<script setup>
import { ref } from 'vue';

const customerID = ref('');
const customerName = ref('');
const customerEmail = ref('');
const closingBalance = ref('');
const invoice = ref('');
const amount = ref('');
const description = ref('');
const selectedEntryType = ref('');

const searched = ref(false);

const entrytype = ['Credit', 'Debit'];

const requiredValidator = (v) => !!v || "This field is required";

// Dummy customer data
const customers = [
  { id: 1, name: 'Ahmad Raza', email: 'ahmadraza.wm@gmail.com', balance: 1000 },
  { id: 2, name: 'Ali Khan', email: 'alikhan@example.com', balance: 500 },
  { id: 3, name: 'Sara Ali', email: 'sara@example.com', balance: 750 },
];

// Jab Search Button press hoga
const searchCustomer = () => {
  const customer = customers.find(c => c.id === Number(customerID.value));
  if (customer) {
    customerName.value = customer.name;
    customerEmail.value = customer.email;
    closingBalance.value = customer.balance;
    searched.value = true;
  } else {
    customerName.value = '';
    customerEmail.value = '';
    closingBalance.value = '';
    searched.value = false;
  }
};

const submitForm = () => {
  if (!searched.value) {
    searchCustomer();
  }
};
</script>

<template>
  <v-card>
    <v-card-title class="d-flex justify-space-between align-center" style="background-color: lightgrey;">
      <h4 class="text-h5 py-3 px-2">Customer Wallet</h4>
      <VBtn variant="elevated" to="/" color="primary">
        Back
      </VBtn>
    </v-card-title>

    <v-card-text class="pt-5">
      <VForm @submit.prevent="submitForm">
        <v-row class="ps-0">
          <v-col cols="12" sm="6">
            <span class="fs-15 label-color font-weight-medium">Customer ID<span class="text-red">*</span></span>
            <AppTextField name="customerId" v-model="customerID" type="number" placeholder="Customer ID"
              :rules="[requiredValidator]" :readonly="searched" autocomplete="off"/>
          </v-col>

          <template v-if="searched">
            <v-col cols="12" sm="6">
              <span class="fs-15 label-color font-weight-medium">Customer Name</span>
              <AppTextField name="customerName" v-model="customerName" placeholder="Customer Name" disabled />
            </v-col>
            <v-col cols="12" sm="6">
              <span class="fs-15 label-color font-weight-medium">Customer Email</span>
              <AppTextField name="customerEmail" type="email" v-model="customerEmail" placeholder="Customer Email"
                disabled />
            </v-col>
            <v-col cols="12" sm="6">
              <span class="fs-15 label-color font-weight-medium">Closing Balance</span>
              <AppTextField name="closingBalance" type="number" v-model="closingBalance" placeholder="0.00" disabled />
            </v-col>
            <v-col cols="12" sm="6">
              <span class="fs-15 label-color font-weight-medium">Invoice #</span>
              <AppTextField name="invoice" v-model="invoice" placeholder="Invoice #" autocomplete="off" />
            </v-col>
            <v-col cols="12" sm="6">
              <span class="fs-15 label-color font-weight-medium">Entry Type<span class="text-red">*</span></span>
              <AppAutocomplete v-model="selectedEntryType" :items="entrytype" placeholder="Select entry type"
                :rules="[requiredValidator]" autocomplete="off"/>
            </v-col>
            <v-col cols="12">
              <span class="fs-15 label-color font-weight-medium">Amount<span class="text-red">*</span></span>
              <AppTextField name="amount" v-model="amount" placeholder="Enter the amount"
                :rules="[requiredValidator]" autocomplete="off" />
            </v-col>
            <v-col cols="12">
              <span class="fs-15 label-color font-weight-medium">Description<span class="text-red">*</span></span>
              <AppTextarea rows="5" name="description" v-model="description" class="cursor-pointer"
                placeholder="Type here" :rules="[requiredValidator]" autocomplete="off" />
            </v-col>
          </template>

          <v-col :class=" ['d-flex gap-2' , searched ? 'justify-end' : 'pt-8 justify-start']">
            <VBtn type="submit" class="login-btn" variant="tonal">
              {{
                searched ? "Post Entry" : "Search"
              }}
            </VBtn>
            <VBtn type="reset" color="secondary" :class="searched ? 'order-first' : ''" variant="tonal" 
            @click="() => { 
              customerID = ''; 
              searched = false; 
              amount = ''; 
              description = ''; 
              selectedEntryType = ''; 



            }">
              {{
                searched ? "Discard" : "Reset"
              }}
            </VBtn>
          </v-col>
        </v-row>
      </VForm>
    </v-card-text>
  </v-card>
</template>
