import { usePermissionStore } from '@/stores/userPermission'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = useCookie("token")
  const twoFactorUser = useCookie("twoFactorUser");
  const publicPages = ["/login", "/register", "/forgot-password"]

  // ✅ Allow public pages without authentication
  if (publicPages.includes(to.path)) {
    return
  }

  if(twoFactorUser.value && !token.value){
    return navigateTo("/two-steps-v1")
  }

  // ✅ Redirect if not authenticated
  if (!token.value) {
    return navigateTo("/login")
  }




  const permissionStore = usePermissionStore()

  // ✅ Init only if not loaded already
  if (!permissionStore.isLoaded) {
    await permissionStore.init()
  }

  const requiredPermission = to.meta?.permission
  console.log(
    permissionStore.hasPermission(requiredPermission),
    " | required:", requiredPermission,
    " | loaded:", permissionStore.isLoaded,
  )

  // ✅ Forbidden page
  if (requiredPermission && !permissionStore.hasPermission(requiredPermission) && permissionStore.isLoaded) {
    return navigateTo('/403')
  }
})
