import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useGateway = () => {
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

  const gatewaysList = ref([]);
  const pagination = ref({});

  const gatewayRequirements = ref({
    gateways: [],
    sending_countries: [],
    receiving_countries: [],
    sending_methods: [],
  });

  const filters = ref({
    gateway_id: "",
    sending_country_id: "",
    sending_method_id: "",
    status: "",
  });

  const gatewayData = ref({
    gateway_id: null,
    sending_country_id: null,
    sending_method_id: null,
    status: null,
  });

  const options = ref({ itemsPerPage: 10, page: 1 });
  const gatewayId = computed(() => route.params.id || null);
  const isEditing = computed(() => !!gatewayId.value);

  const statuses = [
    { value: 1, text: "Active" },
    { value: 0, text: "Inactive" },
  ];

  const resolveStatusVariant = (status) =>
  ({
    1: { color: "success", text: "Active" },
    0: { color: "error", text: "Inactive" },
  }[status] || { color: "info", text: "Unknown" });

  const fetchGateways = async (filters = {}, withPagination = true) => {
    showLoading("Fetching gateways...");
    try {
      const response = await $axios.get("/gateways/country/list", {
        params: {
          ...filters,
          pagination: withPagination,
        },
      });
      if (response.data.success) {
        gatewaysList.value = response.data.data.data;
        if (withPagination) {
          pagination.value = response.data.data;
        }
      } else {
        showError("Failed to fetch gateway");
      }
    } catch (error) {
      showError("Something went wrong while fetching gateways.");
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  const loadGatewayDetails = async () => {
    if (!isEditing.value) return;
    try {
      const response = await $axios.get(`/gateway/${gatewayId.value}`);
      gatewayData.value = response.data.data;
    } catch (error) {
      showError("Failed to load gateway details.");
      console.error(error);
    }
  };

  const loadGatewayRequirements = async () => {
    try {
      const response = await $axios.get(`/gateway/country/requirements`);

      gatewayRequirements.value = {
        gateways: response.data.data.gateways.map((g) => ({
          value: g.id,
          text: g.name,
        })),
        sending_countries: response.data.data.sending_countries.map((c) => ({
          value: c.id,
          text: c.name,
        })),
        receiving_countries: response.data.data.receiving_countries.map(
          (c) => ({ value: c.id, text: c.name })
        ),
        sending_methods: response.data.data.sending_methods.map((m) => ({
          value: m.id,
          text: m.name,
        })),
      };
    } catch (error) {
      showError("Failed to load gateway requirements.");
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  const saveGateway = async (isEdit, formData, gatewayId = null) => {
    try {
      const url = isEdit
        ? `/gateway/country/update/${gatewayId}`
        : "/gateway/country/add";
      const method = isEdit ? "patch" : "post";
      const payload = { ...formData };

      const response = await $axios({ method, url, data: payload });

      if (response.status === 200 || response.status === 201) {
        showSuccess(
          isEdit ? "Gateway updated successfully!" : "Gateway created successfully!"
        );
        setTimeout(() => router.push("/gateways"), 1500);
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

  const headers = ref([
    { title: "#", key: "sr_no" },
    { title: "Gateway", key: "gateway" },
    { title: "Sending Country", key: "sending_country" },
    { title: "Sending Method", key: "sending_method" },
    { title: "Status", key: "status" },
    { title: "Action", key: "action" },
  ]);

  const init = async () => {
    showLoading("Initializing...");
    try {
      await loadGatewayRequirements();

      if (route.path.includes("gateways")) {
        await fetchGateways();
      }

      if (route.path.includes("gateway") && gatewayId.value) {
        await loadGatewayDetails();
      }
    } catch (error) {
      console.error("Init error:", error);
      showError("Failed to initialize gateway data.");
    } finally {
      hideLoading();
    }
  };

  onMounted(init);


  return {
    headers,
    isEditing,
    gatewaysList,
    loading,
    options,
    filters,
    gatewayData,
    statuses,
    pagination,
    gatewayRequirements,
    loadGatewayDetails,
    fetchGateways,
    saveGateway,
    resolveStatusVariant,
  };
};
