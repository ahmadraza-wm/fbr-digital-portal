<script setup>
definePageMeta({
  // middleware: 'auth',
  name: 'fbr-statl',
})

const { checkStatl, getRegType } = useFbrApi()
const fbrToken = useCookie('fbrToken')

// STATL Check
const statl = reactive({
  regno: '',
  date: new Date().toISOString().split('T')[0],
  loading: false,
  result: null,
  error: null,
})

// Registration Type Check
const regType = reactive({
  registrationNo: '',
  loading: false,
  result: null,
  error: null,
})

const checkStatlStatus = async () => {
  if (!statl.regno) return
  statl.loading = true
  statl.result = null
  statl.error = null
  try {
    statl.result = await checkStatl(statl.regno, statl.date)
  }
  catch (err) {
    statl.error = err?.message || 'STATL check failed.'
  }
  finally {
    statl.loading = false
  }
}

const checkRegType = async () => {
  if (!regType.registrationNo) return
  regType.loading = true
  regType.result = null
  regType.error = null
  try {
    regType.result = await getRegType(regType.registrationNo)
  }
  catch (err) {
    regType.error = err?.message || 'Registration type check failed.'
  }
  finally {
    regType.loading = false
  }
}

const statlStatusColor = computed(() => {
  if (!statl.result) return 'secondary'
  return statl.result.status === 'Active' ? 'success' : 'error'
})

const regTypeColor = computed(() => {
  if (!regType.result) return 'secondary'
  return regType.result.REGISTRATION_TYPE === 'Registered' ? 'success' : 'warning'
})
</script>

