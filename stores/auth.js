import { usePermissionStore } from '@/stores/userPermission';
import { defineStore } from "pinia";
import useUiFeedback from "@/composables/useUiFeedback";
export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    roles: null,
    loading: false,
    errorMessage: null,
  }),

  actions: {
    async login(email, password, rememberMe = false) {
      try {
        const { $axios } = useNuxtApp(); // Get Axios instance
        const response = await $axios.post("/login", { email, password, rememberMe });


        // const message = response.data.message;

        // if (message === "Needs two factor authentication") {
        //   const encryptedUserId = response.data.data;
        //   // const twoFactorUser = useCookie("twoFactorUser");
        //   const twoFactorUser = useCookie("twoFactorUser", {
        //     maxAge: rememberMe ? 60 * 60 * 24 * 7 : undefined, // 7 days persistence
        //     secure: true,
        //     sameSite: "strict",
        //   });
        //   twoFactorUser.value = encryptedUserId;

        //   return navigateTo("/two-steps-v1");
        // }
        // const token = useCookie("token");
        const token = useCookie("token", {
          maxAge: rememberMe ? 60 * 60 * 24 * 7 : undefined, // 7 days persistence
          secure: true,
          sameSite: "strict",
        });
        const twoFactorUser = useCookie("twoFactorUser");
        twoFactorUser.value = null;

        token.value = response.data.token;
        const role = response.data.role;
        const roles = useCookie("roles", {
          maxAge: rememberMe ? 60 * 60 * 24 * 7 : undefined, // 7 days persistence
          secure: true,
          sameSite: "strict",
        });
        roles.value = role;
        this.roles = role;
        // const user = useCookie("user");
        const user = useCookie("user", {
          maxAge: rememberMe ? 60 * 60 * 24 * 7 : undefined,
          secure: true,
          sameSite: "strict",
        });

        user.value = response.data.user;
        this.user = response.data.user;
        this.token = response.data.token;

        return true;
      } catch (error) {
        console.error("Login error:", error.response?.data?.message || error.message);
        this.errorMessage = error.response?.data?.message || "An error occurred";
        return false;
      }
    },

    async submit2FAToken(tokenInput) {
      const { $axios } = useNuxtApp();
      this.loading = true;
      this.errorMessage = null;

      let response;

      try {
        const twoFactorUser = useCookie("twoFactorUser");

        const payload = {
          token: tokenInput,
          temp_token: twoFactorUser.value,
        };

        response = await $axios.post("/verify/2fa", payload);
        console.log("2FA API:", response.data);

        if (!response.data.success) {
          this.errorMessage = response.data.message || "2FA verification failed.";
          return false;
        }

        const api = response.data.data;

        const roles = useCookie("roles", {
          secure: true,
          sameSite: "lax", // strict mode finish
        })
        roles.value = api.role;
        this.roles = api.role;

        // ✅ Save token
        const token = useCookie("token");
        token.value = api.token;
        this.token = api.token;

        // ✅ Normalize the user object for ALL roles
        const rawUser = api.back_office_user;
        const finalUser = rawUser?.user ?? rawUser;

        const userCookie = useCookie("user");
        userCookie.value = finalUser;
        this.user = finalUser;

      } catch (error) {

        console.error("2FA FRONTEND ERROR:", error);

        this.errorMessage =
          error.response?.data?.message ||
          error.message ||
          "2FA verification failed.";

        return false;

      } finally {
        this.loading = false;
      }

      // ✅ Navigate outside try/catch so navigation errors don’t cause fake OTP failures
      await navigateTo("/");

      return true;
    },

    async forgotPassword(email) {
      this.loading = true;
      this.errorMessage = null;

      try {
        const { $axios } = useNuxtApp(); // Use axios from Nuxt plugin
        const response = await $axios.post("/forgot/password", { email });


        return true;
      } catch (error) {
        console.error("Forgot Password error:", error.response?.data?.message || error.message);
        this.errorMessage = error.response?.data?.message || "Failed to send reset link";
        return false;
      } finally {
        this.loading = false;
      }
    },


    async resetPassword({ email, token, password, password_confirmation }) {
      this.loading = true
      this.errorMessage = null

      try {
        const { $axios } = useNuxtApp()

        const response = await $axios.post("/reset/password", {
          email,
          token,
          password,
          password_confirmation,
        })

        return true
      } catch (error) {
        console.error("Reset Password error:", error.response?.data?.message || error.message)
        this.errorMessage = error.response?.data?.message || "Failed to reset password"
        return false
      } finally {
        this.loading = false
      }
    },



    logout: async function () {
      const { $axios } = useNuxtApp();
      const permissionStore = usePermissionStore();
      const { showSuccess, showError } = useUiFeedback();
      try {
        const tokenCookie = useCookie("token");
        const tokenToSend = this.token || tokenCookie.value;

        if (tokenToSend) {
          const res = await $axios.post("/logout", null, {
            headers: {
              Authorization: `Bearer ${tokenToSend}`,
            },
          });
        }
      } catch (error) {
        const msg = error.response?.data?.message || error.message || "Logout failed";
        showError(msg);
        console.error("Logout API error:", msg);
      } finally {
        
        permissionStore.$reset();

        const token = useCookie("token");
        const user = useCookie("user");
        const roles = useCookie("roles");
        const twoFactorUser = useCookie("twoFactorUser");

        user.value = null;
        token.value = null;
        roles.value = null;
        twoFactorUser.value = null;

        this.user = null;
        this.token = null;
        this.roles = null;
        this.twoFactorUser = null;
        await navigateTo("/login");
      }
    }
    ,
  },
});
