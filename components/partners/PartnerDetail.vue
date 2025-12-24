<script setup>
defineProps({
  partner: Object,
});
</script>

<template>
  <v-row class="border-b-sm px-5">
    <v-col cols="12" sm="6" md="4" class="pb-1">
      <p class="font-weight-medium text-color mb-0 lh-22">Name</p>
      <p class="font-weight-medium mb-0 lh-22 text-color1">{{ partner?.name }}</p>
    </v-col>
    <v-col cols="12" sm="6" md="4" class="pb-1">
      <p class="font-weight-medium text-color mb-0 lh-22">Username</p>
      <p class="font-weight-medium mb-0 lh-22 text-color1">{{ partner?.user_name }}</p>
    </v-col>
    <v-col cols="12" sm="6" md="4" class="pb-1">
      <p class="font-weight-medium text-color mb-0 lh-22">Email</p>
      <p class="font-weight-medium mb-0 lh-22 text-color1">{{ partner?.email }}</p>
    </v-col>
  </v-row>

  <v-row class="border-b-sm px-5">
    <v-col cols="12" sm="6" md="4" class="pb-1">
      <p class="font-weight-medium text-color mb-0 lh-22">Status</p>
      <p class="font-weight-medium text-color mb-0 lh-22">
        <v-badge
          :color="partner?.status === 1 ? 'success' : 'error'"
          :content="partner?.status === 1 ? 'Active' : 'Inactive'"
          inline
          class="font-weight-medium"
          size="small"
        >
        </v-badge>
      </p>
    </v-col>
    <v-col cols="12" sm="6" md="4" class="pb-1">
      <p class="font-weight-medium text-color mb-0 lh-22">Settlement Currency</p>
      <p class="font-weight-medium mb-0 lh-22 text-color1">
        {{ partner?.settlement_currency }}
      </p>
    </v-col>
    <v-col cols="12" sm="6" md="4" class="pb-1">
      <p class="font-weight-medium text-color mb-0 lh-22">Country</p>
      <p class="font-weight-medium mb-0 lh-22 text-color1">{{ partner?.country }}</p>
    </v-col>
  </v-row>
  <v-row class="border-b-sm px-5">
    <v-col cols="12" sm="6" md="4" class="pb-1">
      <p class="font-weight-medium text-color mb-0 lh-22">Partner Type</p>
      <p class="font-weight-medium mb-0 lh-22 text-color1 text-uppercase">{{ partner?.type }}</p>
    </v-col>
  </v-row>
</template>
