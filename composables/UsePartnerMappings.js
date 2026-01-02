import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const usePartnerMappings = () => {
    const { $axios } = useNuxtApp();
    const {
        loading,
        showLoading,
        hideLoading,
        showSuccess,
        showError,
        confirmAction,
    } = useUiFeedback();

    const PartnersMapList = ref([]);
    const statuses = [
        { value: true, text: "Active" },
        { value: false, text: "Inactive" },
    ];

    const resolveStatusVariant = (status) =>
    ({
        1: { color: "success", text: "Active" },
        0: { color: "error", text: "Inactive" },
    }[status] || { color: "info", text: "Unknown" });

    const fetchPartnersMapList = async (id) => {
        showLoading("Fetching Comapny Parnters Mappings...");
        try {
            const response = await $axios.get(`/companies/${id}/partner-mappings`);
            if (response.data.success) {
                showSuccess(response.data.message);
                PartnersMapList.value = response.data.data;
            }
            else {
                showError(response.data.message);
            }
        } catch (error) {
            console.error("Error Fetching Comapny Parnters Mappings:", error);

            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";

            showError(messages);
        } finally {
            hideLoading();
        }
    };

    const saveCompanyPartnerMap = async (isEdit, formData, company_id = null, partnerId = null) => {
        showLoading(
            isEdit
                ? "Updating Company Partner Mapping...."
                : "Creating Company Partner Mapping...."
        );
        try {
            const { $axios } = useNuxtApp();
            const url = isEdit ? `/company-partner-mappings/${partnerId}` : `/company-partner-mappings`;
            const method = isEdit ? "put" : "post";
            const payload = { ...formData };

            if (!isEdit) {
                delete payload.status;
            }
            else {
                delete payload.company_id;
            }

            const response = await $axios({ method, url, data: payload });

            if (response.data.success) {
                showSuccess(response.data.message);
                fetchPartnersMapList(company_id);
                return true;
            }
            else {
                showError(response.data.message);
                return false;
            }
        } catch (error) {
            console.error("Error Saving Company Partner Mapping:", error);

            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";

            showError(messages);
            return false;
        } finally {
            hideLoading();
        }
    };

    const deleteCompanyPartnerMap = async (customer_id,id) => {
        showLoading("Deleting Comapny Mapping Partner...");
        try {
            const response = await $axios.delete(`/company-partner-mappings/${id}`)
            if (response.data.success) {
                showSuccess(response.data.message);
                fetchPartnersMapList(customer_id);
            }
            else {
                showError(response.data.message);
            }
        } catch (error) {
            console.error("Error Deleting Comapny Mapping Partner:", error);

            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";

            showError(messages);
        } finally {
            hideLoading();
        }
    };

    return {
        PartnersMapList,
        fetchPartnersMapList,
        deleteCompanyPartnerMap,
        saveCompanyPartnerMap,
        loading,
        statuses
    };
};
