import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";

export function useCustomerLeeds() {
  const { $axios } = useNuxtApp();
  const customer_leeds = ref([]);
  const countryCurrencyStore = useCountryCurrencyStore();
  const { sending_countries, receiving_countries } =
    storeToRefs(countryCurrencyStore);
  const {
    loading,
    showLoading,
    hideLoading,
    showSuccess,
    showError,
    // confirmAction,
  } = useUiFeedback();

  const fetchCustomerLeeds = async (filters = {}) => {
    showLoading("Fetching Customer Leeds...");
    try {
      const response = await $axios.get(`/customer/leeds/report`, {
        params: filters,
      });
      if (response.data.success) {
        customer_leeds.value = response.data.data.data;
      } else {
        showError("Failed to fetch agents");
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        const responseData = error.response.data;
        if (responseData.errors) {
          const allErrors = Object.values(responseData.errors).flat();
          allErrors.forEach((err) => showError(err));
        } else if (responseData.message) {
          showError(responseData.message);
        } else {
          showError("Something went wrong.");
        }
      } else {
        showError(error.message || "Network error occurred.");
      }
    } finally {
      hideLoading();
    }
  };

  const exportCustomerLeeds = async (filters = {}) => {
    showLoading("Exporting Customer Leeds...");
    try {
      const response = await $axios.post(`/customer/leeds/report/export`, {
        params: filters,
        responseType: "blob",
      });
      if (response.data) {
        const blob = new Blob([response.data], {
          type: "text/csv;charset=utf-8;",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const contentDisposition = response.headers["content-disposition"];
        let fileName = "customer_leeds_export.csv";
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match && match[1]) fileName = match[1];
        }

        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showSuccess("Customer Leeds exported successfully.");
      } else {
        showError("Failed to export customer leeds.");
      }
    } catch (error) {
      console.error(error);
      showError("Failed to export customer leeds.");
    } finally {
      hideLoading();
    }
  };

  return {
    loading,
    customer_leeds,
    fetchCustomerLeeds,
    sending_countries,
    receiving_countries,
    exportCustomerLeeds,
  };
}
