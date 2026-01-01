import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useBanks = () => {
    const { $axios } = useNuxtApp();
    const route = useRoute();
    const router = useRouter();
    const bankDetail = ref();
    const {
        loading,
        showLoading,
        hideLoading,
        showSuccess,
        showError,
        confirmAction,
    } = useUiFeedback();

    const BanksList = ref([]);
    const partnerConstant = ref();
    const statuses = [
        { value: true, text: "Active" },
        { value: false, text: "Inactive" },
    ];

    const resolveStatusVariant = (status) =>
    ({
        1: { color: "success", text: "Active" },
        0: { color: "error", text: "Inactive" },
    }[status] || { color: "info", text: "Unknown" });

    const fetchBanks = async (filters = {}, withPagination = true) => {
        showLoading("Fetching Banks...");
        try {
            const response = await $axios.get("/banks");
            BanksList.value = response.data.data;
            if (response.data.success) {
                showSuccess(response.data.message);
            }
            else {
                showError(response.data.message);
            }
        } catch (error) {
            console.error("Error Fetching Banks:", error);
            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";
            showError(messages);
        } finally {
            hideLoading();
        }
    };

    const saveBank = async (isEdit, formData, id = null) => {
        showLoading(
            isEdit
                ? "Updating Bank...."
                : "Creating Bank...."
        );
        try {
            const { $axios } = useNuxtApp();
            const url = isEdit ? `/banks/${id}` : "/banks";
            const method = isEdit ? "put" : "post";
            const payload = { ...formData };

            if (!isEdit) {
                delete payload.status;
            }

            const response = await $axios({ method, url, data: payload });

            if (response.data.success) {
                showSuccess(response.data.message);
                setTimeout(() => router.push("/banks"), 1500);
            }
            else {
                showError(response.data.message);
            }
        } catch (error) {
            console.error("Error saving bank:", error);

            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";

            showError(messages);
        } finally {
            hideLoading();
        }
    };

    const fetchBankDetailsById = async (id) => {
        showLoading("Fetching Bank Details...");
        try {
            const response = await $axios.get(`/banks/${id}`);
            if (response.data.success) {
                showSuccess(response.data.message);
                bankDetail.value = response.data.data;
            }
            else {
                showError(response.data.message);
            }
        } catch (error) {
            console.error("Error Fetching bank Details:", error);

            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";

            showError(messages);
        } finally {
            hideLoading();
        }
    };

    const fetchBankPartnersList = async (id) => {
        showLoading("Fetching Bank Parnters...");
        try {
            const response = await $axios.get(`/banks/${id}/partners`);
            if (response.data.success) {
                showSuccess(response.data.message);
                BanksList.value = response.data.data;
            }
            else {
                showError(response.data.message);
            }
        } catch (error) {
            console.error("Error Fetching bank Partners:", error);

            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";

            showError(messages);
        } finally {
            hideLoading();
        }
    };

    const saveBankPartner = async (isEdit, formData, bankId = null, partnerId = null) => {
        showLoading(
            isEdit
                ? "Updating Bank Partner...."
                : "Creating Bank Partner...."
        );
        try {
            const { $axios } = useNuxtApp();
            const url = isEdit ? `/banks/${bankId}/partners/${partnerId}` : `/banks/${bankId}/partners`;
            const method = isEdit ? "put" : "post";
            const payload = { ...formData };

            if (!isEdit) {
                delete payload.status;
            }

            const response = await $axios({ method, url, data: payload });

            if (response.data.success) {
                showSuccess(response.data.message);
                fetchBankPartnersList(bankId);
                return true;
            }
            else {
                showError(response.data.message);
                return false;
            }
        } catch (error) {
            console.error("Error Saving Bank Partner:", error);

            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";

            showError(messages);
            return false;
        } finally {
            hideLoading();
        }
    };

    const fetchPartnerConstants = async (id) => {
        showLoading("Fetching Parnter Constant...");
        try {
            const response = await $axios.get(`/system/partner-constants`);
            if (response.data.success) {
                showSuccess(response.data.message);
                partnerConstant.value = response.data.data;
            }
            else {
                showError(response.data.message);
            }
        } catch (error) {
            console.error("Error Fetching Partner Constant:", error);

            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";

            showError(messages);
        } finally {
            hideLoading();
        }
    };

    const deleteBankPartner = async (bankId, partnerId) => {
        showLoading("Deleting Bank Partner...");
        try {
            const response = await $axios.delete(`/banks/${bankId}/partners/${partnerId}`)
            if (response.data.success) {
                showSuccess(response.data.message);
                fetchBankPartnersList(bankId);
            }
            else {
                showError(response.data.message);
            }
        } catch (error) {
            console.error("Error Deleting Bank Partner:", error);

            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";

            showError(messages);
        } finally {
            hideLoading();
        }
    };

    return {
        fetchBanks,
        BanksList,
        loading,
        statuses,
        saveBank,
        bankDetail,
        fetchBankDetailsById,
        fetchBankPartnersList,
        saveBankPartner,
        fetchPartnerConstants,
        partnerConstant,
        deleteBankPartner
    };
};
