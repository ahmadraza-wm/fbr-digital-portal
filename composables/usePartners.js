import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const usePartners = () => {
    const { $axios } = useNuxtApp();
    const route = useRoute();
    const router = useRouter();
    const partnerDetail = ref();
    const {
        loading,
        showLoading,
        hideLoading,
        showSuccess,
        showError,
        confirmAction,
    } = useUiFeedback();

    const PartnersList = ref([]);
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

    const fetchPartners = async (filters = {}, withPagination = true) => {
        showLoading("Fetching Partners...");
        try {
            const response = await $axios.get("/partners");
            PartnersList.value = response.data.data;
            if (response.data.success) {
                showSuccess(response.data.message);
            }
            else {
                showError(response.data.message);
            }
        } catch (error) {
            console.error("Error Fetching Patrtners:", error);
            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";
            showError(messages);
        } finally {
            hideLoading();
        }
    };

    const savePartner = async (isEdit, formData, id = null) => {
        showLoading(
            isEdit
                ? "Updating Partner...."
                : "Creating Partner...."
        );
        try {
            const { $axios } = useNuxtApp();
            const url = isEdit ? `/partners/${id}` : "/partners";
            const method = isEdit ? "put" : "post";
            const payload = { ...formData };

            const response = await $axios({ method, url, data: payload });

            if (response.data.success) {
                showSuccess(response.data.message);
                setTimeout(() => router.push("/partners"), 1500);
            }
            else {
                showError(response.data.message);
            }
        } catch (error) {
            console.error("Error saving partner:", error);

            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";

            showError(messages);
        } finally {
            hideLoading();
        }
    };

    const fetchPartnerDetailsById = async (id) => {
        showLoading("Fetching Partner Details...");
        try {
            const response = await $axios.get(`/partners/${id}`);
            if (response.data.success) {
                showSuccess(response.data.message);
                partnerDetail.value = response.data.data;
            }
            else {
                showError(response.data.message);
            }
        } catch (error) {
            console.error("Error Fetching Partner Details:", error);

            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";

            showError(messages);
        } finally {
            hideLoading();
        }
    };

    const fetchPartnerConstants = async () => {
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

    const deletePartner = async (id) => {
        showLoading("Deleting Partner...");
        try {
            const response = await $axios.delete(`/partners/${id}`)
            if (response.data.success) {
                showSuccess(response.data.message);
                fetchPartners();
            }
            else {
                showError(response.data.message);
            }
        } catch (error) {
            console.error("Error Deleting Partner:", error);

            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";

            showError(messages);
        } finally {
            hideLoading();
        }
    };

    return {
        fetchPartners,
        PartnersList,
        loading,
        statuses,
        fetchPartners,
        partnerDetail,
        fetchPartnerDetailsById,
        fetchPartnerConstants,
        partnerConstant,
        deletePartner,
        savePartner
    };
};
