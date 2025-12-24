import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { useRouter } from "vue-router";


export function useAgentDeposits() {

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
      const response = await $axios.get("/agentDeposits/search/filter", {
        params: {
          ...filters,
          pagination: withPagination,
        },
      });

      if (response.data.success) {
        agentdeposits.value = response.data.data.data
        if (withPagination) {
          pagination.value = response.data.data;
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



  const saveAgentDeposit = async (form) => {
    showLoading("Saving AgentDeposits...");
    try {
      const formData = new FormData();

      formData.append("channel", form.channel);
      formData.append("main_agent_id", form.main_agent_id);
      if (form.channel === "agent") {
        formData.append("sub_agent_id", form.sub_agent_id);
      }
      formData.append("deposit_amount", form.deposit_amount);
      formData.append("deposit_type", form.deposit_type);
      formData.append("deposit_notes", form.deposit_notes);
      formData.append("file", form.file);

      const response = await $axios.post("agentDeposits", formData)

      if (response.status === 200 || response.status === 201) {
        showSuccess("AgentDeposit updated successfully!");
        setTimeout(() => router.push("/agents/agent-deposits"), 1500);
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



  const submitStatusUpdate = async () => {
    if (!status.value) {
      showError("Status not set.");
      return;
    }

    if (!remarks.value?.trim()) {
      showError("Remarks are required.");
      return;
    }

    showLoading("Updating status...");

    try {
      const id = selectedDeposit.value?.id;
      const payload = {
        status: status.value,
        remarks: remarks.value,
      };


      const response = await $axios.patch(`/agentDeposits/${id}`, payload);

      if (response.status === 200 || response.status === 201) {
        showSuccess("Deposit status updated successfully!");
        popup_acp.value = false;
        popup_rej.value = false;
        remarks.value = "";
        status.value = "";
        selectedDeposit.value = null;
        await fetchAgentDeposits();
      } else {
        showError("Failed to update status. Please try again.");
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
    submitStatusUpdate,
    selectedDeposit,
    status,
    remarks,
    popup_acp,
    popup_rej,
    agentdeposits,
    pagination,
    fetchAgentDeposits
  };


}    
