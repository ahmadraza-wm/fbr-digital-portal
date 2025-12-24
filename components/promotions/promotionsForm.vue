<script setup>
import { useOnlinePromotions } from "@/composables/useOnlinePromotions";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
const countryCurrencyStore = useCountryCurrencyStore();
const { countries } = storeToRefs(countryCurrencyStore);
const { $axios } = useNuxtApp();

const {
  typeItem,
  agents,
  loading,
  headers,
  statusItem,
  deleteBank,
  createOnlinePromotion,
  bankList,
  fetchBanks,
} = useOnlinePromotions();

const route = useRoute();
const existingFileName = ref("");
const requiredValidator = (v) => !!v || "This field is required";
const fileRequiredValidator = (v) => {
  if (props.isEdit && existingFileName.value && (!v || v.length === 0)) {
    return true;
  }
  return (Array.isArray(v) && v.length > 0) || "Attachment is required";
};
const props = defineProps({
  isEdit: Boolean,
});

const start = ref(null);
const expire = ref(null);
const country = ref('');
const type = ref('');
const files = ref([]);

const onSubmit = async () => {
  const formData = new FormData();
  formData.append("country_id", country.value);
  formData.append("starts_at", start.value);
  formData.append("expires_at", expire.value);
  formData.append("type", type.value);
  formData.append("status", "active");
 if (files.value && files.value.length > 0) {
    formData.append("files[]", files.value[0]);

  }


  const promotionId = route.params?.id ?? null;

  await createOnlinePromotion(formData, props.isEdit, promotionId);
};

const attachedImageUrl = ref("");

onMounted(async () => {
  if (props.isEdit && route.params.id) {
    try {
      const response = await $axios.get(`/promotions/${route.params.id}`);
      const promo = response.data.data;
      country.value = promo.country_id;
      start.value = promo.starts_at;
      expire.value = promo.expires_at;
      type.value = promo.type;
      const firstMedia = promo.documents?.[0]?.media?.[0];
      existingFileName.value = firstMedia?.original_name || "";
      attachedImageUrl.value = firstMedia?.url || "";
    } catch (err) {
      showError("Failed to load promotion");
    }
  }
});

const openImageInNewTab = () => {
  if (attachedImageUrl.value) {
    window.open(attachedImageUrl.value, "_blank");
  } else {
    showError("No attachment found.");
  }
};

</script>
<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm" style="background-color: lightgrey;">
          <div class="d-flex align-center">
            <BackNavigation />
            <h4 class="text-h5 py-3">
              {{ isEdit ? "Edit" : "Add" }} Promotions
            </h4>
          </div>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="px-4 pt-4">
      <VForm @submit.prevent="onSubmit">
        <VRow>
          <v-col cols="12">
            <span class="fs-15 label-color font-weight-medium">Country<span class="text-red">*</span></span>
            <AppAutocomplete :items="countries" v-model="country" item-title="name" item-value="id"
              placeholder="Select country" :rules="[requiredValidator]" />
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
            <span class="fs-15 label-color font-weight-medium">Type<span class="text-red">*</span></span>
            <AppAutocomplete :items="typeItem" v-model="type" placeholder="Select type" :rules="[requiredValidator]" />
          </v-col>
          <v-col cols="12" md="6">
            <span class="fs-15 label-color font-weight-medium">Attachment<span class="text-red">*</span></span>
            <div class="d-flex gap-3">
              <VFileInput chips multiple v-model="files" :rules="[fileRequiredValidator]" />
              <VBtn color="primary" variant="elevated" v-if="isEdit" @click="openImageInNewTab">
                View Attached Image
              </VBtn>
            </div>
          </v-col>
          <v-col cols="12" class="d-flex justify-end gap-4">
            <VBtn type="reset" color="secondary" variant="tonal" @click="resetForm">
              Reset
            </VBtn>
            <VBtn type="submit" variant="tonal" class="login-btn" :loading="loading">
              {{ isEdit ? "Update" : "Add" }} Promotion
            </VBtn>
          </v-col>
        </VRow>
      </VForm>
    </v-card-text>
  </v-card>
</template>
