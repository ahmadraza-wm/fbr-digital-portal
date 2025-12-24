import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useRefrelCode = () => {
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
    const pagination = ref([]);

    const agents = ref([]);

    const options = ref({ itemsPerPage: 5, page: 1 });
    const walletId = computed(() => route.params.id || null);
    const isEditing = computed(() => !!walletId.value);

    const fetchAgents = async (filters = {}) => {
        showLoading("Fetching Agents...");
        try {
            const response = await $axios.get("/agents", { params: { ...filters, force_fetch: true } });

            if (response.data.success) {
                agents.value = response.data.data.data;
            } else {
                showError("Failed to fetch agents");
            }
        } catch (error) {
            console.error(error);
            showError("Something went wrong");
        } finally {
            hideLoading();
        }
    };

    const fetchBanks = async (filters = {}, withPagination = true) => {
        showLoading("Fetching refrel code...");

        try {
            const response = await $axios.get("/referral/codes", {
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
                showError("Failed to fetch refrel code");
            }
        } catch (error) {
            showError("Error fetching refrel code");
            console.error(error);
        } finally {
            hideLoading();
        }
    };

    const createFreeFeeTransfer = async (formData, isEdit = false, promotionId = null) => {
        try {
            showLoading(isEdit ? "Updating refrel code..." : "Creating refrel code...");

            let response;

            if (isEdit && promotionId) {
                response = await $axios.post(`/fee_free_transfers/${promotionId}?_method=PUT`, formData);
            } else {
                response = await $axios.post("/referral/codes", formData);
            }

            if ([200, 201].includes(response.status)) {
                showSuccess(isEdit ? "Fee transfer updated successfully!" : "Refrel code created successfully!");
                setTimeout(() => router.push("/promotions/refrel-code"), 1500);
            }
        } catch (error) {
            console.error("Error submitting refrel code:", error);
            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";
            showError(messages);
        } finally {
            hideLoading();
        }
    };


    const deleteBank = async (id) => {
        confirmAction("Are you sure you want to delete this refrel code?", async () => {
            showLoading("Deleting refrel code...");
            try {
                await $axios.delete(`/referral/codes/${id}`);
                bankList.value = bankList.value.filter((bank) => bank.id !== id);
                showSuccess("refrel code deleted successfully");
            } catch (error) {
                showError("Failed to delete refrel code.");
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
                fetchAgents(),
            ]);
        } catch (error) {
            console.error("Init error:", error);
            showError("Failed to initialize refrel code data.");
        } finally {
            hideLoading();
        }
    };

    onMounted(init);

    const transferItem = ref([
        { title: "Enable", value: 1 },
        { title: "Disabled", value: 0 }
    ])

    const headers = [
        {
            title: "#",
            key: "sr_no",
        },
        {
            title: "Referral Code",
            key: "referral_code",
        },
        {
            title: "Agent Name",
            key: "agent",
        },
        {
            title: "Country",
            key: "country",
        },
        {
            title: "Email",
            key: "email",
        },
        {
            title: "Phone",
            key: "phone",
        },
        {
            title: "Fee Free Transfers",
            key: "status",
        },
        {
            title: "No. of Tranactions",
            key: "number_of_transactions",
        },
        {
            title: "No. Of Days",
            key: "number_of_days",
        },
        {
            title: "Created At",
            key: "created_at",
        },
        {
            title: "ACTION",
            key: "action",
        },
    ];

    return {
        headers,
        transferItem,
        agents,
        deleteBank,
        fetchAgents,
        createFreeFeeTransfer,
        bankList,
        pagination,
        fetchBanks,
    };
};
