import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";

export const useCustomerBeneficiaryReport = () => {
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
    const showData = ref(false)
    const fetchCustomerBeneficiary = async (filters) => {
    try {
      loading.value = true;
  
        const response = await $axios.get("/customer/beneficiary/details/report", {
        params: filters,
      });
  

    //   console.log('✅ Actual Payload (response.data.data):', response.data.data); // Actual payload
  
        if (response.data.success) {
            const data = response.data.data;
            console.log('my data', data);
            userList.value = data
            showData.value = true
          } else {
        showError("Failed to fetch customer reviews");
      }
    } catch (error) {
      console.error('❌ API Error:', error);
      if (error.response && error.response.data) {
        const responseData = error.response.data;
  
        if (responseData.errors) {
          const allErrors = Object.values(responseData.errors).flat();
          allErrors.forEach((err) => {
            showError(err);
          });
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
    const exportCustomerBeneficiaryReport = async (filters = {}) => {
    showLoading("Exporting Customer Journey...");
    try {
        const response = await $axios.get(`/customer/beneficiary/details/export`, {
            params: filters,
        });

        // Agar backend ne JSON format me data return kiya hai
        const csvData = response.data.data || response.data;

        if (csvData) {
            const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            const contentDisposition = response.headers["content-disposition"];
            let fileName = "Customer_Beneficiary_Report.csv";
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?([^"]+)"?/);
                if (match && match[1]) fileName = match[1];
            }

            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showSuccess("Customer Beneficiary Report exported successfully.");
        } else {
            showError("Failed to export Customer Beneficiary Report.");
        }
    } catch (error) {
        console.error(error);
        showError("Failed to export Customer Beneficiary Report.");
    } finally {
        hideLoading();
    }
};

  
  return {
      userList,
      showData,
    loading,
      fetchCustomerBeneficiary,
      exportCustomerBeneficiaryReport
      
  };
};
