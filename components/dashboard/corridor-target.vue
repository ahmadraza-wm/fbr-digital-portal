<template>
  <v-card class="mt-5">
      <v-card-title class="d-flex align-center" style="background-color: #d5d1fb;">
        <h4 class="text-h5 py-3">Corridor Target (Current Week/Month)</h4>
      </v-card-title>
      <v-card-text class="px-0 pb-0">
              <v-table>
                <thead>
                  <tr>
                    <th rowspan="2" style="background-color: #f1f1f1;">
                      Corridor
                    </th>
                    <th colspan="2" class="text-center">
                      Target/Achieved (Weekly)
                    </th>
                    <th colspan="2" class="text-center">
                      Target/Achieved (Monthly)
                    </th>
                  </tr>
                  <tr>
                    <!-- <th>
                      
                    </th> -->
                    <th>
                      Count
                    </th>
                    <th>
                      Volume
                    </th>
                    <th>
                      Count
                    </th>
                    <th>
                      Volume
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>-/-</td>
                    <td>-/-</td>
                    <td>-/-</td>
                    <td>-/-<span class="text-error">-/-</span></td>
                    <td>-/-<span class="text-error"> -/-</span></td>
                  </tr>
                  <tr>
                    <td>-/-</td>
                    <td>-/-</td>
                    <td>-/-</td>
                    <td>-/-<span class="text-error"> -/-</span></td>
                    <td>-/-<span class="text-error">-/-</span></td>
                  </tr>
                   <tr>
                    <td>-/-</td>
                    <td>-/-</td>
                    <td>-/-</td>
                    <td>-/-<span class="text-error">-/-</span></td>
                    <td>-/-<span class="text-error">-/-</span></td>
                  </tr>
                </tbody>
              </v-table>
      </v-card-text>
    </v-card>
</template>
