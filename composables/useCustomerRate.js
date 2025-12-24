import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useCustomerRate = () => {
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

    const formData = ref(null);


    const filters = ref({
        country_id: "",
        name: "",
    });

    const walletData = ref({
        name: "",
        currency_id: null,
        country_id: null,
        method: "",
        status: null,
        min_limit: "",
        max_limit: "",
        transfer_prefix: "",
        sending_method_tags: [],
        sending_country_tags: [],
    });

    const options = ref({ itemsPerPage: 5, page: 1 });
    const walletId = computed(() => route.params.id || null);
    const isEditing = computed(() => !!walletId.value);

    const fetchBanks = async (filters = {}, withPagination = true) => {
        showLoading("Fetching customer rate...");

        try {
            const response = await $axios.get("/customerRates", {
                params: {
                    ...filters,
                    pagination: withPagination,
                },
            });

            if (response.data.success) {
                console.log(response.data);
                const rawData = response.data.data.data;


                bankList.value = rawData.map((item, index) => {
                    const isCustomer = item.promotional_type.toLowerCase() === "customer";
                    const customer = item.customer || {};

                    return {
                        sr_no: index + 1,
                        id: item.id,
                        s_country: item.sending_country,
                        r_country: item.receiving_country,
                        policy: item.promotional_type || "-",
                        customer_id: isCustomer && customer.id ? customer.id : null,
                        name: isCustomer ? customer.user?.name : "-",
                        type: isCustomer ? customer.type : "-",
                        rate: item.rate,
                        transaction: item.no_of_transactions,
                        expire_date: item.expiry_date,
                    };
                });
                if (withPagination) {
                    pagination.value = response.data.data;
                }

            } else {
                showError("Failed to fetch customer rate");
            }
        } catch (error) {
            showError("Error fetching banks");
            console.error(error);
        } finally {
            hideLoading();
        }
    };


    const fetchCustomerRate = async (id) => {
        try {
            const response = await $axios.get(`/customerRates/${id}`);
            const item = response.data.data;

            const isCustomer = item.promotional_type?.toLowerCase() === "customer";
            const customer = item.customer || {};

            const mapped = {
                id: item.id,
                promotional_type: item.promotional_type,
                rate: parseFloat(item.rate),
                rate_type: item.rate_type?.toLowerCase() === "increment" ? 2 : 3,
                no_of_transactions: item.no_of_transactions,
                min_amount: parseFloat(item.minimum_sending_amount),
                max_amount: parseFloat(item.maximum_sending_amount),
                expire_date: item.expiry_date,
                code: item.sales_code,
                r_country: item.receiving_country_id,
                r_country_name: item.receiving_country,

                ...(isCustomer
                    ? {
                        customer_name: customer.user?.name,
                        customer_id: customer?.id,
                    }
                    : {

                        days_since_transaction: item.days_since_transaction,
                        verified_status: item.verified_status?.toLowerCase(),
                        signup_from: item.signup_from,
                        signup_to: item.signup_to,
                        s_country: item.sending_country_id,

                        s_country_name: item.sending_country,

                    }),
            };

            formData.value = mapped;

        } catch (error) {
            showError("Failed to load customer rate");
            console.error(error);
        }
    };





    const submitForm = async (dataToSubmit, isEdit = false, id = null) => {
        try {
            showLoading(isEdit ? "Updating customer rate..." : "Creating customer rate...");

            const url = isEdit && id ? `/customerRates/${id}` : "/customerRates";
            const method = isEdit && id ? "patch" : "post";

            const response = await $axios[method](url, dataToSubmit);

            if (response.status === 200 || response.status === 201) {
                showSuccess(`Customer Rate ${isEdit ? "updated" : "created"} successfully!`);
                setTimeout(() => router.push("/promotions/customer-rate"), 1500);
            }

            fetchBanks(); // Refresh listing
        } catch (error) {
            console.error(`Error ${isEdit ? "updating" : "creating"} customer rate:`, error);
            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";
            showError(messages);
        } finally {
            hideLoading();
        }
    };


    const deleteBank = async (id) => {
        confirmAction("Are you sure you want to delete this customer rate?", async () => {
            showLoading("Deleting customer rate...");
            try {
                await $axios.delete(`/customerRates/${id}`);
                bankList.value = bankList.value.filter((bank) => bank.id !== id);
                showSuccess("Customer Rate deleted successfully");
            } catch (error) {
                showError("Failed to delete customer rate.");
                console.error(error);
            } finally {
                hideLoading();
            }
        });
    };


    const statusItem = ref([
        {
            title: "All",
            value: "all",
        },
        {
            title: "Verified",
            value: "verified",
        },
        {
            title: "Unverified",
            value: "unverified",
        },
    ]);

    const promotionalItem = ref([
        {
            title: "Country",
            value: "country",
        },
        {
            title: "Customer",
            value: "customer",
        },
    ]);

    const rateItem = ref([
        {
            title: "Select Type",
            value: 1,
        },
        {
            title: "Increment",
            value: 2,
        },
        {
            title: "Decrement",
            value: 3,
        },
    ]);


    const headers = [
        {
            title: "#",
            key: "sr_no",
        },
        {
            title: "Sending Country",
            key: "s_country",
        },
        {
            title: "Receving Country",
            key: "r_country",
        },
        {
            title: "Customer Policy",
            key: "policy",
        },
        {
            title: "Customer ID",
            key: "customer_id",
        },
        {
            title: "Customer Name",
            key: "name",
        },
        {
            title: "Type",
            key: "type",
        },
        {
            title: "Rate",
            key: "rate",
        },
        {
            title: "No of Transactions",
            key: "transaction",
        },
        {
            title: "Expiry Date",
            key: "expire_date",
        },
        {
            title: "ACTION",
            key: "action",
        },
    ];

    return {
        headers,
        isEditing,
        bankList,
        loading,
        options,
        filters,
        walletData,
        fetchBanks,
        submitForm,
        deleteBank,
        statusItem,
        promotionalItem,
        rateItem,
        fetchCustomerRate,
        formData,
        pagination,
    };
};
