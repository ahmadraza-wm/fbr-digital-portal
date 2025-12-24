import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { useRouter } from "vue-router";


export function useAgentDeposit() {

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

  const agentdeposits = ref([]);
  const pagination = ref({});

  const remarks = ref();
  const popup_acp = ref(false);
  const popup_rej = ref(false);
  const selectedDeposit = ref(null);
  const status = ref('');


  const fetchAgentDeposits = async (filters = {}, withPagination = true) => {
    showLoading("Fetching AgentDeposits...");
    try {
      let url = "/agent/agentDeposits";
      if (filters.status || filters.from_date || filters.to_date) {
        url = "/agent/agentDeposits/search/filter";
      }

      const response = await $axios.get(url, {
        params: {
          ...filters,
          pagination: withPagination,
        },
      });

      if (response.data.success) {
        agentdeposits.value = response.data.data.data
        if (withPagination) {
          pagination.value = { meta: response.data.data };
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

  const filterAgentDeposits = async (filters) => {
    return fetchAgentDeposits(filters, true);
  };



  const saveAgentDeposit = async (form) => {
    showLoading("Saving AgentDeposits...");
    try {
      const formData = new FormData();

      formData.append("channel", "agent");
      formData.append("deposit_amount", form.deposit_amount);
      formData.append("deposit_type", form.deposit_type);
      formData.append("deposit_notes", form.deposit_notes);

      // Handle file input which might be an array or single object
      if (form.file) {
        formData.append("file", form.file);
      }

      // Add bank if selected
      if (form.bank) {
        formData.append("bank", form.bank);
      }


      const response = await $axios.post("agent/agentDeposits", formData)

      if (response.status === 200 || response.status === 201) {
        showSuccess(response.data.message);
        setTimeout(() => router.push("/agent/deposits"), 1500);
      }
    } catch (error) {
      console.error("AgentDeposit:", error);
      const messages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()
        : error.response?.data?.message || "Something went wrong";
      showError(messages);
    } finally {
      hideLoading();
    }
  };


  const updateAgentDeposit = async (id, form) => {
    showLoading("Updating Agent Deposit...");
    try {
      const formData = new FormData();
      formData.append("_method", "PATCH");
      formData.append("channel", "agent");
      formData.append("deposit_amount", form.deposit_amount);
      formData.append("deposit_type", form.deposit_type);
      formData.append("deposit_notes", form.deposit_notes);

      if (form.file) {
        formData.append("file", form.file);
      }
      if (form.bank) {
        formData.append("bank", form.bank);
      }

      const response = await $axios.post(`/agent/agentDeposits/${id}`, formData);

      if (response.status === 200 || response.status === 201) {
        showSuccess(response.message || "Deposit updated successfully");
        setTimeout(() => router.push("/agent/deposits"), 1500);
      }
    } catch (error) {
      console.error("Update AgentDeposit:", error);
      const messages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()
        : error.response?.data?.message || "Something went wrong";
      showError(messages);
    } finally {
      hideLoading();
    }
  };

  const fetchAgentDepositById = async (id) => {
    showLoading("Fetching Deposit Details...");
    try {
      const response = await $axios.get(`/agent/agentDeposits/${id}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        showError("Failed to fetch deposit details");
        return null;
      }
    } catch (error) {
      console.error(error);
      showError(error.response?.data?.message || "Failed to fetch details");
      return null;
    } finally {
      hideLoading();
    }
  };



  const deleteDeposit = async (id) => {
    try {
      const response = await $axios.delete(`/agent/agentDeposits/${id}`);

      if (response.status === 200 || response.status === 201) {
        showSuccess(response.data.message);
        await fetchAgentDeposits();
      } else {
        showError("Failed to delete deposit. Please try again.");
      }
    } catch (err) {
      console.error("Status update failed:", err);
      const message =
        err.response?.data?.message ||
        "Status update failed. Please check your connection.";
      showError(message);
    } finally {
      hideLoading();
    }
  };







  return {
    saveAgentDeposit,
    selectedDeposit,
    status,
    remarks,
    popup_acp,
    popup_rej,
    agentdeposits,
    pagination,
    fetchAgentDeposits,
    filterAgentDeposits,
    deleteDeposit,
    fetchAgentDepositById,
    updateAgentDeposit
  };


}    
