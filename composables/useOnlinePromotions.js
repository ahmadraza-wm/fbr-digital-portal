import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useOnlinePromotions = () => {
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
    const agents = ref([]);
    const pagination = ref({});


    const options = ref({ itemsPerPage: 5, page: 1 });
    const walletId = computed(() => route.params.id || null);
    const isEditing = computed(() => !!walletId.value);


    const fetchBanks = async (filters = {}, withPagination = true) => {
        showLoading("Fetching tickers...");

        try {
            const response = await $axios.get("/promotions", {
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
                showError("Failed to fetch tickrs");
            }
        } catch (error) {
            showError("Error fetching tickrs");
            console.error(error);
        } finally {
            hideLoading();
        }
    };

    const createOnlinePromotion = async (formData, isEdit = false, promotionId = null) => {
        try {
            showLoading(isEdit ? "Updating online promotion..." : "Creating online promotion...");

            let response;

            if (isEdit && promotionId) {
                response = await $axios.post(`/promotions/${promotionId}?_method=PUT`, formData);
            } else {
                response = await $axios.post("/promotions", formData);
            }

            if ([200, 201].includes(response.status)) {
                showSuccess(isEdit ? "Promotion updated successfully!" : "Promotion created successfully!");
                setTimeout(() => router.push("/promotions/online-promotions"), 1500);
            }
        } catch (error) {
            console.error("Error submitting promotion:", error);
            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";
            showError(messages);
        } finally {
            hideLoading();
        }
    };


    const deleteBank = async (id) => {
        confirmAction("Are you sure you want to delete this online promotion?", async () => {
            showLoading("Deleting Promotion...");
            try {
                await $axios.delete(`/promotions/${id}`);
                bankList.value = bankList.value.filter((bank) => bank.id !== id);
                showSuccess("Promotion deleted successfully");
            } catch (error) {
                showError("Failed to delete online promotion.");
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
            showError("Failed to initialize online promotion data.");
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
            title: "Channel",
            key: "channel",
        },
        {
            title: "Country",
            key: "country",
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
            title: "Type",
            key: "type",
        },
        {
            title: "Status",
            key: "status",
        },
        {
            title: "Added By",
            key: "created_by",
        },
        {
            title: "ACTION",
            key: "action",
        },
    ];

    const typeItem = ref([{
        title: "Desktop",
        value: "desktop"
    },
    {
        title: "Mobile",
        value: "mobile"
    }
    ]);

    const statusItem = ref([
        { title: "All", value: "all" },
        { title: "Active", value: "active" },
        { title: "Expired", value: "expired" }
    ])

    return {
        typeItem,
        loading,
        agents,
        headers,
        statusItem,
        deleteBank,
        createOnlinePromotion,
        bankList,
        pagination,
        fetchBanks,
    };
};
