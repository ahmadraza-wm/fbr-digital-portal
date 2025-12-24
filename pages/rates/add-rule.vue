<script setup>
import RuleForm from "@/components/rules/ruleForm.vue";
import BackNavigation from "@/@core/components/BackNavigation.vue";
definePageMeta({
  middleware: "auth",
  permission: "rules.update"
})
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex align-center">
            <BackNavigation />
          <h4 class="text-h5 py-3">Add Rule</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <RuleForm :isEditMode="false" />
    </v-card-text>
  </v-card>
</template>
