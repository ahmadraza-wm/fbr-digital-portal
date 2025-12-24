import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { ref } from "vue";
import { useRouter } from "vue-router";

export function useThreshold() {
  const { $axios } = useNuxtApp();
  const router = useRouter();

  const {
    loading,
    showLoading,
    hideLoading,
    showSuccess,
    showError,
  } = useUiFeedback();

  // State
  const thresholdlists = ref([]);
  const pagination = ref([]);

  const thresholdRules = ref([]);
  const editIndex = ref(null);
  const documents = ref([]);


  const fetchDocuments = async () => {
    showLoading("Fetching documents...");
    try {
      const response = await $axios.get("/threshold/documents");
      if (response.data.success) {
        documents.value = response.data.data;
        console.log('threshold documents', documents.value)
        showSuccess("Documents loaded");
      } else {
        showError("Failed to fetch documents");
      }
    } catch (error) {
      console.error(error);
      showError("Error fetching documents");
    } finally {
      hideLoading();
    }
  };

  const fetchThresholdById = async (id) => {
    showLoading("Loading threshold...");
    try {
      const response = await $axios.get(`/thresholds/${id}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        showError("Threshold not found");
      }
    } catch (error) {
      console.error(error);
      showError("Error loading threshold");
    } finally {
      hideLoading();
    }
  };

  // Fetch all or filtered thresholds
  const fetchThreshold = async (filters = {}, withPagination = true) => {
    showLoading("Fetching Threshold...");
    try {
      const response = await $axios.get("/thresholds", {
        params: {
          ...filters,
          pagination: withPagination,
        },
      });
      if (response.data.success) {
        thresholdlists.value = response.data.data.data;
        if (withPagination) {
          pagination.value = response.data.data;
        }
      } else {
        showError("Failed to fetch Threshold");
      }
    } catch (error) {
      console.error(error);
      showError("Something went wrong");
    } finally {
      hideLoading();
    }
  };


  const deleteThreshold = async (id) => {
    if (!id) return;

    showLoading("Deleting Threshold...");
    try {
      const response = await $axios.delete(`/thresholds/${id}`);
      if (response.data.success) {
        showSuccess("Threshold deleted successfully");
        fetchThreshold();
      } else {
        showError("Failed to delete threshold");
      }
    } catch (error) {
      console.error(error);
      showError("Error deleting threshold");
    } finally {
      hideLoading();
    }
  };

  const filterThreshold = fetchThreshold;

  const addRule = (rule) => {
    if (editIndex.value !== null) {
      thresholdRules.value[editIndex.value] = rule;
      editIndex.value = null;
    } else {
      thresholdRules.value.push(rule);
    }
  };

  const editRule = (rule, index) => {
    editIndex.value = index;
  };

  const resetRuleForm = () => {
    editIndex.value = null;
  };

  // Submit full threshold to API
  const submitThreshold = async ({
    id,
    name,
    sending_country_id,
    receiving_country_ids,
    channel,
    edit = false,
  }) => {
    const payload = {
      name,
      sending_country_id,
      receiving_country_ids,
      channel,
      rules: thresholdRules.value.map((rule) => ({
        days: rule.day,
        limit: rule.limit,
        document_combination: rule.combination,
        primary_document_combination: rule.primaryCombination,
        secondary_document_combination: rule.secondaryCombination,
        documents: [
          ...(rule.primaryDocument || []).map(id => ({ document_id: id, documet_type: 'primary' })),
          ...(rule.secondaryDocument || []).map(id => ({ document_id: id, documet_type: 'secondary' })),
        ],
      })),
    };

    showLoading(edit ? "Updating Threshold..." : "Creating Threshold...");
    try {
      const response = edit
        ? await $axios.patch(`/thresholds/${id}`, payload)
        : await $axios.post("/thresholds", payload);

      if (response.data.success) {
        showSuccess(`Threshold ${edit ? "updated" : "created"} successfully`);
        setTimeout(() => router.push("/compliance/threshold"), 1500);
      } else {
        const messages = response.data.errors
          ? Object.values(response.data.errors).flat()
          : response.data.message || `Failed to ${edit ? "update" : "create"} Threshold`;

        showError(messages);
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

  return {
    loading,
    documents,
    deleteThreshold,
    fetchThresholdById,
    thresholdlists,
    fetchDocuments,
    thresholdRules,
    editIndex,
    fetchThreshold,
    filterThreshold,
    addRule,
    loading,
    pagination,
    editRule,
    resetRuleForm,
    submitThreshold,
  };
}
