import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { onMounted, ref } from "vue";

export function useDestinationCode() {
  const { $axios } = useNuxtApp();

  const {
    loading,
    showLoading,
    hideLoading,
    showSuccess,
    showError,
    confirmAction,
  } = useUiFeedback();

  const destinationCode = ref([]);
  const partners = ref([]);
  const destinationName = ref("");
  const isLoadingdestinationCode = ref(false);
  const payerError = ref(null);

  const fetchDestinationCode = async (partnerId) => {
    showLoading("Fetching destination code...");
    payerError.value = null;
    try {
      const res = await $axios.get(`/cash/destination/partners/${partnerId}`);
      const { data } = res.data;
      destinationCode.value = data?.data || [];
      destinationName.value = destinationCode.value[0]?.bank_name || "";
    } catch (error) {
      console.error(error);
      showError("Something went wrong while fetching destination codes.");
    } finally {
      hideLoading();
    }
  };

  const fetchPartners = async () => {
    isLoadingdestinationCode.value = true;
    payerError.value = null;
    try {
      const res = await $axios.get("/partners/list?pagination=false");
      partners.value = res.data.data.data;
    } catch (error) {
      payerError.value =
        error.response?.data?.message || "Failed to load partners";
    } finally {
      isLoadingdestinationCode.value = false;
    }
  };

  const createDestinationCode = async (data, bankId) => {
    try {
      const response = await $axios.post("/cash/destination/partners", data);
      showSuccess("Cash Destination Code Created.");
      if (bankId) {
        await fetchDestinationCode(bankId);
      }
      return { success: true };
    } catch (error) {
      const messages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()
        : error.response?.data?.message || "Something went wrong";
      showError(messages);
    } finally {
      hideLoading();
    }
  };

  const updateDestinationCode = async (id, data) => {
    try {
      await $axios.patch(`/cash/destination/partners/${id}`, data);
      showSuccess("Destination code updated.");
    } catch (error) {
      console.error(error);
      showError(
        error.response?.data?.message || "Failed to update destination code"
      );
    } finally {
      hideLoading();
    }
  };

  const deleteDestinationCode = async (id) => {
    confirmAction("Are you sure you want to delete this destination code?", async () => {
      try {
        await $axios.delete(`/cash/destination/partners/${id}`);
        destinationCode.value = destinationCode.value.filter((item) => item.id !== id);
        showSuccess("Destination code deleted.");
      } catch (error) {
        console.error(error);
        showError("Failed to delete destination code.");
      } finally {
        hideLoading();
      }
    });
  };

  const headers = ref([
    { title: "#", key: "sr_no" },
    { title: "Partner Name", key: "partner_name" },
    { title: "Reference Code", key: "reference_code" },
    { title: "Created At", key: "created_at" },
    { title: "Action", key: "action" },
  ]);

  const init = async () => {
    showLoading("Initializing...");
    try {
      await fetchDestinationCode();
      await fetchPartners();
    } catch (error) {
      console.error("Init error:", error);
      showError("Failed to initialize cash destination code data.");
    } finally {
      hideLoading();
    }
  };

  onMounted(init);
  return {
    headers,
    destinationCode,
    destinationName,
    partners,
    payerError,
    isLoadingdestinationCode,
    fetchDestinationCode,
    fetchPartners,
    createDestinationCode,
    updateDestinationCode,
    deleteDestinationCode,
  };
}
