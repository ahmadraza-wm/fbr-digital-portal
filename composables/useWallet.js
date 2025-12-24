import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useWallet = () => {
  const { $axios } = useNuxtApp();
  const route = useRoute();
  const router = useRouter();

  const {
    loading,
    showLoading,
    hideLoading,
    showSuccess,
    showError,
    confirmAction,
  } = useUiFeedback();

  const walletList = ref([]);
  const pagination = ref({});

  const filters = ref({
    country_id: "",
    name: "",
  });

  const walletData = ref({
    name: "",
    currency_id: null,
    country_id: null,
    method: "",
    status: null,
    min_limit: "",
    max_limit: "",
    transfer_prefix: "",
    sending_method_tags: [],
    sending_country_tags: [],
  });

  const options = ref({ itemsPerPage: 5, page: 1 });
  const walletId = computed(() => route.params.id || null);
  const isEditing = computed(() => !!walletId.value);

  const fetchWallets = async (filters = {}, withPagination = true) => {
    showLoading("Fetching wallets...");
    try {
      const response = await $axios.get("/wallets", {
        params: {
          ...filters,
          pagination: withPagination,
        },
      });


      if (response.data.success) {
        walletList.value = response.data.data.data;
        if (withPagination) {
          pagination.value = response.data.data;
        }
      } else {
        showError("Failed to fetch wallets");
      }
    } catch (error) {
      showError("Error fetching wallets");
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  const loadWalletDetails = async () => {
    if (!isEditing.value) return;
    try {
      showLoading("Loading wallet details...");
      const response = await $axios.get(`/wallet/${walletId.value}`);
      walletData.value = { ...response.data.data };
    } catch (error) {
      showError("Failed to load wallet details.");
    } finally {
      hideLoading();
    }
  };

  const submitForm = async (dataToSubmit) => {
    try {
      showLoading("Creating wallet...");

      const response = await $axios.post("/wallets", dataToSubmit);

      if (response.status === 200 || response.status === 201) {
        showSuccess("Wallet created successfully!");
        setTimeout(() => router.push("/wallets"), 1500);
      }
      fetchWallets();
    } catch (error) {
      console.error("Error saving wallet:", error);
      const messages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()
        : error.response?.data?.message || "Something went wrong";
      showError(messages);
    } finally {
      hideLoading();
    }
  };

  const deleteWallet = async (id) => {
    confirmAction("Are you sure you want to delete this wallet?", async () => {
      showLoading("Deleting wallet...");
      try {
        await $axios.delete(`/wallets/${id}`);
        walletList.value = walletList.value.filter((wallet) => wallet.id !== id);
        showSuccess("Wallet deleted successfully.");
      } catch (error) {
        console.error("Error deleting wallet:", error);
        showError("Failed to delete wallet.");
      } finally {
        hideLoading();
      }
    });
  };


  const UpdateWalletStatus = async (id, data) => {
    try {
      showLoading("Updating wallet status...");
      await $axios.patch(`/wallets/status/update/${id}`, data);
      showSuccess('Wallet Status Updated Successfully')
      await fetchWallets();
    } catch (error) {
      const messages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()
        : error.response?.data?.message || "Something went wrong";
      showError(messages);
    }
  };


  const init = async () => {
    showLoading("Initializing...");
    try {
      if (route.path.includes("wallets")) {
        await fetchWallets();
      }

      if (route.path.includes("wallets") && walletId.value) {
        await loadWalletDetails();
      }
    } catch (error) {
      console.error("Init error:", error);
      showError("Failed to initialize wallets data.");
    } finally {
      hideLoading();
    }
  };

  onMounted(init);


  const headers = ref([
    { title: "#", key: "sr_no" },
    { title: "Code", key: "bank_code" },
    { title: "Wallet Name", key: "name" },
    { title: "Country", key: "country" },
    { title: "Status", key: "status" },
    { title: "Added By", key: "created_by" },
    { title: "Created At", key: "created_at" },
    { title: "Action", key: "action" },
  ]);

  return {
    headers,
    isEditing,
    walletList,
    loading,
    options,
    filters,
    walletData,
    pagination,
    fetchWallets,
    UpdateWalletStatus,
    submitForm,
    deleteWallet,
  };
};
