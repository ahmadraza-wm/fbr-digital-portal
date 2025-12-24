import useUiFeedback from "@/composables/useUiFeedback";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

export default function usePartnerPayer() {
  const { $axios } = useNuxtApp();
  const route = useRoute();

  const {
    loading,
    showLoading,
    hideLoading,
    showSuccess,
    showError,
    confirmAction,
  } = useUiFeedback();

  // Payer list
  const payers = ref([]);
  const payersDropDown = ref([]);
  const isLoadingPayers = ref(false);
  const payerError = ref(null);

  // Fetch payers from API
  const fetchPayers = async (filters = {}) => {
    showLoading("Fetching payers...");
    payerError.value = null;

    try {
      const response = await $axios.get("/payers/list?pagination=false", {
        params: filters,
      });
      payersDropDown.value = response.data.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load payers";
      payerError.value = message;
      showError(message);
      console.error("Error fetching payers:", message);
    } finally {
      hideLoading();
    }
  };

  const savePartnerPayer = async (formData) => {
    try {
      const url = `/partner/payers/add`;
      const method = "post";
      const response = await $axios({ method, url, data: formData });

      if (response.status === 200 || response.status === 201) {
        showSuccess("Payer added successfully!");
        fetchPayers();
      }
    } catch (error) {
      const messages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()
        : error.response?.data?.message || "Something went wrong";

      showError(messages);
    } finally {
      hideLoading();
    }
  };

  const deletePartnerPayer = async (id) => {
    confirmAction("Are you sure you want to delete this partner payer?", async () => {
      try {
        await $axios.delete(`/bank/partners/delete/${id}`);
        payersDropDown.value = payersDropDown.value.filter((partner) => partner.id !== id);
        showSuccess("Partner payer deleted successfully.");
      } catch (error) {
        showError("Failed to delete partner payer.");
        console.error(error);
      } finally {
        hideLoading();
      }
    });
  };


  const UpdatePayerPartnerStatus = async (id, data) => {
    try {
      showLoading("Updating PayerPartner status...");
      await $axios.patch(`/partner/payer/status/update/${id}`, data);
      showSuccess('Partner Payer Status Updated Successfully')
    } catch (error) {
      const messages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()
        : error.response?.data?.message || "Something went wrong";
      showError(messages);
    }
  };

  const resolveStatusVariant = (status) =>
  ({
    1: { color: "success", text: "Active" },
    0: { color: "error", text: "Inactive" },
  }[status] || { color: "info", text: "Unknown" });

  const headers = ref([
    { title: "#", key: "sr_no" },
    { title: "Name", key: "name" },
    { title: "DC", key: "currency" },
    { title: "Method", key: "method" },
    { title: "Partner Code ", key: "partner_code" },
    { title: "Status", key: "status" },
    { title: "Action", key: "action" },
  ]);

  const init = async () => {
    showLoading("Initializing...");
    try {
      await fetchPayers();
    } catch (error) {
      console.error("Init error:", error);
      showError("Failed to initialize partner payer data.");
    } finally {
      hideLoading();
    }
  };

  onMounted(init);

  return {
    headers,
    payersDropDown,
    isLoadingPayers,
    payerError,
    deletePartnerPayer,
    UpdatePayerPartnerStatus,
    fetchPayers,
    savePartnerPayer,
    resolveStatusVariant,
    loading,
  };
}
