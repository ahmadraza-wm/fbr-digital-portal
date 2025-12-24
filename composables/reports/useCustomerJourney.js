import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";

export const useCustomerJourney = () => {
  const {
    loading,
    showLoading,
    hideLoading,
    showSuccess,
    showError,
    // confirmAction,
  } = useUiFeedback();
  const { $axios } = useNuxtApp();
  const userList = ref([]);

    const fetchCustomerJourney = async (filters) => {
        console.log('journey', filters)
    try {
      loading.value = true;

      const response = await $axios.get("/customer/journey/report", {
        params: filters,
      });

      if (response.data.success) {
        // console.log(response.data.data);
          userList.value = response.data.data.data || []
      } else {
        showError("Failed to fetch customer journey");
      }
    }
    catch (error) {
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
      loading.value = false;
    }
  };
    const exportCustomerJourney = async (filters = {}) => {
        showLoading("Exporting Customer Journey...");
        try {
            const response = await $axios.post(`/customer/journey/report/export`, {
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
                let fileName = "customer_journey_export.csv";
                if (contentDisposition) {
                    const match = contentDisposition.match(/filename="?([^"]+)"?/);
                    if (match && match[1]) fileName = match[1];
                }
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showSuccess("Customer Reviews exported successfully.");
            } else {
                showError("Failed to export customer reviews.");
            }
        } catch (error) {
            console.error(error);
            showError("Failed to export customer reviews.");
        } finally {
            hideLoading();
        }
    };
  return {
    userList,
    loading,
      fetchCustomerJourney,
      exportCustomerJourney
  };
};
