export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
 

  const publicPages = ["/login", "/register", "/forgot-password", "/two-steps-v1"]

  router.beforeEach((to, from) => {
     const token = useCookie("token")
    const twoFactorUser = useCookie("twoFactorUser")
     const userCookie = useCookie("user")

      let user = null
      try {
        user = typeof userCookie.value === "string"
          ? JSON.parse(userCookie.value)
          : userCookie.value
      } catch (e) {
        console.warn("⚠️ Failed to parse user cookie", e)
      }

      if (user?.google2fa_enabled == 0 && twoFactorUser.value) {
        console.log("🧹 Clearing stale 2FA cookie (2FA disabled)")
        twoFactorUser.value = null
      }

    console.log("🔍 Auth Plugin Check →", {
      path: to.path,
      token: token.value,
      twoFactorUser: twoFactorUser.value,
      google2fa_enabled: user?.google2fa_enabled

    })

    if (token.value && publicPages.includes(to.path)) {
      console.log("✅ Redirecting logged-in user to dashboard")
      return navigateTo("/")
    }

     if (twoFactorUser.value && !token.value && publicPages.includes(to.path)) {
      if (to.path !== "/two-steps-v1") {
        console.log("✅ Redirecting 2FA user")
        return navigateTo("/two-steps-v1")
      }
    }

     


   
    return true
  })
})
