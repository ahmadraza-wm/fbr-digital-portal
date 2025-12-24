<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title style="background-color: lightgrey;">
          <h4 class="text-h5 py-3">Manage Auto Rates</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-divider></v-divider>

    <!-- Form -->
    <v-card-text class="pt-1 my-4 pb-3">
      <VForm @submit.prevent="searchData">
        <v-row class="ps-0">
          <v-col cols="12" sm="10" md="10" class="ps-1">
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <span class="fs-15 label-color">Sending Countries</span>
                <v-autocomplete name="sendingCountry" v-model="selectedSendingCountry" :items="sending_countries"
                  item-title="name" item-value="id" placeholder="Sending Country" multiple autocomplete="off" />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <span class="fs-15 label-color">Receiving Countries</span>
                <v-autocomplete name="receivingCountry" v-model="selectedReceivingCountry" :items="receiving_countries"
                  item-title="name" item-value="id" placeholder="Receiving Country" multiple autocomplete="off" />
              </v-col>
            </v-row>
          </v-col>
          <VCol cols="12 d-flex gap-2 align-end" sm="10" md="2">
            <VBtn type="submit" variant="tonal" class="login-btn">Search</VBtn>
            <VBtn type="reset" @click="resetForm" variant="tonal" color="secondary">
              Reset
            </VBtn>
          </VCol>
        </v-row>
      </VForm>
    </v-card-text>

    <!-- Table -->
    <VCardText class="px-0 pb-0" v-show="showTable">
      <transition name="fade">
        <VTable class="text-no-wrap border">
          <thead>
            <tr>
              <th>#</th>
              <th>Main Agent</th>
              <th>Payer</th>
              <th>Method</th>
              <th>Sending Currency</th>
              <th>Receiving Currency</th>
              <th>Main Agent Rate</th>
              <th>Rate</th>
              <th>Last Updated</th>
            </tr>
          </thead>

          <tbody>
            <template v-for="agent in autoRates" :key="agent.agent_id + '-' + agent.receiving_country">
              <template v-if="agent.payers && agent.payers.length">
                <tr>
                  <td colspan="7">
                    <VChip class="font-weight-light fs-12 p-1 bg-red fs-13" size="small">
                      {{ agent.sending_country }} to
                      {{ agent.receiving_country }}
                    </VChip>
                  </td>
                  <td colspan="2">
                    <AppTextField v-model="agent.rate" type="number" placeholder="Set Rate for All"
                      @input="formatTwoDecimalsWithAlert" v-if="permissionStore.hasPermission('update.rates')" />
                  </td>
                </tr>

                <tr v-for="(payer, index) in agent.payers" :key="`agent-${agent.agent_id}-payer-${payer.payer_id}`">
                  <td>{{ index + 1 }}</td>
                  <td>{{ agent.agent_business_name }}</td>
                  <td>{{ payer.payer_name }}</td>
                  <td>{{ formatMethod(payer.payer_method) }}</td>
                  <td>{{ agent.sending_currency }}</td>
                  <td>{{ payer.receiving_currency }}</td>
                  <td>{{ payer.main_agent_rate }}</td>
                  <td class="setRateInput">
                    <AppTextField v-model="payer.rate" type="number" class="pa-0" density="compact" hide-details
                      style="max-inline-size: 100%;" @input="formatTwoDecimalsWithAlert" :disabled="!permissionStore.hasPermission('update.rates')" />
                  </td>
                  <td>{{ payer.created_at }}</td>
                </tr>
              </template>
            </template>
          </tbody>
        </VTable>
      </transition>
      <VCol cols="12 d-flex justify-end">
        <VBtn variant="elevated" color="white" class="my-2 login-btn" @click="updateRates" v-if="permissionStore.hasPermission('update.rates')">
          Update
        </VBtn>
      </VCol>
    </VCardText>
  </v-card>
</template>

<script setup>
import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { storeToRefs } from "pinia";
import { ref } from "vue";
const permissionStore = usePermissionStore()
definePageMeta({
  middleware: "auth",
  permission: "manage.rates"
})
const {
  loading,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  confirmAction,
} = useUiFeedback();

const { $axios } = useNuxtApp();
const countryCurrencyStore = useCountryCurrencyStore();
const { sending_countries, receiving_countries } =
  storeToRefs(countryCurrencyStore);

const selectedSendingCountry = ref([]);
const selectedReceivingCountry = ref([]);
const showTable = ref(false);
const autoRates = ref([]);
const originalRates = ref([]);

