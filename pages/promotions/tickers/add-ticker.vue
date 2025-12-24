<script setup>
const { $axios } = useNuxtApp();
import { useTickers } from "@/composables/useTickers";
definePageMeta({
  middleware: "auth",
  permission: "tickers.store"
})
const countryCurrencyStore = useCountryCurrencyStore();
const { sending_countries, receiving_countries } =
  storeToRefs(countryCurrencyStore);
const requiredValidator = (v) => !!v || "This field is required";

const { agents, channelItem, importanceItem, headers, createTicker } =
  useTickers();

const channel = ref(null);
const main_agent = ref(null);
const sub_agent = ref(null);
const s_country = ref(null);
const r_country = ref(null);
const start = ref(null);
const expire = ref(null);
const importance = ref(null);
const title = ref(null);
const description = ref(null);

const resetForm = () => {
  start.value = "";
  expire.value = "";
};

const showAgent = computed(() => channel.value === "agent");

const getMainAgents = computed(() => {
  return agents.value
    .filter((agent) => agent.type === "main_agent")
    .map((agent) => ({
      label: agent.name,
      value: agent.id,
    }));
});

const getSubAgents = computed(() => {
  return agents.value
    .filter((agent) => agent.type === "sub_agent")
    .map((agent) => ({
      label: agent.name,
      value: agent.id,
    }));
});

const handleSubmit = () => {
  const payload = {
    channel: channel.value,
    sending_country_id: s_country.value,
    receiving_country_id: r_country.value,
    starts_at: start.value,
    expires_at: expire.value,
    importance: importance.value,
    ticker_title: title.value,
    ticker_description: description.value,
    status: 'active'
  };

  if (channel.value === 'agent') {
    payload.main_agent_id = main_agent.value;
    payload.sub_agent_id = sub_agent.value;
  }

  createTicker(payload);
};
</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm" style="background-color: lightgrey;">
          <div class="d-flex align-center">
            <BackNavigation />
            <h4 class="text-h5 py-3">Add Ticker</h4>
          </div>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="px-4 pt-4">
      <VForm @submit.prevent="handleSubmit">
        <VRow>
          <v-col cols="12">
            <span class="fs-15 label-color font-weight-medium">Channel<span class="text-red">*</span></span>
            <AppAutocomplete :items="channelItem" v-model="channel" placeholder="Select channel"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Sending Country<span class="text-red">*</span></span>
            <AppAutocomplete :items="sending_countries" item-title="name" item-value="id" v-model="s_country"
              placeholder="Select sending country" :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Receiving Country</span>
            <AppAutocomplete :items="receiving_countries" item-title="name" item-value="id" v-model="r_country"
              placeholder="Select receiving country" />
          </v-col>
          <v-col cols="12" md="6" v-if="showAgent">
            <span class="fs-15 label-color font-weight-medium">Main Agent</span>
            <AppAutocomplete :items="getMainAgents" item-title="label" item-value="value" v-model="main_agent"
              placeholder="Select main agent" />
          </v-col>
          <v-col cols="12" md="6" v-if="showAgent">
            <span class="fs-15 label-color font-weight-medium">Sub Agent</span>
            <AppAutocomplete :items="getSubAgents" item-title="label" item-value="value" v-model="sub_agent"
              placeholder="Select sub agent" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Start At<span class="text-red">*</span></span>
            <AppDateTimePicker name="start" v-model="start" :rules="[requiredValidator]" placeholder="dd/mm/yyyy"
              :config="{ dateFormat: 'd-m-Y' }" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Expire At<span class="text-red">*</span></span>
            <AppDateTimePicker name="expire" v-model="expire" :rules="[requiredValidator]" placeholder="dd/mm/yyyy"
              :config="{ dateFormat: 'd-m-Y' }" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Importance<span class="text-red">*</span></span>
            <AppAutocomplete :items="importanceItem" v-model="importance" placeholder="Select importance"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Ticker Title<span class="text-red">*</span></span>
            <AppTextField name="title" type="text" v-model="title" placeholder="Ticker title"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12">
            <span class="fs-15 label-color font-weight-medium">Ticker Description<span class="text-red">*</span></span>
            <AppTextarea rows="5" name="description" v-model="description" class="cursor-pointer"
              placeholder="Type here" :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" class="d-flex justify-end gap-4">
            <VBtn type="reset" color="secondary" variant="tonal" @click="resetForm">
              Reset
            </VBtn>
            <VBtn type="submit" variant="tonal" class="login-btn">
              Add Ticker
            </VBtn>
          </v-col>
        </VRow>
      </VForm>
    </v-card-text>
  </v-card>
</template>
