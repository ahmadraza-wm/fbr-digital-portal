import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { useRouter } from "vue-router";


export function useAgentSendMoney() {

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

    const sendMoneyDetails = ref();
    const RecivingCountries = ref([]);
    const cashDesitinations = ref();
    const transactionSuccess = ref();
    const paymentGateway = ref();
    const sendingReasons = [
        { text: 'Account Opening', value: 'account_opening' },
        { text: 'Family Maintenance', value: 'family_maintenance' },
        { text: 'Investment In Mutual Funds/Shares', value: 'investment_in_mutual_funds/shares' },
        { text: 'Loan Payment', value: 'loan_payment' },
        { text: 'Medical', value: 'medical' },
        { text: 'Saving', value: 'saving' },
        { text: 'Travel & Tourism', value: 'travel_and_tourism' }
    ];


    const formData = ref({
        customer_id: null,
        beneficiary_id: null,
        country_id: null,
        gateway_country_id: null,
        payer_id: null,
        sending_method: '',
        receiving_method: '',
        agent_rate: null,
        customer_rate: null,
        sending_currency: '',
        receiving_currency: '',
        sending_rate: 1,
        receiving_rate: null,
        sending_amount: null,
        discounted_amount: 0,
        receiving_amount: null,
        sending_reason: '',
        status: '',
        cash_destination_id: null,
        main_agent_rate: 0,
    })

    const getRecivingCountries = async (id) => {
        try {
            showLoading('Fetching receiving countries...')

            const response = await $axios.get(`agent/get/receiving/countries`)

            if (response.data.success) {
                RecivingCountries.value = response.data.data
            } else {
                showError("Failed to fetch receiving countries")
            }

        } catch (error) {
            const responseData = error.response?.data

            if (responseData?.errors) {
                Object.values(responseData.errors).flat().forEach(err => showError(err))
            } else {
                showError(responseData?.message || "Something went wrong")
            }
        } finally {
            hideLoading()
        }
    }
    const fetchSendMoneyDetails = async (country_id) => {
        showLoading("Fetching Send Money Details...");
        try {
            const response = await $axios.get("/agent/send/money/details", {
                params: {
                    receiving_country_id: country_id,
                },
            });

            if (response.data.success) {
                sendMoneyDetails.value = response.data.data
                showSuccess("Send Money Details Fetched Successfully");
            } else {
                showError(response.data.message);
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                const responseData = error.response.data;
                if (responseData.errors) {
                    const allErrors = Object.values(responseData.errors).flat();
                    allErrors.forEach(err => showError(err));
                } else if (responseData.message) {
                    showError(responseData.message);
                } else {
                    showError("Something went wrong.");
                }
            } else {
                showError(error.message || "Network error occurred.");
            }
        } finally {
            hideLoading();
        }
    };

    const fetchCashDestinationsLocations = async (id) => {
        showLoading("Fetching Cash Destinations Locations...");
        try {
            const response = await $axios.get(`/agent/payer/cash/destinations/${id}`);

            if (response.data.success) {
                cashDesitinations.value = response.data.data
                showSuccess(response.data.message);
            } else {
                showError(response.data.message);
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                const responseData = error.response.data;
                if (responseData.errors) {
                    const allErrors = Object.values(responseData.errors).flat();
                    allErrors.forEach(err => showError(err));
                } else if (responseData.message) {
                    showError(responseData.message);
                } else {
                    showError("Something went wrong.");
                }
            } else {
                showError(error.message || "Network error occurred.");
            }
        } finally {
            hideLoading();
        }
    };


    const storeTransactions = async (payload) => {
        showLoading("Fetching Cash Destinations Locations...");
        try {
            const response = await $axios.post(`/agent/transaction/store`, payload);

            if (response.data.success) {
                showSuccess(response.data.message);
                transactionSuccess.value = response.data.success;
            } else {
                showError(response.data.message);
                transactionSuccess.value = response.data.success;
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                const responseData = error.response.data;
                if (responseData.errors) {
                    const allErrors = Object.values(responseData.errors).flat();
                    allErrors.forEach(err => showError(err));
                } else if (responseData.message) {
                    showError(responseData.message);
                } else {
                    showError("Something went wrong.");
                }
                transactionSuccess.value = false;
            } else {
                showError(error.message || "Network error occurred.");
                transactionSuccess.value = false;
            }
        } finally {
            hideLoading();
        }
    };


    const getGateways = async (payload) => {
        try {
            const response = await $axios.get(`/agent/details/gateway`, {
                params: payload,
            });

            if (response.data.success) {
                paymentGateway.value = response.data.data;
            } else {
                showError(response.data.message);
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                const responseData = error.response.data;
                if (responseData.errors) {
                    const allErrors = Object.values(responseData.errors).flat();
                    allErrors.forEach(err => showError(err));
                } else if (responseData.message) {
                    showError(responseData.message);
                } else {
                    showError("Something went wrong.");
                }
            } else {
                showError(error.message || "Network error occurred.");
            }
        } finally {
            hideLoading();
        }
    };


    return {
        fetchSendMoneyDetails,
        sendMoneyDetails,
        getRecivingCountries,
        RecivingCountries,
        formData,
        sendingReasons,
        cashDesitinations,
        fetchCashDestinationsLocations,
        storeTransactions,
        transactionSuccess,
        getGateways,
        paymentGateway
    };
}
