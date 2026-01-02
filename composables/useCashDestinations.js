import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useCashDestinations = () => {
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

    const CashDestinationsList = ref([]);
    const DestDetail = ref();
    const statuses = [
        { value: true, text: "Active" },
        { value: false, text: "Inactive" },
    ];

    const anywhereList = [
        { value: true, text: "Yes" },
        { value: false, text: "No" },
    ];

    const resolveStatusVariant = (status) =>
    ({
        1: { color: "success", text: "Active" },
        0: { color: "error", text: "Inactive" },
    }[status] || { color: "info", text: "Unknown" });

    const fetchCashDestinations = async (filters = {}, withPagination = true) => {
        showLoading("Fetching Cash Destinations...");
        try {
            const response = await $axios.get("/cash-destinations");
            CashDestinationsList.value = response.data.data;
            if (response.data.success) {
                showSuccess(response.data.message);
            }
            else {
                showError(response.data.message);
            }
        } catch (error) {
            console.error("Error Fetching Cash Destinations:", error);
            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";
            showError(messages);
        } finally {
            hideLoading();
        }
    };

    const saveDestination = async (isEdit, formData, id = null) => {
        showLoading(
            isEdit
                ? "Updating Cash Destination...."
                : "Creating Cash Destination...."
        );
        try {
            const { $axios } = useNuxtApp();
            const url = isEdit ? `/cash-destinations/${id}` : "/cash-destinations";
            const method = isEdit ? "put" : "post";
            const payload = { ...formData };

            if (!isEdit) {
                delete payload.status;
            }

            const response = await $axios({ method, url, data: payload });

            if (response.data.success) {
                showSuccess(response.data.message);
                setTimeout(() => router.push("/cash-destinations"), 1500);
            }
            else {
                showError(response.data.message);
            }
        } catch (error) {
            console.error("Error Saving Cash Destinations:", error);

            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";

            showError(messages);
        } finally {
            hideLoading();
        }
    };

    const fetchDestinationDetailsById = async (id) => {
        showLoading("Fetching Cash Destinations Details...");
        try {
            const response = await $axios.get(`/cash-destinations/${id}`);
            if (response.data.success) {
                showSuccess(response.data.message);
                DestDetail.value = response.data.data;
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

    const fetchDestinationPartnersList = async (id) => {
        showLoading("Fetching Cash Destinations Parnters...");
        try {
            const response = await $axios.get(`/cash-destinations/${id}/partners`);
            if (response.data.success) {
                showSuccess(response.data.message);
                CashDestinationsList.value = response.data.data;
            }
            else {
                showError(response.data.message);
            }
        } catch (error) {
            console.error("Error Fetching Cash Destination Partners:", error);

            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";

            showError(messages);
        } finally {
            hideLoading();
        }
    };

    const saveDestinationPartner = async (isEdit, formData, DestId = null, partnerId = null) => {
        showLoading(
            isEdit
                ? "Updating Cash Destinations Partner...."
                : "Creating Cash Destinations Partner...."
        );
        try {
            const { $axios } = useNuxtApp();
            const url = isEdit ? `/cash-destinations/${DestId}/partners/${partnerId}` : `/cash-destinations/${DestId}/partners`;
            const method = isEdit ? "put" : "post";
            const payload = { ...formData };

            if (!isEdit) {
                delete payload.status;
            }

            const response = await $axios({ method, url, data: payload });

            if (response.data.success) {
                showSuccess(response.data.message);
                fetchDestinationPartnersList(DestId);
                return true;
            }
            else {
                showError(response.data.message);
                return false;
            }
        } catch (error) {
            console.error("Error Saving Cash Destinations Partner:", error);

            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";

            showError(messages);
            return false;
        } finally {
            hideLoading();
        }
    };

    const deleteDestinationPartner = async (DestId, partnerId) => {
        showLoading("Deleting Cash Destinations Partner...");
        try {
            const response = await $axios.delete(`/cash-destinations/${DestId}/partners/${partnerId}`)
            if (response.data.success) {
                showSuccess(response.data.message);
                fetchDestinationPartnersList(DestId);
            }
            else {
                showError(response.data.message);
            }
        } catch (error) {
            console.error("Error Deleting Cash Destinations Partner:", error);

            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";

            showError(messages);
        } finally {
            hideLoading();
        }
    };

    return {
        fetchCashDestinations,
        CashDestinationsList,
        loading,
        statuses,
        DestDetail,
        saveDestination,
        fetchCashDestinations,
        fetchDestinationDetailsById,
        fetchDestinationPartnersList,
        saveDestinationPartner,
        deleteDestinationPartner,
        anywhereList
    };
};
