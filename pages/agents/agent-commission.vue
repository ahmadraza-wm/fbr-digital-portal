<script setup>
import { ref } from 'vue'

const submitForm = () => {
}

const popup = ref(false)
const status = ref(false)

const form = ref({
  name: "Talha Waris",
  Crf: '',
  Crp: '',
  Country: ''
})

const edit = () => {
  form.value.Country = 'Pakistan'
  form.value.Crf = '1.0'
  form.value.Crp = '1.0'
  status.value = true
}

const resetForm = () => {
  status.value = false
}

const country = [
  { "title": "Afghanistan", "value": "Afghanistan" },
  { "title": "Albania", "value": "Albania" },
  { "title": "Algeria", "value": "Algeria" },
  { "title": "Andorra", "value": "Andorra" },
  { "title": "Angola", "value": "Angola" },
  { "title": "Antigua and Barbuda", "value": "Antigua and Barbuda" },
  { "title": "Argentina", "value": "Argentina" },
  { "title": "Armenia", "value": "Armenia" },
  { "title": "Australia", "value": "Australia" },
  { "title": "Austria", "value": "Austria" },
  { "title": "Azerbaijan", "value": "Azerbaijan" },
  { "title": "Bahamas", "value": "Bahamas" },
  { "title": "Bahrain", "value": "Bahrain" },
  { "title": "Bangladesh", "value": "Bangladesh" },
  { "title": "Barbados", "value": "Barbados" },
  { "title": "Belarus", "value": "Belarus" },
  { "title": "Belgium", "value": "Belgium" },
  { "title": "Belize", "value": "Belize" },
  { "title": "Benin", "value": "Benin" },
  { "title": "Bhutan", "value": "Bhutan" },
  { "title": "Bolivia", "value": "Bolivia" },
  { "title": "Bosnia and Herzegovina", "value": "Bosnia and Herzegovina" },
  { "title": "Botswana", "value": "Botswana" },
  { "title": "Brazil", "value": "Brazil" },
  { "title": "Brunei", "value": "Brunei" },
  { "title": "Bulgaria", "value": "Bulgaria" },
  { "title": "Burkina Faso", "value": "Burkina Faso" },
  { "title": "Burundi", "value": "Burundi" },
  { "title": "Pakistan", "value": "Pakistan" },
]
</script>

<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm d-flex align-center" style="background-color: lightgrey;">
          <BackNavigation />
          <h4 class="text-h5 py-4">Agent Commission</h4>
        </v-card-title>
      </v-col>
    </v-row>

    <v-card-text class="px-0 pt-0">
      <v-row class="border-b-md px-5">
        <v-col cols="6" sm="4" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Agent Code</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">SAMT</p>
        </v-col>
        <v-col cols="6" sm="4" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Main Agent</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">talha@devzone.services</p>
        </v-col>
        <v-col cols="6" sm="4" class="pb-1">
          <p class="font-weight-medium text-color mb-0 lh-22">Country</p>
          <p class="font-weight-medium mb-0 lh-22 text-color1">United Kingdom</p>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card-text class="px-4 py-0">
            <VForm @submit.prevent="submitForm">
              <VRow>
                <VCol cols="12" md="6">
                  <span class="fs-13 label-color">Agent Name</span>
                  <AppTextField type="text" disabled value="Talha Waris" />
                </VCol>

                <VCol cols="12" md="6">
                  <span class="fs-13 label-color">Country<span class="text-red">*</span></span>
                  <AppAutocomplete :items="country" placeholder="Select Country" v-model="form.Country"
                    :rules="[requiredValidator]" />
                </VCol>

                <VCol cols="12" md="6">
                  <span class="fs-13 label-color">Commission Rate Percentage<span class="text-red">*</span></span>
                  <AppTextField placeholder="Commission rate percentage" type="number" v-model="form.Crp"
                    :rules="[requiredValidator]" />
                </VCol>

                <VCol cols="12" md="6">
                  <span class="fs-13 label-color">Commission Rate (Flat)<span class="text-red">*</span></span>
                  <AppTextField placeholder="Commission rate (flat)" type="number" v-model="form.Crf"
                    :rules="[requiredValidator]" />
                </VCol>

                <VCol cols="12" class="d-flex gap-4 justify-end">
                  <VBtn type="reset" color="secondary" variant="tonal" @click="resetForm">Reset</VBtn>
                  <VBtn type="submit" variant="tonal" class="login-btn" :loading="loading">
                    {{ !status ? 'Create Agent Commission' : 'Update Agent Commission' }}
                  </VBtn>
                </VCol>
              </VRow>
            </VForm>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="py-0 px-0">
      <v-table class="text-no-wrap">
        <thead>
          <tr>
            <th>#</th>
            <th>Country</th>
            <th>Commission Percentage</th>
            <th>Commission Rate (Flat)</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>01</td>
            <td>Pakistan</td>
            <td>1.00</td>
            <td>1.00</td>
            <td>27 Sep, 2032 02:10 pm</td>
            <td>
              <VForm @submit.prevent="submitForm">
                <VBtn icon variant="text" color="secondary" class="px-0" @click="edit">
                  <VIcon icon="tabler-edit" />
                </VBtn>
                <VBtn icon type="submit" color="secondary" variant="text" class="px-0" @click="popup = true"
                  target="_blank">
                  <VIcon icon="tabler-trash" />
                </VBtn>
              </VForm>
            </td>
          </tr>
          <tr>
            <td>02</td>
            <td>Pakistan</td>
            <td>1.00</td>
            <td>1.00</td>
            <td>27 Sep, 2032 02:10 pm</td>
            <td>
              <VForm @submit.prevent="submitForm">
                <VBtn icon variant="text" color="secondary" class="px-0" @click="edit">
                  <VIcon icon="tabler-edit" />
                </VBtn>
                <VBtn icon type="submit" color="secondary" variant="text" class="px-0" @click="popup = true"
                  target="_blank">
                  <VIcon icon="tabler-trash" />
                </VBtn>
              </VForm>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>

  <div class="text-center pa-4">
    <v-dialog v-model="popup" max-width="500" persistent transition="scale-transition">
      <v-card>
        <VCardTitle class="border-b-sm d-flex justify-space-between align-center">
          <h4 class="text-h5">Attention</h4>
          <VBtn icon variant="text" color="secondary" class="px-0" @click="popup = false">
            <VIcon icon="tabler-x" />
          </VBtn>
        </VCardTitle>
        <VForm @submit.prevent="">
          <VCardText class="py-3 px-4">
            <VRow>
              <VCol cols="12">
                <span class="fs-16 text-error">Are you sure you want to delete this agent commission? This cannot be
                  undone.</span>
              </VCol>
            </VRow>
          </VCardText>
          <v-card-actions class="border-t-sm pt-3">
            <v-row>
              <v-col cols="12" class="d-flex justify-end">
                <v-btn color="white" variant="elevated" type="submit" class="login-btn" @click="popup = false">
                  Approve
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </VForm>
      </v-card>
    </v-dialog>
  </div>
</template>
