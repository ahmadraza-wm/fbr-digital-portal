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
    const walletDetail = ref();
    const statuses = [
        { value: true, text: "Active" },
        { value: false, text: "Inactive" },
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

    const saveWallet = async (isEdit, formData, id = null) => {
        showLoading(
            isEdit
                ? "Updating Wallet...."
                : "Creating Wallet...."
        );
        try {
            const { $axios } = useNuxtApp();
            const url = isEdit ? `/wallets/${id}` : "/wallets";
            const method = isEdit ? "put" : "post";
            const payload = { ...formData };

            if (!isEdit) {
                delete payload.status;
            }

            const response = await $axios({ method, url, data: payload });

            if (response.data.success) {
                showSuccess(response.data.message);
                setTimeout(() => router.push("/wallets"), 1500);
            }
            else {
                showError(response.data.message);
            }
        } catch (error) {
            console.error("Error Saving Wallet:", error);

            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";

            showError(messages);
        } finally {
            hideLoading();
        }
    };

    const fetchWalletDetailsById = async (id) => {
        showLoading("Fetching Wallet Details...");
        try {
            const response = await $axios.get(`/wallets/${id}`);
            if (response.data.success) {
                showSuccess(response.data.message);
                walletDetail.value = response.data.data;
            }
            else {
                showError(response.data.message);
            }
        } catch (error) {
            console.error("Error Fetching Wallet Details:", error);

            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";

            showError(messages);
        } finally {
            hideLoading();
        }
    };

    const fetchWalletPartnersList = async (id) => {
        showLoading("Fetching Wallet Parnters...");
        try {
            const response = await $axios.get(`/wallets/${id}/partners`);
            if (response.data.success) {
                showSuccess(response.data.message);
                WalletsList.value = response.data.data;
            }
            else {
                showError(response.data.message);
            }
        } catch (error) {
            console.error("Error Fetching Wallet Partners:", error);

            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";

            showError(messages);
        } finally {
            hideLoading();
        }
    };

    const saveWalletPartner = async (isEdit, formData, walletId = null, partnerId = null) => {
        showLoading(
            isEdit
                ? "Updating Wallet Partner...."
                : "Creating Wallet Partner...."
        );
        try {
            const { $axios } = useNuxtApp();
            const url = isEdit ? `/wallets/${walletId}/partners/${partnerId}` : `/wallets/${walletId}/partners`;
            const method = isEdit ? "put" : "post";
            const payload = { ...formData };

            if (!isEdit) {
                delete payload.status;
            }

            const response = await $axios({ method, url, data: payload });

            if (response.data.success) {
                showSuccess(response.data.message);
                fetchWalletPartnersList(walletId);
                return true;
            }
            else {
                showError(response.data.message);
                return false;
            }
        } catch (error) {
            console.error("Error Saving Wallet Partner:", error);

            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";

            showError(messages);
            return false;
        } finally {
            hideLoading();
        }
    };
    
    const deleteWalletPartner = async (walletId, partnerId) => {
        showLoading("Deleting Wallet Partner...");
        try {
            const response = await $axios.delete(`/wallets/${walletId}/partners/${partnerId}`)
            if (response.data.success) {
                showSuccess(response.data.message);
                fetchWalletPartnersList(walletId);
            }
            else {
                showError(response.data.message);
            }
        } catch (error) {
            console.error("Error Deleting Wallet Partner:", error);

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
        loading,
        saveWallet,
        fetchWalletDetailsById,
        walletDetail,
        fetchWalletPartnersList,
        saveWalletPartner,
        statuses,
        deleteWalletPartner
    };
};
