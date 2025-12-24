import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useTickers = () => {
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
        showLoading("Fetching tickers...");
        try {
            const response = await $axios.get("/tickers", {
                params: {
                    ...filters,
                    pagination: withPagination,
                },
            });

            console.log('response of tikers', response.data.data.data);

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

    const createTicker = async (formData) => {
        try {
            showLoading("Creating ticker...");
            const response = await $axios.post("/tickers/create", formData);

            if (response.status === 200 || response.status === 201) {
                showSuccess("Ticker created successfully!");
                setTimeout(() => router.push("/promotions/tickers"), 1500);
            }
        } catch (error) {
            console.error("Error creating ticker:", error);
            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";
            showError(messages);
        } finally {
            hideLoading();
        }
    };


    const deleteBank = async (id) => {
        confirmAction("Are you sure you want to delete this tickr?", async () => {
            showLoading("Deleting bank...");
            try {
                await $axios.delete(`/tickers/${id}`);
                bankList.value = bankList.value.filter((bank) => bank.id !== id);
                showSuccess("tickr deleted successfully");
            } catch (error) {
                showError("Failed to delete tickr.");
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
            showError("Failed to initialize tickrs data.");
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
            title: "Title",
            key: "ticker_title",
        },
        {
            title: "Discription",
            key: "ticker_description",
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
            title: "Agent",
            key: "agent",
        },
        {
            title: "Importance",
            key: "importance",
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
            title: "Added By",
            key: "added_by",
        },
         {
            title: "ACTION",
             key: "action",
         },
    ];

    const channelItem = ref([
        { title: "Agent", value: "agent" },
        { title: "Online", value: "online" },
    ]);

    const importanceItem = ref([
        { title: "High", value: "high" },
        { title: "Medium", value: "medium" },
        { title: "Low", value: "low" },
    ]);
    const statusItem = ref([
        { title: "All", value: "all" },
        { title: "Active", value: "active" },
        { title: "Expired", value: "expired" }
    ])

    return {
        agents,
        channelItem,
        importanceItem,
        headers,
        statusItem,
        pagination,
        deleteBank,
        createTicker,
        bankList,
        fetchBanks,
    };
};
