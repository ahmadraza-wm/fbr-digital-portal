import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";


export function useAgentlimits(){

  const { $axios } = useNuxtApp();
    const route = useRoute();

    const {
        loading,
        showLoading,
        hideLoading,
        showSuccess,
        showError,
        confirmAction,
    } = useUiFeedback();


    const agentlimits = ref([]);


    const fetchAgentlimits = async (filters = {}) => {
        showLoading("Fetching Agentlimits...");
        try {
            const response = await $axios.get("/agent/limits", { params: filters });

            if (response.data.success) {
                agentlimits.value = response.data.data.data
            } else {
                showError("Failed to fetch agents");
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

    const saveAgentlimit = async (payload) => {
        showLoading("Saving Agentlimits...");
        try {
          const response = await $axios.post("/agent/limits", { limits: payload }); 
          if (response.status === 200 || response.status === 201) {
            showSuccess("Agentlimit updated successfully!");
          }
        } catch (error) {
          console.error("Agentlimit:", error);
          const messages = error.response?.data?.errors
            ? Object.values(error.response.data.errors).flat()
            : error.response?.data?.message || "Something went wrong";
          showError(messages);
        } finally {
          hideLoading();
        }
      };
      

   

    return {
        agentlimits,
        fetchAgentlimits,
        saveAgentlimit,
    };


}