<template>
  <div>
    <VRow class="mb-4">
      <VCol cols="12">
        <div class="d-flex align-center gap-3">
          <VBtn icon variant="text" :to="{ name: 'fbr-dashboard' }">
            <VIcon icon="tabler-arrow-left" />
          </VBtn>
          <div>
            <h4 class="text-h5 font-weight-bold">
              STATL Lookup
            </h4>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Check taxpayer registration status and type via FBR DIST API
            </p>
          </div>
        </div>
      </VCol>
    </VRow>

    <VAlert type="info" variant="tonal" class="mb-4" density="compact">
      These APIs check whether a taxpayer is active in the FBR system and their registration type (Registered /
      Unregistered).
    </VAlert>

    <VRow>
      <!-- STATL Status Check -->
      <VCol cols="12" md="6">
        <VCard>
          <VCardItem>
            <template #prepend>
              <VAvatar color="warning" variant="tonal">
                <VIcon icon="tabler-activity" />
              </VAvatar>
            </template>
            <VCardTitle>STATL Status Check</VCardTitle>
            <VCardSubtitle>
              POST /dist/v1/statl
            </VCardSubtitle>
          </VCardItem>
          <VDivider />
          <VCardText>
            <VTextField v-model="statl.regno" label="Registration No (NTN)" placeholder="e.g. 0788762"
              variant="outlined" class="mb-3" />
            <VTextField v-model="statl.date" label="Date" type="date" variant="outlined" class="mb-4" />
            <VBtn color="warning" prepend-icon="tabler-search" :loading="statl.loading"
              :disabled="!fbrToken || !statl.regno" block @click="checkStatlStatus">
              Check STATL Status
            </VBtn>

            <!-- Result -->
            <div v-if="statl.result" class="mt-4">
              <VAlert :type="statl.result.status === 'Active' ? 'success' : 'error'" variant="tonal">
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <strong>{{ statl.regno }}</strong>
                    <p class="mb-0 text-caption">
                      Status Code: {{ statl.result['status code'] || statl.result.statuscode }}
                    </p>
                  </div>
                  <VChip :color="statlStatusColor" variant="elevated">
                    {{ statl.result.status }}
                  </VChip>
                </div>
              </VAlert>
            </div>

            <VAlert v-if="statl.error" type="error" variant="tonal" class="mt-4">
              {{ statl.error }}
            </VAlert>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Registration Type Check -->
      <VCol cols="12" md="6">
        <VCard>
          <VCardItem>
            <template #prepend>
              <VAvatar color="info" variant="tonal">
                <VIcon icon="tabler-id-badge" />
              </VAvatar>
            </template>
            <VCardTitle>Registration Type Check</VCardTitle>
            <VCardSubtitle>
              POST /dist/v1/Get_Reg_Type
            </VCardSubtitle>
          </VCardItem>
          <VDivider />
          <VCardText>
            <VTextField v-model="regType.registrationNo" label="Registration No" placeholder="e.g. 0788762"
              variant="outlined" class="mb-4" />
            <VBtn color="info" prepend-icon="tabler-search" :loading="regType.loading"
              :disabled="!fbrToken || !regType.registrationNo" block @click="checkRegType">
              Check Registration Type
            </VBtn>

            <!-- Result -->
            <div v-if="regType.result" class="mt-4">
              <VAlert :type="regType.result.REGISTRATION_TYPE === 'Registered' ? 'success' : 'warning'" variant="tonal">
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <strong>{{ regType.result.REGISTRATION_NO }}</strong>
                    <p class="mb-0 text-caption">
                      Status Code: {{ regType.result.statuscode }}
                    </p>
                  </div>
                  <VChip :color="regTypeColor" variant="elevated">
                    {{ regType.result.REGISTRATION_TYPE }}
                  </VChip>
                </div>
              </VAlert>
            </div>

            <VAlert v-if="regType.error" type="error" variant="tonal" class="mt-4">
              {{ regType.error }}
            </VAlert>
          </VCardText>
        </VCard>
      </VCol>

      <!-- API Info -->
      <VCol cols="12">
        <VCard>
          <VCardItem>
            <VCardTitle>Response Codes Reference</VCardTitle>
          </VCardItem>
          <VDivider />
          <VCardText>
            <VRow>
              <VCol cols="12" md="6">
                <p class="text-body-2 font-weight-semibold mb-2">
                  STATL Status Codes
                </p>
                <VTable density="compact">
                  <thead>
                    <tr>
                      <th>Status Code</th>
                      <th>Status</th>
                      <th>Meaning</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>01</td>
                      <td>
                        <VChip color="error" size="x-small" variant="tonal">
                          In-Active
                        </VChip>
                      </td>
                      <td class="text-caption">
                        Taxpayer is not active
                      </td>
                    </tr>
                    <tr>
                      <td>02</td>
                      <td>
                        <VChip color="error" size="x-small" variant="tonal">
                          In-Active
                        </VChip>
                      </td>
                      <td class="text-caption">
                        Taxpayer not found
                      </td>
                    </tr>
                    <tr>
                      <td>00</td>
                      <td>
                        <VChip color="success" size="x-small" variant="tonal">
                          Active
                        </VChip>
                      </td>
                      <td class="text-caption">
                        Taxpayer is active
                      </td>
                    </tr>
                  </tbody>
                </VTable>
              </VCol>
              <VCol cols="12" md="6">
                <p class="text-body-2 font-weight-semibold mb-2">
                  Registration Type Codes
                </p>
                <VTable density="compact">
                  <thead>
                    <tr>
                      <th>Status Code</th>
                      <th>Type</th>
                      <th>Meaning</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>00</td>
                      <td>
                        <VChip color="success" size="x-small" variant="tonal">
                          Registered
                        </VChip>
                      </td>
                      <td class="text-caption">
                        Registered for sales tax
                      </td>
                    </tr>
                    <tr>
                      <td>01</td>
                      <td>
                        <VChip color="warning" size="x-small" variant="tonal">
                          Unregistered
                        </VChip>
                      </td>
                      <td class="text-caption">
                        Not registered for sales tax
                      </td>
                    </tr>
                  </tbody>
                </VTable>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
