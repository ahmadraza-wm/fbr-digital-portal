import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { useRouter } from "vue-router";
import { ref, reactive, onMounted } from 'vue'


export function useAgentLedger(){

const { $axios } = useNuxtApp();
const router = useRouter();


    const {
        loading,
        showLoading,
        hideLoading,
        showSuccess,
        showError,
        confirmAction,
    } = useUiFeedback();

    const agentledgers = ref([]);
    const rows = ref([])
    const searched = ref(false)

    



    const filters = reactive({
        channel: null,
        main_agent_id: null,
        sub_agent_id: null,
        from_date: '',
        to_date: '',
    });


     const resetFilters = () => {
       filters.channel = '' 
      filters.from_date = '';
      filters.to_date = '';
      filters.main_agent_id = '';
      filters.sub_agent_id = '';

      rows.value = [];

      searched.value = false;
      agentledgers.value = [];
    };




        const filterAgentLedger = async (filters = {}) => {
        showLoading("Fetching AgentLedger...");
        try {
            const response = await $axios.get("/agent/ledgers", { params: filters });

            if (response.data.success) {
                agentledgers.value = response.data.data
                console.log('agentledgers data', agentledgers.value);
            } else {
                showError("Failed to fetch AgentLedger");
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
               const responseData = error.response.data;
            if (responseData.errors) {
                const allErrors = Object.values(responseData.errors).flat(); 
                allErrors.forEach(err => showError(err)); 
                } else if (responseData.message) {
                    showError(responseData.message);
                } else {
                    showError("Something went wrong.");
                }
        } else {
            showError(error.message || "Network error occurred.");
        }
        } finally {
            hideLoading();
        }
    };




return {
filterAgentLedger,
rows,
agentledgers,
resetFilters,
searched,
filters

};




}