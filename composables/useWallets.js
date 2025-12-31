import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useWallets = () => {
    const { $axios } = useNuxtApp();
    const route = useRoute();
    const router = useRouter();

    const {
        loading,
        showLoading,
        hideLoading,
        showSuccess,
        showError,
        confirmAction,
    } = useUiFeedback();

    const WalletsList = ref([]);
    const statuses = [
        { value: 1, text: "Active" },
        { value: 0, text: "Inactive" },
    ];

    const resolveStatusVariant = (status) =>
    ({
        1: { color: "success", text: "Active" },
        0: { color: "error", text: "Inactive" },
    }[status] || { color: "info", text: "Unknown" });

    const fetchWallets = async (filters = {}, withPagination = true) => {
        showLoading("Fetching Wallets...");
        try {
            const response = await $axios.get("/wallets");
            WalletsList.value = response.data.data;
            if (response.data.success) {
                showSuccess(response.data.message);
            }
            else {
                showError(response.data.message);
            }
        } catch (error) {
            console.error("Error Fetching Wallets:", error);
            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";
            showError(messages);
        } finally {
            hideLoading();
        }
    };
    return {
        fetchWallets,
        WalletsList,
        loading
    };
};
