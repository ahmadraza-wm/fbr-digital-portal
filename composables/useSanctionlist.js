import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { useRoute } from "vue-router";
import { ref } from "vue";

export function useSanctionlist() {
  const { $axios } = useNuxtApp();
  const route = useRoute();

  const {
    loading,
    showLoading,
    hideLoading,
    showSuccess,
    showError,
  } = useUiFeedback();

  const sanctionlists = ref([]);


      const filterSanctionlist = async (filters = {}) => {
        showLoading("Filtering sanctions...");
        try {
            const response = await $axios.get("/sanction/list", {
                params: filters,
            });
          
            if (response.data.success) {
                sanctionlists.value = response.data.data;
            } else {
                showError("Failed to filter sanctions");
            }
        } catch (error) {
             console.error("Error filtering sanctionlist:", error);
            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";
            showError(messages);
        } finally {
            hideLoading();
        }
    };


  
    return {

        sanctionlists,
        filterSanctionlist




    }




}