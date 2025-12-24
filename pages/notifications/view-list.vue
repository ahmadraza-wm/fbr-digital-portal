<template>
  <v-card>
    <v-row>
      <v-col cols="12">
        <v-card-title class="border-b-sm">
          <h4 class="text-h5 py-3">Notifications</h4>
        </v-card-title>
      </v-col>
    </v-row>
    <v-card-text class="pt-0 px-0 pb-3">
      <VDataTable hide-default-footer class="border-b">
        <tbody>
          <tr class="unread">
            <td class="text-wrap">
              <span class="fs-15">
                Customer has created new complaint.
              </span>
            </td>
            <td>
              <VChip :style="{
                backgroundColor: 1 != 1 ? '#28C76F29' : '#FF9F4329',
                color: 1 != 1 ? '#28C76F' : '#FF9F43',

                marginTop: '2px',
              }" class="font-weight-light fs-12 p-1" size="small">
                {{ 1 != 1 ? "Opened" : "Closed" }}
              </VChip>
            </td>
            <td>
              <VBtn variant="text" color="primary" to="/payments/detail/9f12c91a-7ac0-4ca9-adc8-4a3f732db13a">
                <u>Click for details</u>
              </VBtn>
            </td>
            <td>
              <span class="fs-15">4 months ago</span>
            </td>
            <td>
              <VBtn variant="text" color="primary">
                <u>Mark as read</u>
              </VBtn>
            </td>
          </tr>
          <tr class="unread">
            <td class="text-wrap">
              <span class="fs-15">
                Customer has created new complaint.
              </span>
            </td>
            <td>
              <VChip :style="{
                backgroundColor: 1 != 1 ? '#28C76F29' : '#FF9F4329',
                color: 1 != 1 ? '#28C76F' : '#FF9F43',

                marginTop: '2px',
              }" class="font-weight-light fs-12 p-1" size="small">
                {{ 1 != 1 ? "Opened" : "Closed" }}
              </VChip>
            </td>
            <td>
              <VBtn variant="text" color="primary" to="/payments/detail/9f12c91a-7ac0-4ca9-adc8-4a3f732db13a">
                <u>Click for details</u>
              </VBtn>
            </td>
            <td>
              <span class="fs-15">4 months ago</span>
            </td>
            <td>
              <VBtn variant="text" color="primary">
                <u>Mark as read</u>
              </VBtn>
            </td>
          </tr>
          <tr class="unread">
            <td class="text-wrap">
              <span class="fs-15">
                Customer has created new complaint.
              </span>
            </td>
            <td>
              <VChip :style="{
                backgroundColor: 1 != 1 ? '#28C76F29' : '#FF9F4329',
                color: 1 != 1 ? '#28C76F' : '#FF9F43',

                marginTop: '2px',
              }" class="font-weight-light fs-12 p-1" size="small">
                {{ 1 != 1 ? "Opened" : "Closed" }}
              </VChip>
            </td>
            <td>
              <VBtn variant="text" color="primary" to="/payments/detail/9f12c91a-7ac0-4ca9-adc8-4a3f732db13a">
                <u>Click for details</u>
              </VBtn>
            </td>
            <td>
              <span class="fs-15">4 months ago</span>
            </td>
            <td>
              <VBtn variant="text" color="primary">
                <u>Mark as read</u>
              </VBtn>
            </td>
          </tr>
          <tr class="unread">
            <td class="text-wrap">
              <span class="fs-15">
                Customer has created new complaint.
              </span>
            </td>
            <td>
              <VChip :style="{
                backgroundColor: 1 != 1 ? '#28C76F29' : '#FF9F4329',
                color: 1 != 1 ? '#28C76F' : '#FF9F43',

                marginTop: '2px',
              }" class="font-weight-light fs-12 p-1" size="small">
                {{ 1 != 1 ? "Opened" : "Closed" }}
              </VChip>
            </td>
            <td>
              <VBtn variant="text" color="primary" to="/payments/detail/9f12c91a-7ac0-4ca9-adc8-4a3f732db13a">
                <u>Click for details</u>
              </VBtn>
            </td>
            <td>
              <span class="fs-15">4 months ago</span>
            </td>
            <td>
              <VBtn variant="text" color="primary">
                <u>Mark as read</u>
              </VBtn>
            </td>
          </tr>
          <tr class="unread">
            <td class="text-wrap">
              <span class="fs-15">
                Customer has created new complaint.
              </span>
            </td>
            <td>
              <VChip :style="{
                backgroundColor: 1 != 1 ? '#28C76F29' : '#FF9F4329',
                color: 1 != 1 ? '#28C76F' : '#FF9F43',

                marginTop: '2px',
              }" class="font-weight-light fs-12 p-1" size="small">
                {{ 1 != 1 ? "Opened" : "Closed" }}
              </VChip>
            </td>
            <td>
              <VBtn variant="text" color="primary" class="d-none" to="/payments/detail/9f12c91a-7ac0-4ca9-adc8-4a3f732db13a">
                <u>Click for details</u>
              </VBtn>
            </td>
            <td>
              <span class="fs-15">4 months ago</span>
            </td>
            <td>
              <VBtn variant="text" color="primary">
                <u>Mark as read</u>
              </VBtn>
            </td>
          </tr>
          <tr>
            <td class="text-wrap">
              <span class="fs-15">
                Customer has created new complaint.
              </span>
            </td>
            <td>
              <VChip :style="{
                backgroundColor: 1 != 1 ? '#28C76F29' : '#FF9F4329',
                color: 1 != 1 ? '#28C76F' : '#FF9F43',

                marginTop: '2px',
              }" class="font-weight-light fs-12 p-1" size="small">
                {{ 1 != 1 ? "Opened" : "Closed" }}
              </VChip>
            </td>
            <td>
              <VBtn variant="text" color="primary" to="/payments/detail/9f12c91a-7ac0-4ca9-adc8-4a3f732db13a">
                <u>Click for details</u>
              </VBtn>
            </td>
            <td>
              <span class="fs-15">4 months ago</span>
            </td>
            <td>
              <VBtn variant="text" color="primary" class="d-none">
                <u>Mark as read</u>
              </VBtn>
            </td>
          </tr>
        </tbody>
      </VDataTable>
    </v-card-text>
  </v-card>
</template>
<style lang="scss">
.unread {
  background-color: #DCF0F0;
}
</style>
