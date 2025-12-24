import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { useCountryCurrencyStore } from "@/stores/useCountryCurrencyStore";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

export function useAdminFee() {
  const { $axios } = useNuxtApp();
  const router = useRouter();
  const rules = ref([]);
  const pagination = ref({});
  const ruleData = ref(null);
  const agents = ref([]);
  const payers = ref([]);
  const filteredPayers = ref([]); 
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
        console.log('fetch rules', rules.value);
        const unique = [];
      rules.value.forEach(rule => {
        if (rule.payer_id && rule.payer && !unique.some(p => p.id === rule.payer_id)) {
          unique.push({
            id: rule.payer_id,
            name: rule.payer,
          });
        }
      });

      filteredPayers.value = unique; 
      console.log("Unique payers:", filteredPayers.value);
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



  const fetchAgents = async () => {
    try {
      const res = await $axios.get("/agents?pagination=false&force_fetch=true");
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


  const headers = ref([
    { title: "#", key: "sr_no" },
    { title: "Rule ID", key: "id" },
    { title: "Rule Name", key: "name" },
    { title: "Agent Name", key: "agent" },
    { title: "Level", key: "id" },
    { title: "Zone", key: "zone" },
    { title: "Payer Name", key: "payer" },
    { title: "Currency", key: "currency" },
    { title: "From", key: "from" },
    { title: "To", key: "to" },
    { title: "Margin", key: "margin" },
    { title: "Margin Type", key: "type" },


    // { title: "Action", key: "action" },
  ]);


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
    agents,
    payers,
    fetchAgents,
    loading,
    pagination,
    fetchRules,
    countries,
    filteredPayers
  };


}
