import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { useCountryCurrencyStore } from "@/stores/useCountryCurrencyStore";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

export function useRules() {
  const { $axios } = useNuxtApp();
  const router = useRouter();
  const rules = ref([]);
  const pagination = ref({});
  const ruleData = ref(null);
  const agents = ref([]);
  const payers = ref([]);

  const {
    loading,
    showLoading,
    hideLoading,
    showSuccess,
    showError,
    confirmAction,
  } = useUiFeedback();


  const countryCurrencyStore = useCountryCurrencyStore();
  const { countries, currencies } = storeToRefs(countryCurrencyStore);

  const fetchAgents = async () => {
    try {
      const res = await $axios.get("/agents?pagination=false");
      agents.value = res.data.data.data;
    } catch (e) {
      console.error("Failed to fetch agents", e);
      showError("Failed to fetch agents.");
    }
  };

  const fetchPayers = async () => {
    try {
      const res = await $axios.get("/payers/list?pagination=false");
      payers.value = res.data.data.data;
    } catch (e) {
      console.error("Failed to fetch payers", e);
      showError("Failed to fetch payers.");
    }
  };

  const fetchRules = async (filters = {}, withPagination = true) => {
    showLoading("Fetching rules...");
    try {
      const response = await $axios.get("/rules", {
        params: {
          ...filters,
          pagination: withPagination,
        },
      });

      if (response.data.success) {
        rules.value = response.data.data.rules.data;
        if (withPagination) {
          pagination.value = response.data.data.rules;
        }
      } else {
        showError("Failed to fetch rules.");
      }
    }
    catch (error) {
      showError("Something went wrong while fetching rules.");
      console.error(error);
    } finally {
      hideLoading();
    }
  };


  const fetchRuleDetails = async (id) => {
    try {
      const response = await $axios.get(`/rules/${id}`);
      ruleData.value = response.data.data;
    } catch (error) {
      console.error("Error fetching rule details:", error);
      showError("Failed to fetch rule details.");
    } finally {
      hideLoading();
    }
  };

  const saveRule = async (isEdit, formData, partnerId = null) => {
    try {
      const url = isEdit ? `/rules/${partnerId}` : "/rules";
      const method = isEdit ? "patch" : "post";
      const payload = { ...formData };
      if (isEdit) delete payload.password;

      const response = await $axios({ method, url, data: payload });

      if (response.status === 200 || response.status === 201) {
        showSuccess(isEdit ? "Rule updated successfully!" : "Rule created successfully!");
        setTimeout(() => router.push("/rates/rule-search"), 1500);
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

  const deleteRule = async (id) => {
    confirmAction("Are you sure you want to delete this Rule?", async () => {
      try {
        await $axios.delete(`/rules/${id}`);
        rules.value = rules.value.filter((rule) => rule.id !== id);
        showSuccess("Rule deleted successfully");
      } catch (error) {
        showError("Failed to delete rule.");
        console.error(error);
      } finally {
        hideLoading();
      }
    });
  };

  const headers = ref([
    { title: "#", key: "sr_no" },
    { title: "Level", key: "id" },
    { title: "Name", key: "name" },
    { title: "Agent", key: "agent" },
    { title: "Group", key: "group" },
    { title: "Zone", key: "zone" },
    { title: "Payer", key: "payer" },
    { title: "Other Info", key: "type" },
    { title: "Action", key: "action" },
  ]);

  const channels = computed(() => [
    { title: "All", value: "all" },
    { title: "Online", value: "online" },
    { title: "Agent", value: "agent" },
  ]);

  const types = computed(() => [
    { title: "All", value: "all" },
    { title: "Spread", value: "spread" },
    { title: "Agent Fee", value: "agent_fee" },
    { title: "Admin Fee", value: "admin_fee" },
  ]);

  const validities = computed(() => [
    { title: "All", value: "all" },
    { title: "Expired", value: "expired" },
    { title: "Not Expired", value: "not_expired" },
  ]);

  const countriesWithAll = computed(() => [
    { id: "all", name: "All" },
    ...countries.value,
  ]);

  const sending_methods_tags = [
    { title: "All", value: "all" },
    { title: "Bank Transfer", value: "bank_transfer" },
    { title: "Cash", value: "cash" },
    { title: "Digital Wallet", value: "digital_wallet" },
    { title: "Debit Card", value: "debit_card" },
    { title: "Credit Card", value: "credit_card" },
  ];

  const receiving_methods_tags = [
    { title: "All", value: "all" },
    { title: "Bank", value: "bank" },
    { title: "Cash", value: "cash" },
    { title: "Mobile Wallet", value: "mobile_wallet" },
  ];

  const init = async () => {
    showLoading("Initializing...");
    try {
      await Promise.all([
        fetchAgents(),
        fetchPayers(),
        fetchRules(),
      ]);
    } catch (error) {
      console.error("Init error:", error);
      showError("Failed to initialize rules data.");
    } finally {
      hideLoading();
    }
  };

  onMounted(init);

  return {
    rules,
    headers,
    ruleData,
    payers,
    loading,
    channels,
    types,
    validities,
    countries,
    currencies,
    countriesWithAll,
    agents,
    sending_methods_tags,
    receiving_methods_tags,
    pagination,
    fetchRules,
    fetchRuleDetails,
    saveRule,
    deleteRule,
  };
}
