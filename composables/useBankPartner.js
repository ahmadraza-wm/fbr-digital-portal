import useUiFeedback from "@/composables/useUiFeedback";
import { ref } from "vue";


export default function useBankPartner() {
  const { $axios } = useNuxtApp();
  const {
    loading,
    showLoading,
    hideLoading,
    showSuccess,
    showError,
    confirmAction,
  } = useUiFeedback();

  const bankPartners = ref([]);

  const partners = ref([]);
  const bankName = ref("");

  const fetchBankPartners = async (partnerId) => {
    showLoading("Fetching banks partner...");

    try {
      const res = await $axios.get(`/bank/partners/${partnerId}`);
      const { data } = res.data;
      bankPartners.value = data?.data || [];
      bankName.value = bankPartners.value[0]?.bank_name || "";
    } catch (error) {
      showError("Failed to fetch banks partner");
    } finally {
      hideLoading();
    }
  };

  const fetchPartners = async () => {

    try {
      const res = await $axios.get("/partners/list?pagination=false");
      partners.value = res.data.data;
      bankName.value = data?.bank_name || "";
    } catch (error) {
      showError("Error fetching banks partner");
    } finally {
      hideLoading();
    }
  };

  const createBankPartner = async (data, bankId) => {
    try {
      const response = await $axios.post("/bank/partners/create", data);
      showSuccess("Bank Partner created successfully!");
      if (bankId) {
        await fetchBankPartners(bankId);
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

  const updateBankPartner = async (id, data) => {
    try {
      await $axios.patch(`/bank/partners/update/${id}`, data);
         showSuccess("Bank Partner updated successfully!");
    } catch (error) {
      const messages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()
        : error.response?.data?.message || "Something went wrong";
      showError(messages);
    } finally {
      hideLoading();
    }
  };


  const deleteBankPartner = async (id) => {
    confirmAction("Are you sure you want to delete this bank partner?", async () => {
      showLoading("Deleting bank partner...");
      try {
        await $axios.delete(`/bank/partners/delete/${id}`);
        bankPartners.value = bankPartners.value.filter((bank) => bank.id !== id);
        showSuccess("Bank partner deleted successfully");
      } catch (error) {
        showError("Failed to delete bank partner.");
        console.error(error);
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

  onMounted(() => {
    fetchPartners();
  });

  return {
    headers,
    bankPartners,
    bankName,
    partners,
    loading,
    deleteBankPartner,
    fetchBankPartners,
    createBankPartner,
    updateBankPartner,
  };
}
