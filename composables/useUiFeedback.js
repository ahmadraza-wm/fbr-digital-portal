// composables/useUiFeedback.js
import { ref } from "vue";

const loading = ref(false);
const loadingMessage = ref(null);
const successMessage = ref(null);
const errorMessages = ref([]);
const confirmDialog = ref({
  show: false,
  message: "",
  onConfirm: null,
});

export default function useUiFeedback() {
  const showLoading = (msg = "Loading...") => {
    loading.value = true;
    loadingMessage.value = msg;
  };

  const hideLoading = () => {
    loading.value = false;
    loadingMessage.value = null;
  };

  const showError = (errors) => {
    errorMessages.value = Array.isArray(errors) ? errors : [errors];
  };

  const showSuccess = (msg) => {
    successMessage.value = msg;
  };

  const confirmAction = (message, onConfirm) => {
    confirmDialog.value.message = message;
    confirmDialog.value.onConfirm = onConfirm;
    confirmDialog.value.show = true;
  };

  const closeConfirm = () => {
    confirmDialog.value.show = false;
    confirmDialog.value.message = "";
    confirmDialog.value.onConfirm = null;
  };

  return {
    loading,
    loadingMessage,
    successMessage,
    errorMessages,
    showLoading,
    hideLoading,
    showError,
    showSuccess,
    confirmDialog,
    confirmAction,
    closeConfirm,
  };
}
