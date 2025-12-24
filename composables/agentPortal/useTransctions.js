import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { useRouter } from "vue-router";


export function useAgentTransactions() {

  const { $axios } = useNuxtApp();
  const router = useRouter();


  const {
    loading,
    showLoading,
    hideLoading,
    showSuccess,
    showError,
    confirmAction,
  } = useUiFeedback();
  const transactionsRemarks = ref();
  const pagination = ref({});
  const transactions = ref();
  const remarks = ref();
  const status = ref('');
  const transactionsDetails = ref();
   const resolveStatusVariant = (status_value) => {
        const variants = {
            incomplete: {
                color: "#FFFFFF",
                background: "#FF5733", // Bright Red
                text: "INCOMPLETE",
            },
            awaiting_funds: {
                color: "#FFFFFF",
                background: "#FF9800", // Orange
                text: "AWAITING FUNDS",
            },
            verifying_transfer: {
                color: "#FFFFFF",
                background: "#4CAF50", // Green
                text: "VERIFYING TRANSFER",
            },
            compliance_review: {
                color: "#FFFFFF",
                background: "#673AB7", // Purple
                text: "COMPLIANCE REVIEW",
            },
            compliance_held: {
                color: "#FFFFFF",
                background: "#009688", // Teal
                text: "COMPLIANCE HELD",
            },
            processing_transfer: {
                color: "#FFFFFF",
                background: "#2196F3", // Blue
                text: "PROCESSING TRANSFER",
            },
            available_for_collection: {
                color: "#FFFFFF",
                background: "#9C27B0", // Deep Purple
                text: "AVAILABLE FOR COLLECTION",
            },
            send_to_partner: {
                color: "#FFFFFF",
                background: "#795548", // Brown
                text: "SEND TO PARTNER",
            },
            paid: {
                color: "#FFFFFF",
                background: "#4CAF50", // Green
                text: "PAID",
            },
            canceled: {
                color: "#FFFFFF",
                background: "#F44336", // Red
                text: "CANCELED",
            },
            canceling: {
                color: "#FFFFFF",
                background: "#FF5722", // Deep Orange
                text: "CANCELING",
            },
            refunded: {
                color: "#FFFFFF",
                background: "#607D8B", // Blue Grey
                text: "REFUNDED",
            },
            reward_granted: {
                color: "#FFFFFF",
                background: "#198754", // Blue Grey
                text: "Reward Granted",
            },
            pending: {
                color: "#FFFFFF",
                background: "#FF5733",
                text: "Pending",
            },
        };

        return (
            variants[status_value] || {
                color: "#757575", // Default color (gray)
                background: "#E0E0E0", // Default background (light gray)
                text: "UNKNOWN",
            }
        );
    };

  const fetchAgentTransactions = async (filters = {}, withPagination = true) => {
    showLoading("Fetching Transactions...");
    try {
      const response = await $axios.get("/agent/transactions", {
        params: {
          ...filters,
          pagination: withPagination,
        },
      });

      if (response.data.success) {
        transactions.value = response.data.data.transactions.data
        showSuccess("Transactions Fetched Successfully");
        if (withPagination) {
          pagination.value = response.data.data.transactions;
        }
      } else {
        showError("Failed to fetch agents");
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        const responseData = error.response.data;
        if (responseData.errors) {
          const allErrors = Object.values(responseData.errors).flat();
          allErrors.forEach(err => showError(err));
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

  const fetchTransactionsDetailsById = async (id) => {
    showLoading("Fetching Transactions Details...");
    try {
      const response = await $axios.get(`/agent/transactions/${id}`);
      if (response.data.success) {
        transactionsDetails.value =  response.data.data;
        showSuccess(response.data.message);
      } else {
        showError("Failed to fetch Transactions details");
      }
    } catch (error) {
      console.error(error);
      showError(error.response?.data?.message || "Failed to fetch details");
      return null;
    } finally {
      hideLoading();
    }
  };
   
  const fetchTransactionsReamrksById = async (id) => {
    showLoading("Fetching Transactions Remarks Details...");
    try {
      const response = await $axios.get(`/agent/transactions/remarks/${id}`);
      if (response.data.success) {
        transactionsRemarks.value =  response.data.data;
        showSuccess(response.data.message);
      } else {
        showError("Failed to fetch Transactions details");
      }
    } catch (error) {
      console.error(error);
      showError(error.response?.data?.message || "Failed to fetch details");
      return null;
    } finally {
      hideLoading();
    }
  };
  
  const storeTransactionsRemarks = async (payload) => {
    showLoading("Adding Transaction Remarks Details...");
    try {
      const response = await $axios.post(`/agent/transactions/remarks`,payload);
      if (response.data.success) {
        showSuccess(response.data.message);
        fetchTransactionsReamrksById(payload.transaction_id);
      } else {
        showError(response.data.message);
      }
    } catch (error) {
      console.error(error);
      showError(error.response?.data?.message || "Failed to fetch details");
      return null;
    } finally {
      hideLoading();
    }
  };

  return {
    status,
    remarks,
    pagination,
    fetchTransactionsDetailsById,
    fetchTransactionsReamrksById,
    transactionsRemarks,
    fetchAgentTransactions,
    transactionsDetails,
    transactions,
    resolveStatusVariant,
    storeTransactionsRemarks
  };
}
