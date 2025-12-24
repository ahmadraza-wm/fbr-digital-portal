<template>
    <VCol cols="12  mb-0 pt-2 pb-0 px-0">


        <VTable class="text-no-wrap">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Customer Id</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>DOB</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Transfers (Match Found)
                    </th>
                </tr>
            </thead>
            <tbody class="pb-2">
                <tr>
                    <td>1</td>
                    <td>
                        <NuxtLink :to="'/customers/view/1'" target="_blank" class="link-color">
                            1235
                        </NuxtLink>

                    </td>
                    <td>Deric kusi</td>
                    <td>Deric kusi</td>
                    <td>21 Aug, 1958</td>
                    <td>+447459840663</td>
                    <td>Vine Street</td>
                    <td>Yes</td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>
                        <NuxtLink :to="'/customers/view/1'" target="_blank" class="link-color">
                            1235
                        </NuxtLink>
                    </td>
                    <td>Deric kusi</td>
                    <td>Deric kusi</td>
                    <td>21 Aug, 1958</td>
                    <td>+447459840663</td>
                    <td>Vine Street</td>
                    <td>Yes</td>
                </tr>
            </tbody>
        </VTable>
    </VCol>
</template>