const formatMethod = (method) => {
  if (!method) return "";
  return method
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const searchData = async () => {
  showLoading("Fetching rates...");
  console.log("Start processing...");
  try {
    const res = await $axios.get("/auto/rate/filter", {
      params: {
        sending_countries: selectedSendingCountry.value,
        receiving_countries: selectedReceivingCountry.value,
      },
    });

    const receivingCountryNames = selectedReceivingCountry.value
      .map((id) => {
        const match = receiving_countries.value.find((c) => c.id === id);
        return match?.name;
      })
      .filter(Boolean);

    const processed = [];

    res.data.data.forEach((agent) => {
      if (agent.payers && agent.payers.length > 0) {
        receivingCountryNames.forEach((rcName) => {
          const filteredPayers = agent.payers.filter(
            (payer) => payer.receiving_country === rcName
          );
          if (filteredPayers.length > 0) {
            processed.push({
              agent_id: agent.agent_id,
              agent_business_name: agent.agent_business_name,
              sending_country: agent.sending_country,
              sending_currency: agent.sending_currency,
              receiving_country: rcName,
              rate: null,
              payers: filteredPayers.map((payer) => ({
                ...payer,
                rate: payer.rate,
              })),
            });
          }
        });
      }
    });
    autoRates.value = processed;
    originalRates.value = JSON.parse(JSON.stringify(processed));
    showTable.value = true;
  } catch (e) {
    showError("Error fetching rates");
  } finally {
    hideLoading();
  }
};

const resetForm = () => {
  selectedSendingCountry.value = [];
  selectedReceivingCountry.value = [];
  showTable.value = false;
  autoRates.value = [];
};

const formatTwoDecimalsWithAlert = (event) => {
  let value = event.target.value;

  value = value.replace(/[^0-9.]/g, "");

  const parts = value.split(".");
  if (parts.length > 2) {
    value = parts[0] + "." + parts[1];
  }

  if (value.includes(".")) {
    const [intPart, decPart] = value.split(".");
    if (decPart.length > 2) {
      value = intPart + "." + decPart.slice(0, 2);
      event.target.value = value;

      showError(
        `Rate should be ${intPart}.${decPart.slice(0, 2)} or ${intPart}.${(
          parseInt(decPart.slice(0, 2)) + 1
        )
          .toString()
          .padStart(2, "0")}`
      );
      return;
    }
  }
  event.target.value;
};

const updateRates = async () => {
  showLoading("Updating Rates...");

  try {
    const payload = [];

    autoRates.value.forEach((agent, agentIndex) => {
      const originalAgent = originalRates.value[agentIndex];

      const parentRateChanged =
        agent.rate !== null &&
        agent.rate !== "" &&
        parseFloat(agent.rate).toFixed(2) !==
        parseFloat(originalAgent.rate ?? "").toFixed(2);

      if (parentRateChanged) {
        agent.payers.forEach((payer) => {
          payload.push({
            agent_id: agent.agent_id,
            payer_id: payer.payer_id,
            sending_currency: agent.sending_currency,
            receiving_currency: payer.receiving_currency,
            main_agent_rate: parseFloat(
              Number(payer.main_agent_rate ?? 0).toFixed(2)
            ),
            rate: parseFloat(Number(agent.rate).toFixed(2)),
          });
        });
      } else {
        agent.payers.forEach((payer) => {
          const originalPayer = originalAgent.payers.find(
            (p) => p.payer_id === payer.payer_id
          );
          if (
            parseFloat(payer.rate).toFixed(2) !==
            parseFloat(originalPayer.rate).toFixed(2)
          ) {
            payload.push({
              agent_id: agent.agent_id,
              payer_id: payer.payer_id,
              sending_currency: agent.sending_currency,
              receiving_currency: payer.receiving_currency,
              main_agent_rate: parseFloat(
                Number(payer.main_agent_rate ?? 0).toFixed(2)
              ),
              rate: parseFloat(Number(payer.rate).toFixed(2)),
            });
          }
        });
      }
    });

    if (!payload.length) {
      showError("No rates changed — nothing to update.");
      hideLoading();
      return;
    }

    await $axios.post("/auto/rate/update", { rates: payload });
    showSuccess("Rates updated successfully");

    await searchData();
  } catch (e) {
    console.error(e);
    showError("Failed to update rates");
  } finally {
    hideLoading();
  }
};

const handleRateBlur = async (agent, payer) => {
  payer.rate = parseFloat(payer.rate);
  payer.rate = parseFloat(payer.rate.toFixed(2));
  payer.main_agent_rate = parseFloat(payer.main_agent_rate);
  payer.main_agent_rate = parseFloat(payer.main_agent_rate.toFixed(2));

  try {
    showLoading("Updating Rate...");

    await $axios.post("/auto/rate/update", {
      rates: [
        {
          agent_id: agent.agent_id,
          payer_id: payer.payer_id,
          sending_currency: agent.sending_currency,
          receiving_currency: payer.receiving_currency,
          main_agent_rate: payer.main_agent_rate,
          rate: payer.rate,
        },
      ],
    });

    showSuccess("Rate updated successfully");
  } catch (e) {
    console.error("Error updating rate", e);
    showError("Failed to update rate");
  } finally {
    hideLoading();
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.setRateInput .app-text-field .v-input .v-input__control {
  grid-area: auto !important;
}
</style>
