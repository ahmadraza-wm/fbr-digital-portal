import { useCookie } from '#app'
import { defineStore } from 'pinia'

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    assigned_permissions: [],   // [{ permission_name: "view_users" }]
    isLoaded: false,
  }),

  actions: {
    async fetchUserPermissions() {
      try {
        const loggedInUser = useCookie("user")
        if (!loggedInUser.value?.id) return

        const { $axios } = useNuxtApp()
        const res = await $axios.get(`/users/${loggedInUser.value.id}/permissions`)

        // Normalize API response
        const permission = res.data.role_permissions.map(item => ({
          permission_name: item.name,
        }))

        this.assigned_permissions = permission
        this.isLoaded = true

        const userCookie = useCookie('user')
        userCookie.value = {
          ...userCookie.value,
          permissions: permission,
        }
        console.log("User cookie saved:", userCookie.value)

      } catch (err) {
        console.error("Permission fetch error:", err)
      }
    },

    hasPermission(permission) {
      return this.assigned_permissions?.some(
        (p) => p.permission_name === permission
      )
    },

    async init() {
      if (!this.isLoaded) {
        const userCookie = useCookie("user")
        if (userCookie.value?.permissions) {
          this.assigned_permissions = userCookie.value.permissions
          this.isLoaded = true
          console.log("Loaded from cookie:", this.assigned_permissions)
          return
        }
        await this.fetchUserPermissions()
      }
    }


  }
})
