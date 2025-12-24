import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";

export const useBeneficiaryLedger = () => {
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
    const fetchBeneficiaryLedger = async (filters) => {
    console.log('🔍 Sent Filters:', filters);
    try {
      loading.value = true;
  
        const response = await $axios.get("/beneficiary/ledger/report", {
        params: filters,
      });
  

    //   console.log('✅ Actual Payload (response.data.data):', response.data.data); // Actual payload
  
        if (response.data.success) {
            const data = response.data.data;
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
  
  return {
      userList,
      showData,
    loading,
      fetchBeneficiaryLedger,
      
  };
};
