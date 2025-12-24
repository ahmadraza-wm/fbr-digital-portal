import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useFreeFeeTransfer = () => {
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

    const bankList = ref([]);
    const pagination = ref({});
    const agents = ref([]);

    const options = ref({ itemsPerPage: 5, page: 1 });
    const walletId = computed(() => route.params.id || null);
    const isEditing = computed(() => !!walletId.value);

    const fetchBanks = async (filters = {}, withPagination = true) => {
        showLoading("Fetching fee transfer...");

        try {
            const response = await $axios.get("/fee_free_transfers", {
                params: {
                    ...filters,
                    pagination: withPagination,
                },
            });

            if (response.data.success) {
                bankList.value = response.data.data.data;
                if (withPagination) {
                    pagination.value = response.data.data;
                }
            } else {
                showError("Failed to fetch fee transfer");
            }
        } catch (error) {
            showError("Error fetching fee transfer");
            console.error(error);
        } finally {
            hideLoading();
        }
    };

    const createFreeFeeTransfer = async (formData, isEdit = false, promotionId = null) => {
        try {
            showLoading(isEdit ? "Updating fee transfer..." : "Creating fee transfer...");

            let response;

            if (isEdit && promotionId) {
                response = await $axios.post(`/fee_free_transfers/${promotionId}?_method=PUT`, formData);
            } else {
                response = await $axios.post("/fee_free_transfers", formData);
            }

            if ([200, 201].includes(response.status)) {
                showSuccess(isEdit ? "Fee transfer updated successfully!" : "Fee transfer created successfully!");
                setTimeout(() => router.push("/promotions/free-fee-transfer"), 1500);
            }
        } catch (error) {
            console.error("Error submitting fee transfer:", error);
            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";
            showError(messages);
        } finally {
            hideLoading();
        }
    };


    const deleteBank = async (id) => {
        confirmAction("Are you sure you want to delete this fee transfer?", async () => {
            showLoading("Deleting fee transfer...");
            try {
                await $axios.delete(`/fee_free_transfers/${id}`);
                bankList.value = bankList.value.filter((bank) => bank.id !== id);
                showSuccess("fee transfer deleted successfully");
            } catch (error) {
                showError("Failed to delete fee transfer.");
                console.error(error);
            } finally {
                hideLoading();
            }
        });
    };



    const init = async () => {
        showLoading("Initializing...");
        try {
            await Promise.all([
                fetchBanks(),
            ]);
        } catch (error) {
            console.error("Init error:", error);
            showError("Failed to initialize fee transfer data.");
        } finally {
            hideLoading();
        }
    };

    onMounted(init);

    const headers = [
        {
            title: "#",
            key: "sr_no",
        },
        {
            title: "Customer",
            key: "customer",
        },
        {
            title: "Sending Country",
            key: "sending_country",
        },
        {
            title: "Receving Country",
            key: "receiving_country",
        },
        {
            title: "Counter",
            key: "counter",
        },
        {
            title: "Percentage",
            key: "percentage",
        },
        {
            title: "Start At",
            key: "starts_at",
        },
        {
            title: "Expire At",
            key: "expires_at",
        },
        {
            title: "Status",
            key: "status",
        },
        {
            title: "ACTION",
            key: "action",
        },
    ];

    return {
        headers,
        deleteBank,
        createFreeFeeTransfer,
        bankList,
        pagination,
        fetchBanks,
    };
};
