import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useBank = () => {
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

  const bankList = ref([]);
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

  const fetchBanks = async (filters = {}, withPagination = true) => {

    showLoading("Fetching banks...");

    try {
      const response = await $axios.get("/banks", {
        params: {
          ...filters,
          pagination: withPagination,
        },
      });

      if (response.data.success) {
        bankList.value = response.data.data.data;
        if (withPagination) {
          pagination.value = response.data.data;
        }
      } else {
        showError("Failed to fetch banks");
      }
    } catch (error) {
      showError("Error fetching banks");
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  const submitForm = async (dataToSubmit) => {
    try {
      showLoading("Creating bank...");

      const response = await $axios.post("/banks", dataToSubmit);

      if (response.status === 200 || response.status === 201) {
        showSuccess("Bank created successfully!");
        setTimeout(() => router.push("/banks"), 1500);
      }
      fetchBanks();
    } catch (error) {
      console.error("Error saving bank:", error);
      const messages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()
        : error.response?.data?.message || "Something went wrong";
      showError(messages);
    } finally {
      hideLoading();
    }
  };

  const deleteBank = async (id) => {
    confirmAction("Are you sure you want to delete this bank?", async () => {
      showLoading("Deleting bank...");
      try {
        await $axios.delete(`/banks/${id}`);
        bankList.value = bankList.value.filter((bank) => bank.id !== id);
        showSuccess("Bank deleted successfully");
      } catch (error) {
        showError("Failed to delete bank.");
        console.error(error);
      } finally {
        hideLoading();
      }
    });
  };

  const loadPayerDetails = async () => {
    try {
      showLoading("Fetching bank details...");
      const response = await $axios.get(`/banks/${walletId.value}`);
      walletData.value = response.data.data;
    } catch (error) {
      showError("Failed to fetch bank details.");
      console.error(error);
    } finally {
      hideLoading();
    }
  };


  const init = async () => {
    showLoading("Initializing...");
    try {
      await Promise.all([
        fetchBanks(),
        loadPayerDetails(),
      ]);
    } catch (error) {
      console.error("Init error:", error);
      showError("Failed to initialize bank data.");
    } finally {
      hideLoading();
    }
  };

  onMounted(init);

  const headers = ref([
    { title: "#", key: "sr_no" },
    { title: "Code", key: "bank_code" },
    { title: "Bank Name", key: "name" },
    { title: "Country", key: "country" },
    { title: "Created At", key: "created_at" },
    { title: "Action", key: "action" },
  ]);

  return {
    headers,
    isEditing,
    bankList,
    loading,
    options,
    filters,
    walletData,
    pagination,
    fetchBanks,
    submitForm,
    deleteBank,
  };
};
