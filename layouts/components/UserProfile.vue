<script setup>
import avatar1 from '@images/avatars/avatar-1.png';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

const logout = () => {
  authStore.logout();
  navigateTo('/login');
};
const loggedInUser = useCookie("user");
</script>

<template>
  <VBadge dot location="bottom right" offset-x="3" offset-y="3" bordered color="success">
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <VImg :src="avatar1" />

      <!-- SECTION Menu -->
      <VMenu activator="parent" width="230" location="bottom end" offset="14px">
        <VList>
          <VListItem>

            <VListItemTitle class="font-weight-semibold text-capitalize">
              {{
                (authStore.user
                  ? `${authStore.user.first_name || ''} ${authStore.user.last_name || ''}`.trim()
                  : loggedInUser
                    ? `${loggedInUser.first_name || ''} ${loggedInUser.last_name || ''}`.trim()
              : ''
              )
              }}
            </VListItemTitle>
            <VListItemSubtitle>{{ authStore.user?.email || loggedInUser?.email }}</VListItemSubtitle>
          </VListItem>

          <VDivider class="my-2" />

          <!-- <VListItem link>
            <template #prepend>
              <VIcon class="me-2" icon="tabler-user" size="22" />
            </template>
<VListItemTitle>Profile</VListItemTitle>
</VListItem> -->




          <VListItem @click="logout">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-logout" size="22" />
            </template>
            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
    </VAvatar>
  </VBadge>
</template>
