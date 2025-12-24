<script setup>
import RuleForm from "@/components/rules/ruleForm.vue";
import useUiFeedback from "@/composables/useUiFeedback";
import AuditLog from '@/components/AuditLog.vue'

const { $axios } = useNuxtApp();
import { useRoute } from "vue-router";
const route = useRoute();
const permissionStore = usePermissionStore()
definePageMeta({
  middleware: "auth",
  permission: "rules.update"
})
const {
  loading,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  confirmAction,
} = useUiFeedback();

const ruleData = ref(null);
const desserts = ref([]);

const fetchRuleDetails = async () => {
  try {
    const res = await $axios.get(`/rules/${route.params.id}`);
    ruleData.value = res.data.data;

    desserts.value =
      ruleData.value.rule_ranges?.map((range, index) => ({
        id: range.id ?? (index + 1).toString(),
        from: Number(range.from).toFixed(2),
        to: Number(range.to).toFixed(2),
        margin: range.margin != null ? Number(range.margin).toFixed(2) : "",
        type: range.type,
      })) || [];
  } catch (e) {
    console.error("Failed to fetch rule details", e);
  }
};

// Add new range row
const addRow = () => {
  desserts.value.push({
    id: Date.now().toString(),
    from: "",
    to: "",
    margin: "",
    type: "",
  });
};

const removeRow = (index) => {
  desserts.value.splice(index, 1);
};

const updateRanges = async () => {
  try {
    const response = await $axios.patch(`/rule/ranges/${route.params.id}`, {
      range: desserts.value,
    });

    if (response.data.success) {
      showSuccess("Ranges updated successful!");
    } else {
      showError("Error fetchupdating ranges");
    }
  } catch (error) {
     const messages = error.response?.data?.errors
      ? Object.values(error.response.data.errors).flat()
      : error.response?.data?.message || "Something went wrong";
      showError(messages);
  }
};

onMounted(async () => {
  try {
    await Promise.all([fetchRuleDetails()]);
  } catch (error) {
    console.error("Error during setup:", error);
  }
});
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Edit Rule</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="pt-1 my-4 pb-3">
      <RuleForm :isEdit="true" :ruleData="ruleData" />
    </v-card-text>
  </v-card>

  <v-card class="my-6 shadow">
    <v-row>
      <v-col cols="12 pb-0">
        <v-card-title
          class="d-flex justify-space-between align-center"
          style="background-color: lightgray"
        >
          <h4 class="text-h5 py-3">Rule Ranges</h4>
          <VBtn
            type="button"
            variant="elevated"
            color="primary"
            @click="addRow" v-if="permissionStore.hasPermission('rule.ranges.update')"
          >
            Add Row
          </VBtn>
        </v-card-title>
      </v-col>

      <VCol cols="12 pt-0 pb-0">
        <VCardText class="px-0 pt-0">
          <VTable class="text-no-wrap border-b-sm">
            <thead>
              <tr>
                <th>#</th>
                <th>From</th>
                <th>To</th>
                <th>Margin</th>
                <th>Type</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              <tr v-if="desserts.length === 0">
                <td colspan="6" class="text-center text-grey">
                  No ranges found. Click "Add Row" to add one.
                </td>
              </tr>
              <tr v-for="(item, index) in desserts" :key="index">
                <td>{{ index + 1 }}</td>
                <td>
                  <VTextField
                    v-model="item.from"
                    density="compact"
                    type="number"
                    variant="outlined"
                    hide-details
                  />
                </td>
                <td>
                  <VTextField
                    v-model="item.to"
                    density="compact"
                    type="number"
                    variant="outlined"
                    hide-details
                  />
                </td>
                <td>
                  <VTextField
                    v-model="item.margin"
                    density="compact"
                    type="number"
                    variant="outlined"
                    hide-details
                  />
                </td>
                <td>
                  <VSelect
                    v-model="item.type"
                    :items="[
                      { title: 'Flat', value: 'flat' },
                      { title: 'Percentage', value: 'percentage' },
                    ]"
                    density="compact"
                    variant="outlined"
                    hide-details
                    placeholder="Select Type"
                  />
                </td>
                <td>
                  <VBtn
                    icon
                    variant="text"
                    color="black"
                    @click="removeRow(index)"
                  >
                    <VIcon icon="tabler-trash" />
                  </VBtn>
                </td>
              </tr>
            </tbody>
          </VTable>

          <VCol cols="12" class="mt-4 text-end">
            <VBtn variant="tonal" class="login-btn" @click="updateRanges">
              Update
            </VBtn>
          </VCol>
        </VCardText>
      </VCol>
    </v-row>
  </v-card>
    <AuditLog module="Rule" :id="route.params.id" />
</template>
