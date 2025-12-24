import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { useRouter } from "vue-router";


export function useSuggestion() {

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

    const suggestionlists = ref([]);

    const pagination = ref({});


    const filters = ref({
        customer_id: "",

    });

    const resetFilters = async () => {
        filters.value = {
            customer_id: "",
        };

        await fetchSuggestions()
    };


    const fetchSuggestions = async (filters = {}, withPagination = true) => {
        showLoading("Fetching Suggestions..");
        try {
            const response = await $axios.get("/suggestions/list", {
                params: {
                    ...filters,
                    pagination: withPagination,
                },
            });

            if (response.data.success) {
                suggestionlists.value = response.data.data.data;
                if (withPagination) {
                    pagination.value = response.data.data;
                }
            } else {
                showError("Failed to fetch Suggestions");
            }
        } catch (error) {
            console.error(error);
            showError("Something went wrong");
        } finally {
            hideLoading();
        }
    };


    const filtersuggestions = async (filters = {}) => {
        showLoading("Filtering suggestion...");
        try {
            const response = await $axios.get("suggestions/search/filter", {
                params: filters,
            });
            if (response.data.success) {
                suggestionlists.value = response.data.data.data;
            } else {
                showError("Failed to filter suggestion");
            }
        } catch (error) {
            console.error("Filter error:", error);
            showError("Something went wrong while filtering");
        } finally {
            hideLoading();
        }
    };


    return {
        suggestionlists,
        fetchSuggestions,
        filters,
        pagination,
        resetFilters,
        filtersuggestions,
    }




}    
