import { usePermissionStore } from '@/stores/userPermission';
import axios from "axios";
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const permissionStore = usePermissionStore()
  const axiosInstance = axios.create({
    baseURL: config.public.apiBase,
    withCredentials: true,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = useCookie("token");
      if (token.value) {
        config.headers.Authorization = `Bearer ${token.value}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      if (!permissionStore.isLoaded) {
        // permissionStore.fetchUserPermissions();
      }
      response.data = convertBooleansToInt(response.data);
      return response;
    },
    (error) => {
      if (error.response?.status === 422) {
        console.log("invalid OTP");
      }

      if (error.response?.status === 401 && error.config.url !== "/agent/login") {
        console.error("Unauthorized! Redirecting to login...");
        const authStore = useAuthStore();
        authStore.logout();

        permissionStore.$reset()
        return navigateTo("/login");
      }

      return Promise.reject(error);
    }
  );

  return {
    provide: {
      axios: axiosInstance,
    },
  };

  function convertBooleansToInt(obj) {
    if (Array.isArray(obj)) {
      return obj.map(convertBooleansToInt);
    } else if (obj !== null && typeof obj === "object") {
      const result = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = convertBooleansToInt(value);
      }
      return result;
    } else if (obj === "0" || obj === "1") {
      return parseInt(obj, 10);
    } else {
      return obj;
    }
  }
});
