import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { useCountryCurrencyStore } from "@/stores/useCountryCurrencyStore";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const usePayer = () => {
  const { $axios } = useNuxtApp();
  const route = useRoute();
  const router = useRouter();

  const countryCurrencyStore = useCountryCurrencyStore();
  const { countries, currencies } = storeToRefs(countryCurrencyStore);


  const {
    loading,
    showLoading,
    hideLoading,
    showSuccess,
    showError,
    confirmAction,
  } = useUiFeedback();

  const payersList = ref([]);
  const pagination = ref({});

  const filters = ref({
    method: "",
    country_id: "",
    currency_id: "",
    name: "",
  });

  const payerData = ref({
    name: "",
    currency_id: null,
    country_id: null,
    method: "",
    status: null,
    min_limit: "",
    max_limit: "",
    transfer_prefix: null,
    transfer_pin_length: null,
    sending_method_tags: [],
    sending_country_tags: [],
  });

  const options = ref({ itemsPerPage: 10, page: 1 });
  const payerId = computed(() => route.params.id || null);
  const isEditing = computed(() => !!payerId.value);

  const partners = [
    { title: "Bank Transfer", value: "bank" },
    { title: "Cash Pickup", value: "cash" },
    { title: "Mobile Wallet", value: "mobile_wallet" },
  ];

  const sending_methods_tags = [
    { title: "Bank Transfer", value: "bank_transfer" },
    { title: "Cash", value: "cash" },
    { title: "Digital Wallet", value: "digital_wallet" },
    { title: "Debit Card", value: "debit_card" },
    { title: "Credit Card", value: "credit_card" },
  ];

  const sending_country_tags = [
    { title: "Canada", value: "canada" },
    { title: "Ireland", value: "ireland" },
    { title: "Switzerland", value: "switzerland" },
    { title: "United Kingdom", value: "uk" },
  ];

  const statuses = [
    { value: 1, text: "Active" },
    { value: 0, text: "Inactive" },
  ];

  const resolveStatusVariant = (status) =>
  ({
    1: { color: "success", text: "Active" },
    0: { color: "error", text: "Inactive" },
  }[status] || { color: "info", text: "Unknown" });

  const fetchPayers = async (filters = {}, withPagination = true) => {
    showLoading("Fetching payers...");
    try {
      const response = await $axios.get("/payers/list", {
        params: {
          ...filters,
          pagination: withPagination,
        },
      });
      if (response.data.success) {
        payersList.value = response.data.data.data;
        if (withPagination) {
          pagination.value = response.data.data;
        }
      } else {
        showError("Failed to fetch payers");
        }

    } catch (error) {
      showError("Error fetching payers");
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  const loadPayerDetails = async () => {
    if (!isEditing.value) return;

    try {
      const response = await $axios.get(`/payer/${payerId.value}`);
      const data = response.data.data;

      data.sending_method_tags = (data.sending_method_tags || []).map(tag => tag.id);

      data.sending_country_tags = (data.sending_country_tags || []).map(tag => tag.id);

      payerData.value = { ...data };
    } catch (error) {
      showError("Failed to load payer details.");
    } finally {
      hideLoading();
    }
  };


  const submitForm = async () => {
    try {
      showLoading(isEditing.value ? "Updating payer..." : "Creating payer...");

      if (payerData.value.status === null) {
        payerData.value.status = 1;
      }

      const url = isEditing.value
        ? `/payers/update/${payerId.value}`
        : `/payers/create`;
      const method = isEditing.value ? "patch" : "post";

      const response = await $axios({ method, url, data: payerData.value });

      if (response.status === 200 || response.status === 201) {
        showSuccess(
          isEditing.value
            ? "Payer updated successfully!"
            : "Payer created successfully!"
        );
        setTimeout(() => router.push("/payers"), 1500);
      }
    } catch (error) {
      console.error("Error saving payer:", error);
      const messages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()
        : error.response?.data?.message || "Something went wrong";
      showError(messages);
    } finally {
      hideLoading();
    }
  };

  const deletePayer = async (id) => {
    confirmAction("Are you sure you want to delete this payer?", async () => {
      showLoading("Deleting payer...");
      try {
        const { $axios } = useNuxtApp();
        await $axios.delete(`/payers/delete/${id}`);
        partners.value = partners.value.filter((partner) => partner.id !== id);
        showSuccess("Payer deleted successfully");
      } catch (error) {
        showError("Failed to delete payer.");
        console.error(error);
      } finally {
        hideLoading();
      }
    });
  };

  const init = async () => {
    showLoading("Initializing...");
    try {
      if (route.path.includes("payers")) {
        await fetchPayers();
      }

      if (route.path.includes("payer") && payerId.value) {
        await loadPayerDetails();
      }
    } catch (error) {
      console.error("Init error:", error);
      showError("Failed to initialize payers data.");
    } finally {
      hideLoading();
    }
  };

  onMounted(init);


  return {
    isEditing,
    payersList,
    pagination,
    loading,
    options,
    filters,
    payerData,
    statuses,
    partners,
    sending_methods_tags,
    sending_country_tags,
    fetchPayers,
    submitForm,
    resolveStatusVariant,
    deletePayer,
    countries,
    currencies,
  };
};
