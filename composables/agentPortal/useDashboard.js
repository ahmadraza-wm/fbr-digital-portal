import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { useRouter } from "vue-router";


export function useAgentDashboard() {

    const { $axios } = useNuxtApp();
    const router = useRouter();
    const banners = ref([]);
    const dashboardStats = ref({});
    const {
        loading,
        showLoading,
        hideLoading,
        showSuccess,
        showError,
        confirmAction,
    } = useUiFeedback();



    const fetchDashBoardStats = async (filters = {}, withPagination = true) => {
        showLoading("Fetching Stats...");
        try {
            const response = await $axios.get("/agent/portal/dashboard");

            if (response.data.status === "success") {
                dashboardStats.value = response.data.data;
            } else {
                showError("Failed to fetch stats");
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


    const getBanners = async () => {
        try {
            const res = await $axios.get("/banners", {
                params: { pagination: false },
            });
            console.log('banners test', res.data.data);

            if (res.data.success) {
                showSuccess(res.data.message);
                banners.value = res.data.data.banners.map(item => ({
                    image: item.media?.[0]?.url,
                    title: item.title,
                    description: item.description
                }));
            }
        } catch (error) {
            console.error("Error fetching banners:", error);
        }
    };

    return {
        dashboardStats,
        fetchDashBoardStats,
        getBanners,
        banners
    };


}    
