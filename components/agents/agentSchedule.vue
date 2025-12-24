<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAgents } from "@/composables/useAgents";
import { useRoute } from "vue-router";
const permissionStore = usePermissionStore()

const route = useRoute();
const addform = ref('');
const { agentSchedule, GetAgentSchedule, StoreAgentSchedule, DelAgentSchedule, UpdateAgentSchedule } = useAgents();
const agentId = route.params.id;
const editSchedule = ref(null);

const status = [
  { title: 'Active', value: 1 },
  { title: 'Inactive', value: 0 }
];

const headers = computed(() => {
  const base = [
    { title: "#", key: "sr" },
    { title: "Days", key: "day" },
    { title: "Start Time", key: "start_time" },
    { title: "End Time", key: "end_time" },
    { title: "Status", key: "status" },
  ];

  if (
    permissionStore.hasPermission('agent.schedule.update') ||
    permissionStore.hasPermission('agent.schedule.destroy')
  ) {
    base.push({ title: "Action", key: "action" });
  }

  return base;
});


const days = [
  { title: 'Monday', value: 'monday' },
  { title: 'Tuesday', value: 'tuesday' },
  { title: 'Wednesday', value: 'wednesday' },
  { title: 'Thursday', value: 'thursday' },
  { title: 'Friday', value: 'friday' },
  { title: 'Saturday', value: 'saturday' },
  { title: 'Sunday', value: 'sunday' }
];

const form = ref({
  days: [],
  from: '',
  to: '',
  status: null
});

const availableDays = computed(() => {
  const scheduledDays = agentSchedule.value.map(item => item.day.toLowerCase());
  return days.filter(day => !scheduledDays.includes(day.value));
});

const submitForm = async () => {
  const { valid } = await addform.value.validate();
  if (!valid) return;

  if (!editSchedule.value) {
    const schedules = form.value.days.map(day => ({
      day: day,
      start_time: form.value.from,
      end_time: form.value.to,
      status: form.value.status
    }));

    await StoreAgentSchedule(agentId, { schedules });
  }
  else{
    const payload = 
    {
      day: form.value.days[0],
      start_time: form.value.from,
      end_time: form.value.to,
      status: form.value.status
    }
    await UpdateAgentSchedule(editSchedule.value,payload);
    editSchedule.value = null;
  }
  await GetAgentSchedule(agentId);
  Reset();
  form.value.days = [];
};

const delSchedule = async (id) => {
  await DelAgentSchedule(id);
  await GetAgentSchedule(agentId);
};

const populateForm = (item) => {
  editSchedule.value = item.id;
  form.value.days[0] = item.day
  form.value.from = item.start_time;
  form.value.to = item.end_time;
  form.value.status = item.status;
};

const Reset = () => {
  editSchedule.value = null;
  form.value.days = '';
  form.value.from = '';
  form.value.to = '';
  form.value.status = null;
}

onMounted(() => {
  GetAgentSchedule(agentId);
});
</script>
<template>
  <VCard>
    <v-card-title class="border-b-sm" style="background-color: lightgrey;">
      <h4 class="text-h5 py-3">Schedule</h4>
    </v-card-title>
    <v-card-text v-if="editSchedule || permissionStore.hasPermission('agent.schedule.store')">
      <VForm @submit.prevent="submitForm" ref="addform">
        <v-row class="mt-1">
          <v-col cols="12" sm="6" md="3">
            <span class="fs-13 label-color">Days<span class="text-red">*</span></span>
            <v-autocomplete :items="availableDays" v-model="form.days" placeholder="Select days" multiple
              item-title="title" item-value="value" :rules="[requiredValidator]" v-if="!editSchedule" />
            <v-col v-if="editSchedule" class="bg-grey py-2 rounded text-capitalize">
              {{ form.days[0] }}
            </v-col>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-13 label-color">From<span class="text-red">*</span></span>
            <AppTimePicker v-model="form.from" placeholder="Select from time" :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-13 label-color">To<span class="text-red">*</span></span>
            <AppTimePicker v-model="form.to" placeholder="Select to time" :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <span class="fs-13 label-color">Status<span class="text-red">*</span></span>
            <v-autocomplete :items="status" v-model="form.status" placeholder="Select days"
              :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12 d-flex justify-end gap-3">
            <VBtn type="reset" variant="tonal" color="secondary" @click="Reset">
              Reset
            </VBtn>
            <VBtn type="submit" variant="tonal" class="login-btn">
              {{ editSchedule ? "Update Schedule" : "Add Schedule" }}
            </VBtn>
          </v-col>
        </v-row>
      </VForm>
    </v-card-text>
    <v-card-text class="px-0 pb-0">
      <v-data-table :headers="headers" :items="agentSchedule" item-key="name" hide-default-footer
        class="border-t-sm border-b-sm">
        <template #item.sr="{ index }">
          {{ index + 1 }}
        </template>
        <template #item.status="{ item }">
          <p class="font-weight-medium mb-0 lh-22 text-color1">
            <VChip :style="{
              backgroundColor:
                item?.status === 1 ? '#28C76F29' : '#FF9F4329',
              color: item?.status === 1 ? '#28C76F' : '#FF9F43',

              marginTop: '2px',
            }" class="font-weight-light fs-12 p-1" size="small">
              {{ item?.status === 1 ? "Active" : "Inactive" }}
            </VChip>
          </p>
        </template>
        <template #item.day="{ item }">
          <span class="text-capitalize">
            {{ item.day }}
          </span>
        </template>
        <template #item.action="{ item }">
          <VBtn icon variant="text" v-if="permissionStore.hasPermission('agent.schedule.update')">
            <VIcon icon="tabler-edit" @click="populateForm(item)" color="primary"></VIcon>
          </VBtn>
          <VBtn icon variant="text" v-if="permissionStore.hasPermission('agent.schedule.destroy')">
            <VIcon icon="tabler-trash" color="error" @click="delSchedule(item.id)"></VIcon>
          </VBtn>
        </template>
      </v-data-table>
    </v-card-text>
  </VCard>
</template>
