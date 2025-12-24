<script setup>
import BeneficiaryReports from "@/components/payment-detail/beneficiary-report.vue";
import CardReports from "@/components/payment-detail/card-report.vue";
import PaymentGateway from "@/components/payment-detail/payment-gateway.vue";



const senderLink = ref(false);
const receiverLink = ref(false);
const cardLink = ref(false);

</script>
<template>
  <VRow class="py-3">
    <VCol cols="4" class="text-center">
      <h1 class="mb-0 text-center fs-16">
        Sernder Link
      </h1>
      <NuxtLink class="text-black text-center text-decoration-underline cursor-pointer" @click="senderLink=true">
        Sender Link
      </NuxtLink>
    </VCol>
    <VCol cols="4" class="text-center">
      <h1 class="mb-0 text-center fs-16">
        Receiver Link
      </h1>
      <NuxtLink class="text-black text-center text-decoration-underline cursor-pointer" @click="receiverLink=true">
        Receiver Link
      </NuxtLink>
    </VCol>
    <VCol cols="4" class="text-center">
      <h1 class="mb-0 text-center fs-16">
        Card Link
      </h1>
      <NuxtLink class="text-black text-center text-decoration-underline cursor-pointer" @click="cardLink = true">
        Card Link
      </NuxtLink>
    </VCol>
  </VRow>
  <!-- -Sender Link Modal Form-- -->
  <div class="text-center">
    <!-- Dialog -->
    <v-dialog v-model="senderLink" max-width="1000" transition="scale-transition">
      <v-card>
        <v-row>
          <v-col cols="12">
            <v-card-title class="d-flex align-center justify-space-between" style="background-color: lightgray">
              <h4 class="text-h4 py-3">Sender Link Report
              </h4>
              <IconBtn @click="senderLink = false">
                <VIcon icon="tabler-x" />
              </IconBtn>
            </v-card-title>
          </v-col>
        </v-row>
        <v-card-text>
          <VTable class="text-no-wrap">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer Id</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>DOB</th>
                <th>Postal Code</th>
                <th>No. of Payments</th>
                <th>Total Volume</th>
                <th>Phone</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody class="pb-2">
              <tr>
                <td>1</td>
                <td>
                  <NuxtLink :to="'/customers/view/1'" target="_blank" class="link-color">
                    1235
                  </NuxtLink>

                </td>
                <td>Deric kusi</td>
                <td>Deric kusi</td>
                <td>21 Aug, 1958</td>
                <td>M11 1LH</td>
                <td>35</td>
                <td>GBP 138.72</td>
                <td>+447459840663</td>
                <td>Vine Street</td>
              </tr>
              <tr>
                <td>1</td>
                <td>
                  <NuxtLink :to="'/customers/view/1'" target="_blank" class="link-color">
                    1235
                  </NuxtLink>
                </td>
                <td>Deric kusi</td>
                <td>Deric kusi</td>
                <td>21 Aug, 1958</td>
                <td>M11 1LH</td>
                <td>35</td>
                <td>GBP 138.72</td>
                <td>+447459840663</td>
                <td>Vine Street</td>
              </tr>
            </tbody>
          </VTable>


        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
  <!-- -Receiver Link Modal Form-- -->
  <div class="text-center">
    <!-- Dialog -->
    <v-dialog v-model="receiverLink" max-width="1000" transition="scale-transition">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between" style="background-color: lightgray">
          <h4 class="text-h4 py-3">Receiver Link Report
          </h4>
          <IconBtn @click="receiverLink = false">
            <VIcon icon="tabler-x" />
          </IconBtn>
        </v-card-title>
        <BeneficiaryReports />

      </v-card>
    </v-dialog>
  </div>
  <!-- -Card  Link Modal Form-- -->
  <div class="text-center">
    <!-- Dialog -->
    <v-dialog v-model="cardLink" max-width="1000" transition="scale-transition">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between" style="background-color: lightgray">
          <h4 class="text-h4 py-3">Card Link
          </h4>
          <IconBtn @click="cardLink = false">
            <VIcon icon="tabler-x" />
          </IconBtn>
        </v-card-title>
        <CardReports />

      </v-card>
    </v-dialog>
  </div>
</template>
