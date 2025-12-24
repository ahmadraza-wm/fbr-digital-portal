import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";

export const useCustomerStatement = () => {
  const {
    loading,
    showLoading,
    hideLoading,
    showSuccess,
    showError,
    // confirmAction,
  } = useUiFeedback();
  const { $axios } = useNuxtApp();
  const userList = ref({
    transactions: [],
    customer_documents: [],
    beneficiaries: [],

  })
  const fetchCustomerStatement = async (filters) => {
    const parseDate = (dateStr) => {
      if (!dateStr) return null;
      const [day, month, year] = dateStr.split("-");
      return new Date(`${year}-${month}-${day}`);
    };
    try {
      const today = new Date();
      const fromDate = parseDate(filters.from_date);
      const toDate = parseDate(filters.to_date);

      if (toDate && toDate > today) {
        showError("To Date should not be greater than today's date.");
        return;
      }

      if (fromDate && fromDate > today) {
        showError("From Date should not be greater than today's date.");
        return;
      }
      if (fromDate && toDate && fromDate > toDate) {
        showError("From Date should not be greater than To Date.");
        return;
      }

      if (fromDate && toDate && toDate < fromDate) {
        showError("To Date should not be earlier than From Date.");
        return;
      }
      loading.value = true;
      showLoading('Fetching Customer Statement...');
      const response = await $axios.get("/customer/statement/report", {
        params: filters,
      });

      if (response.data && response.data.success && response.data.data) {
        const data = response.data.data;

        userList.value = {
          from_date: filters.from_date,
          to_date: filters.to_date,
          issue_date: new Date().toISOString().split("T")[0],
          id: data.customer?.id ?? "-",
          name: data.customer?.user?.name ?? "-",
          email: data.customer?.user?.email ?? "-",
          phone_number: data.customer?.phone_number ?? "-",
          dob: data.customer?.customer_detail?.dob ?? "-",
          nationality: data.customer?.customer_detail?.nationality ?? "-",
          address: data.customer?.customer_detail?.address ?? "-",
          total_amount_transferred: data.total_amount_transferred ?? "-",
          total_transactions: data.total_transactions ?? "-",
          total_received_amount:
            data.total_destination_amounts?.[0]?.total_received_amount ?? "-",
          country: data.total_destination_amounts?.[0]?.name ?? "-",
          customer_documents: Array.isArray(data.customer_documents) ? data.customer_documents : [],
          beneficiaries: Array.isArray(data.beneficiaries) ? data.beneficiaries : [],
          transactions: Array.isArray(data.transactions) ? data.transactions : [],
        };
      } else {
        userList.value = { 
          transactions: [],
          beneficiaries: [],
          customer_documents: [],

         }; // reset to empty to stay safe
        showError("No data found or failed to fetch customer statement.");
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
    }
    finally {
      loading.value = false;
    }
  };

  return {
    userList,
    loading,
    fetchCustomerStatement,

  };
};
