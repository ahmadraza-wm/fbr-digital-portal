import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";

export function useCustomerReview() {
  const { $axios } = useNuxtApp();
  const customer_reviews = ref([]);

  const countryCurrencyStore = useCountryCurrencyStore();
  const { countries } = storeToRefs(countryCurrencyStore);

  const {
    loading,
    showLoading,
    hideLoading,
    showSuccess,
    showError,
    // confirmAction,
  } = useUiFeedback();

  const fetchCustomerReview = async (filters = {}) => {
    showLoading("Fetching Customer Reviews...");
    try {
      const response = await $axios.get(`/customer/review/report`, {
        params: filters,
      });
    //   console.log(response.data.data);
      if (response.data.success) {
        // console.log(response.data.data);
        customer_reviews.value = response.data.data;
        console.log(customer_reviews);
      } else {
        showError("Failed to fetch customer reviews");
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
    showLoading("Exporting Customer Reviews...");
    try {
      const response = await $axios.post(`/customer/review/report/export`, {
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
        let fileName = "customer_reviews_export.csv";
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

      const payment_status = [
    { title: "Incomplete", value: "incomplete" },
    { title: "Awaiting Funds", value: "awaiting_funds" },
    { title: "Verifying Transfer", value: "verifying_transfer" },
    { title: "Compliance Review", value: "compliance_review" },
    { title: "Compliance Held", value: "compliance_held" },
    { title: "Operation Hold", value: "operation_hold" },
    { title: "Processing Transfer", value: "processing_transfer" },
    { title: "Available for Collection", value: "available_for_collection" },
    { title: "Send to Partner", value: "send_to_partner" },
    { title: "Paid", value: "paid" },
    { title: "Canceled", value: "canceled" },
    { title: "Canceling", value: "canceling" },
    { title: "Refunded", value: "refunded" },
    ];

  return {
    customer_reviews,
    countries,
    fetchCustomerReview,
    loading,
    payment_status,
    exportCustomerLeeds
  }
}
