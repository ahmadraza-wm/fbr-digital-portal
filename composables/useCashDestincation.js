import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

export function useCashDestincation() {
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

    const cashDestinations = ref([]);
    const pagination = ref({});


    const partners_type = ["sc", "dc"];

    const anyWhere = [
        { value: 1, text: "Yes" },
        { value: 0, text: "No" },
    ];

    const statuses = [
        { value: 1, text: "Active" },
        { value: 0, text: "Inactive" },
    ];

    const fetchCashDestinations = async (filters = {}, withPagination = true) => {
        showLoading("Fetching cash destinations...");
        try {
            const response = await $axios.get("/destinations", {
                params: {
                    ...filters,
                    pagination: withPagination,
                },
            });
            if (response.data.success) {
                cashDestinations.value = response.data.data.data;
                if (withPagination) {
                    pagination.value = response.data.data;
                }
            } else {
                showError("Failed to fetch cash destinations");
            }
        } catch (error) {
            console.error(error);
            showError("Something went wrong");
        } finally {
            hideLoading();
        }
    };


    const filterCashDestinations = async (filters = {}) => {
        showLoading("Filtering cash destinations...");
        try {
            const response = await $axios.get("/search/filter/destinations", {
                params: filters,
            });
            if (response.data.success) {
                cashDestinations.value = response.data.data.data;
            } else {
                showError("Failed to filter cash destinations");
            }
        } catch (error) {
            console.error("Filter error:", error);
            showError("Something went wrong while filtering");
        } finally {
            hideLoading();
        }
    };


    const saveCashDestination = async (formData) => {
        showLoading("Saving destination...");
        try {
            const response = await $axios.post("/destinations", formData);
            if (response.status === 200 || response.status === 201) {
                showSuccess("Cash destination added successfully!");
                setTimeout(() => router.push("/cash-destination"), 1500);
            }
        } catch (error) {
            console.error("Error saving cash destination:", error);
            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";
            showError(messages);
        } finally {
            hideLoading();
        }
    };

    const deleteCashDestination = async (id) => {
        confirmAction(
            "Are you sure you want to delete this cash destination?",
            async () => {
                showLoading("Deleting cash destination...");
                try {
                    await $axios.delete(`/destinations/${id}`);
                    cashDestinations.value = cashDestinations.value.filter(
                        (dest) => dest.id !== id
                    );
                    showSuccess("Cash destination deleted successfully.");
                } catch (error) {
                    console.error(error);
                    showError("Failed to delete cash destination.");
                } finally {
                    hideLoading();
                }
            }
        );
    };

    const resolveStatusVariant = (status) =>
    ({
        1: { color: "success", text: "Active" },
        0: { color: "error", text: "Inactive" },
    }[status] || { color: "info", text: "Unknown" });

    const headers = ref([
        { title: "#", key: "sr_no" },
        { title: "Destination Name", key: "destination_name" },
        { title: "Payer", key: "payer" },
        { title: "Country", key: "country" },
        { title: "City", key: "city_name" },
        { title: "Address", key: "address" },
        { title: "Any Where", key: "anywhere" },
        { title: "Status", key: "status" },
        { title: "Created By", key: "created_by" },
        { title: "Action", key: "action" },
    ]);

    const init = async () => {
        showLoading("Initializing...");
        try {
            await fetchCashDestinations();
        } catch (error) {
            console.error("Init error:", error);
            showError("Failed to initialize cash destination data.");
        } finally {
            hideLoading();
        }
    };

    onMounted(init);

    return {
        cashDestinations,
        filterCashDestinations,
        headers,
        loading,
        showError,
        showLoading,
        hideLoading,
        anyWhere,
        pagination,
        statuses,
        fetchCashDestinations,
        saveCashDestination,
        deleteCashDestination,
        resolveStatusVariant,
    };
}
