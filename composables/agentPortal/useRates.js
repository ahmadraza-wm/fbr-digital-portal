import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { useRouter } from "vue-router";
import { ref, reactive, onMounted } from 'vue'


export function useAgentRates(){

const { $axios } = useNuxtApp();
const router = useRouter();
const sourceRates = ref();
const pagination = ref({});
    const {
        loading,
        showLoading,
        hideLoading,
        showSuccess,
        showError,
        confirmAction,
    } = useUiFeedback();
        
    const fetchSourceRates = async () => {
        showLoading("Fetching Source Rates...");
        try {
            const response = await $axios.get("/agent/source/rate");

            if (response.data.success) {
                sourceRates.value = response.data.data.source_rates.data
                showSuccess(response.data.message);
                pagination.value = response.data.data.source_rates;
            } else {
                showError(response.data.message);
            }
        } catch (error) {
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
    const  fetchAgentRatesFilters = async (filterParams = {}) => {
        showLoading("Filters Source Rates...");
        try {
            const response = await $axios.get(`/agent/source/rate/filter`,{
                params: filterParams,
            });

            if (response.data.success) {
                sourceRates.value = response.data.data.source_rates.data
                showSuccess(response.data.message);
                pagination.value = response.data.data.source_rates;
            } else {
                showError(response.data.message);
            }
        } catch (error) {
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
sourceRates,
fetchSourceRates,
pagination,
fetchAgentRatesFilters
};
}
