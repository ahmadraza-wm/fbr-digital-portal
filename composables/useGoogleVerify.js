import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { ref } from "vue";

export function useGoogleVerify() {
  const { $axios } = useNuxtApp();
  const { showLoading, hideLoading, showSuccess, showError } = useUiFeedback();
  const auth = useAuthStore();
  const qrData = ref(null); 


  
const tokenInput = ref("");
const isOtpInserted = ref(false);

  const enable2FA = async (userId) => {
    try {
      showLoading();
      const res = await $axios.post("/enable/2fa", {
      user_id: userId, 
      });
      qrData.value = res.data.data;
      showSuccess("2FA enabled and QR code generated.");
    } catch (e) {
      showError(e?.response?.data?.message || "Failed to enable 2FA.");
    } finally {
      hideLoading();
    }
  };

  const disable2FA = async (userId) => {
    try {
      showLoading();
     const res =  await $axios.post(`/disable/2fa/${userId}`);
      qrData.value = null;
      showSuccess("2FA disabled.");
    } catch (e) {
      showError(e?.response?.data?.message || "Failed to disable 2FA.");
    } finally {
      hideLoading();
    }
  };

  
  const submit2FAToken = async () => {
  if (!tokenInput.value || tokenInput.value.length !== 6) {
    return;
  }


  isOtpInserted.value = true;
  const success = await auth.submit2FAToken(tokenInput.value);
  isOtpInserted.value = false;

  
};


  return {
    enable2FA,
    disable2FA,
    tokenInput,
    isOtpInserted,
    submit2FAToken,
    qrData,
  };
}
