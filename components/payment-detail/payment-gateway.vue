<template>
  <v-expansion-panels class="my-3 border rounded" elevation="0">
    <v-expansion-panel>
      <v-expansion-panel-title class="py-4 bg-grey ps-0 pe-7 border-b-sm">
        <VCol cols="12" class="d-flex justify-space-between align-center">
          <p class="fs-16 font-weight-medium mb-0 text-uppercase">Payment Gateway Details</p>

          <p class="mb-0 text-primary">PAY BY CARD (Debit/Credit)</p>
        </VCol>

      </v-expansion-panel-title>
      <v-expansion-panel-text class=" pt-3 px-2 pb-1">
        <VRow class="border-b-sm">
          <VCol cols="6" class="py-3">
            <p class="fs-15 font-weight-medium text-color mb-1">Payment Gateway</p>
            <p class="text-color1 mb-0 fs-15 font-weight-medium">PAY BY CARD (Debit/Credit)</p>
          </VCol>
          <VCol cols="6" class="py-3">
            <p class="fs-15 font-weight-medium text-color mb-1">Payment Method</p>
            <p class="text-color1 mb-0 fs-15 font-weight-medium">
              ------
            </p>
          </VCol>
        </VRow>
        <VRow class="border-b-sm">
          <VCol cols="6" class="py-3">
            <p class="fs-15 font-weight-medium text-color mb-1">Auth Code</p>
            <p class="text-color1 mb-0 fs-15 font-weight-medium">Lorem ipsum</p>
          </VCol>
          <VCol cols="6" class="py-3">
            <p class="fs-15 font-weight-medium text-color mb-1">Reference #</p>
            <p class="text-color1 mb-0 fs-15 font-weight-medium">
              112344
            </p>
          </VCol>
        </VRow>
        <VRow class="border-b-sm">
          <VCol cols="6" class="py-3">
            <p class="fs-15 font-weight-medium text-color mb-1">Issuer</p>
            <p class="text-color1 mb-0 fs-15 font-weight-medium">Lorem ipsum</p>
          </VCol>
          <VCol cols="4" class="py-3">
            <p class="fs-15 font-weight-medium text-color mb-1">Attempts</p>
            <p class="text-color1 mb-0 fs-15 font-weight-medium">0</p>
          </VCol>

        </VRow>
        <VRow>
          <VCol cols="6" class="py-3">
            <p class="fs-15 font-weight-medium text-color mb-1">Total Used Cards</p>
            <p class="text-color1 mb-0 fs-15 font-weight-medium">GBP 333.20</p>
          </VCol>
          <VCol cols="6" class="py-3">
            <p class="fs-15 font-weight-medium text-color mb-1">Other Cards</p>
            <p class="text-color1 mb-0 fs-15 font-weight-medium">
              <span class="text-primary pe-2 text-decoration-underline">1. 475139******4100</span>Decline
              card
            </p>

          </VCol>
        </VRow>

      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
