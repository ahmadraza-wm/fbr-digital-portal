import useUiFeedback from "@/composables/useUiFeedback";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const {
  loading,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  confirmDialog,
  confirmAction,
  closeConfirm,
} = useUiFeedback();

export function usePartners() {
  const router = useRouter();
  const partners = ref([]);
  const partnerData = ref(null);
  const pagination = ref({});


  const statuses = [
    { value: 1, text: "Active" },
    { value: 0, text: "Inactive" },
  ];

  const partners_type = [{ title: "SC", value: "sc" }, { title: "DC", value: "dc" }];

  // Fetch All Partners
  const fetchPartners = async (filters = {}, withPagination = true) => {
    showLoading("Fetching partners...");
    try {
      const { $axios } = useNuxtApp();
      const response = await $axios.get("/partners/list", {
        params: {
          ...filters,
          pagination: withPagination,
        },
      });
      if (response.data.success) {
        partners.value = response.data.data.data;
        if (withPagination) {
          pagination.value = response.data.data;
        }
      } else {
        showError("Failed to fetch partners");
      }
    } catch (error) {
      showError("Something went wrong");
    } finally {
      hideLoading();
    }
  };

  // Fetch Partner Details
  const fetchPartnerDetails = async (id) => {
    try {
      const { $axios } = useNuxtApp();
      const response = await $axios.get(`/partner/${id}`);
      partnerData.value = response.data.data;
    } catch (error) {
      showError("Failed to fetch partner details");
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  // Save Partner
  const savePartner = async (isEdit, formData, partnerId = null) => {
    try {
      const { $axios } = useNuxtApp();
      const url = isEdit ? `/partner/update/${partnerId}` : "/partner/create";
      const method = isEdit ? "patch" : "post";
      const payload = { ...formData };

      if (isEdit) {
        delete payload.type;
      }

      const response = await $axios({ method, url, data: payload });

      if (response.status === 200 || response.status === 201) {
        showSuccess(
          isEdit
            ? "Partner updated successfully!"
            : "Partner created successfully!"
        );
        setTimeout(() => router.push("/partners"), 1500);
      }
    } catch (error) {
      console.error("Error saving partner:", error);

      const messages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()
        : error.response?.data?.message || "Something went wrong";

      showError(messages);
    } finally {
      hideLoading();
    }
  };

  const deletePartner = async (id) => {
    confirmAction("Are you sure you want to delete this partner?", async () => {
      showLoading("Deleting partner...");
      try {
        const { $axios } = useNuxtApp();
        await $axios.delete(`/partner/delete/${id}`);
        partners.value = partners.value.filter((partner) => partner.id !== id);
        showSuccess("Partner deleted successfully");
      } catch (error) {
        showError("Failed to delete partner.");
        console.error(error);
      } finally {
        hideLoading();
      }
    });
  };

  const resolveStatusVariant = (status) =>
  ({
    1: { color: "success", text: "Active" },
    0: { color: "error", text: "Inactive" },
  }[status] || { color: "info", text: "Unknown" });

  const headers = ref([
    { title: "#", key: "sr_no" },
    { title: "Name", key: "name" },
    { title: "User Name", key: "user_name" },
    { title: "Email", key: "email" },
    { title: "Partner Type", key: "type" },
    { title: "Settlement Currency", key: "settlement_currency" },
    { title: "Country", key: "country" },
    { title: "Status", key: "status" },
    { title: "Action", key: "action" },
  ]);


  const init = async () => {
    showLoading("Initializing...");
    try {
      await fetchPartners();
    } catch (error) {
      console.error("Init error:", error);
      showError("Failed to initialize partner data.");
    } finally {
      hideLoading();
    }
  };

  onMounted(init);

  return {
    partners,
    headers,
    partnerData,
    statuses,
    loading,
    pagination,
    partners_type,
    fetchPartners,
    fetchPartnerDetails,
    savePartner,
    resolveStatusVariant,
    deletePartner,
  };
}
