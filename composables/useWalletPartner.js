import { ref } from "vue";

export default function useWalletPartner() {
  const { $axios } = useNuxtApp();

  const walletPartners = ref([]);

  const partners = ref([]);
  const isLoadingBankPartners = ref(false);
  const payerError = ref(null);
  const bankName = ref("");
  const loading = ref(false);
  const loadingMessage = ref(false);
  const errorMessage = ref(null);
  const successMessage = ref(null);

  const fetchBankPartners = async (partnerId) => {
    isLoadingBankPartners.value = true;
    payerError.value = null;
    loadingMessage.value = "Fetching wallet partners..."; 
    errorMessage.value = null;

    try {
      const res = await $axios.get(`/wallet/partners/${partnerId}`);
      const { data } = res.data;
      walletPartners.value = data?.data || [];
    } catch (error) {
        errorMessage.value = "Something went wrong";
    } finally {
        loading.value = false;
        setTimeout(() => {
          loadingMessage.value = null;
        }, 1500);    }
  };

  const fetchPartners = async () => {
    isLoadingBankPartners.value = true;
    payerError.value = null;

    try {
        const res = await $axios.get("/partners/list?pagination=false");
        partners.value = res.data.data;
      bankName.value = data?.bank_name || "";
    } catch (error) {
      payerError.value =
        error.response?.data?.message || "Failed to load wallet partners";
    } finally {
      isLoadingBankPartners.value = false;
    }
  };

  const createBankPartner = async (data, bankId) => {
    loading.value = true;
    errorMessage.value = null;
    successMessage.value = null;
    try {
      const response = await $axios.post("/wallet/partners", data);
      successMessage.value = "Wallet Partner Created."; 
      if (bankId) {
        await fetchBankPartners(bankId);
      }
      return { success: true };
    } catch (error) {
        errorMessage.value =
        error.response?.data?.message || "Something went wrong";
    } finally {
        loading.value = false;
      }
  };

  const updateBankPartner = async (id, data) => {
    loading.value = true;
    try {
      await $axios.patch(`/wallet/partners/${id}`, data);
    } catch (error) {
      errorMessage.value =
        error.response?.data?.message || "Failed to update partner";
    } finally {
      loading.value = false;
    }
  };
  

  const deleteBankPartner = async (id) => {
    if (!confirm("Are you sure you want to delete this wallet partner?")) return;
    
    try {
      loading.value = true;
      const { $axios } = useNuxtApp();
      await $axios.delete(`/wallet/partners/${id}`);
      walletPartners.value = walletPartners.value.filter((partner) => partner.id !== id);
    } catch (error) {
      errorMessage.value = "Failed to delete wallet partner.";
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  const headers = ref([
    { title: "#", key: "sr_no" },
    { title: "Partner Name", key: "partner_name" },
    { title: "Reference Code", key: "reference_code" },
    { title: "Added By", key: "created_by" },
    { title: "Created At", key: "created_at" },
    { title: "Action", key: "action" },
  ]);


  const init = async () => {
      showLoading("Initializing...");
      try {
        await fetchPartners();
      } catch (error) {
        console.error("Init error:", error);
        showError("Failed to initialize wallet partner data.");
      } finally {
        hideLoading();
      }
    };
  
    onMounted(init);

  return {
    headers,
    walletPartners,
    bankName,
    isLoadingBankPartners,
    payerError,
    partners,
    loading,
    loadingMessage,
    errorMessage,
    successMessage,
    deleteBankPartner,
    fetchBankPartners,
    createBankPartner,
    updateBankPartner,
  };
}
